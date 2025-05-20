import { ethers } from 'ethers';
import { toast } from 'sonner';

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

// Uniswap V2 Router address on Sepolia
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// Common ERC20 ABI for token interactions
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function symbol() public view returns (string)'
];

// Uniswap V2 Router ABI (minimal for swaps)
const ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)'
];

// RPC URLs for Sepolia
const SEPOLIA_RPC_URLS = [
  'https://sepolia.infura.io/v3/68593338a743493990dd00ac283f1d25',
  'https://rpc.sepolia.org',
  'https://rpc2.sepolia.org'
];

// Test token addresses on Sepolia
const TEST_TOKENS = {
  WETH: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
  DAI: '0x68194a729C2450ad26072b3D33ADaCbcef39D574',
  USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
};

export class DexService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private router: ethers.Contract | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, ROUTER_ABI, this.signer);
    }
  }

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on Sepolia
      const network = await this.provider?.getNetwork();
      if (network?.chainId !== 11155111) { // 11155111 is Sepolia's chainId
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // 0xaa36a7 is Sepolia's chainId in hex
          });
        } catch (switchError: any) {
          // If Sepolia is not added to MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: SEPOLIA_RPC_URLS,
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          } else if (switchError.code === 4001) {
            throw new Error('Please switch to Sepolia network to continue');
          } else {
            throw new Error(`Failed to switch network: ${switchError.message}`);
          }
        }
      }
      
      return accounts[0];
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  async getTokenBalance(tokenAddress: string, account: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await tokenContract.balanceOf(account);
      const decimals = await tokenContract.decimals();
      
      return ethers.utils.formatUnits(balance, decimals);
    } catch (error: any) {
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  async getTokenSymbol(tokenAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      return await tokenContract.symbol();
    } catch (error: any) {
      throw new Error(`Failed to get token symbol: ${error.message}`);
    }
  }

  async swapTokens(
    tokenInAddress: string,
    tokenOutAddress: string,
    amountIn: string,
    slippage: number = 0.5 // 0.5% default slippage
  ): Promise<string> {
    if (!this.signer || !this.router) {
      throw new Error('Wallet not connected');
    }

    try {
      const userAddress = await this.signer.getAddress();
      
      // Get token contracts
      const tokenIn = new ethers.Contract(tokenInAddress, ERC20_ABI, this.signer);
      const decimals = await tokenIn.decimals();
      const amountInWei = ethers.utils.parseUnits(amountIn, decimals);

      // Check balance
      const balance = await tokenIn.balanceOf(userAddress);
      if (balance.lt(amountInWei)) {
        const symbol = await this.getTokenSymbol(tokenInAddress);
        throw new Error(`Insufficient ${symbol} balance`);
      }

      // Get expected output amount
      const amounts = await this.router.getAmountsOut(
        amountInWei,
        [tokenInAddress, tokenOutAddress]
      );
      const amountOutMin = amounts[1].mul(1000 - slippage * 10).div(1000);

      // Check allowance
      const allowance = await tokenIn.allowance(userAddress, UNISWAP_ROUTER_ADDRESS);
      if (allowance.lt(amountInWei)) {
        toast.info('Approving token spend...');
        const approveTx = await tokenIn.approve(UNISWAP_ROUTER_ADDRESS, amountInWei);
        await approveTx.wait();
        toast.success('Token approval successful');
      }

      // Execute swap
      toast.info('Executing swap...');
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      const tx = await this.router.swapExactTokensForTokens(
        amountInWei,
        amountOutMin,
        [tokenInAddress, tokenOutAddress],
        userAddress,
        deadline
      );

      const receipt = await tx.wait();
      toast.success('Swap successful!', {
        description: `Transaction: ${receipt.transactionHash}`,
      });
      
      return receipt.transactionHash;
    } catch (error: any) {
      console.error('Swap error:', error);
      toast.error('Swap failed', {
        description: error.message || 'Unknown error occurred',
      });
      throw error;
    }
  }

  // Helper method to get test token addresses
  getTestTokens() {
    return TEST_TOKENS;
  }
}

export const dexService = new DexService(); 