# DEX WorkflowVerse

A powerful decentralized exchange (DEX) workflow automation platform that enables users to create, manage, and execute complex trading workflows with ease.

## Features

- **Interactive Workflow Builder**: Create and customize trading workflows using an intuitive drag-and-drop interface
- **Multiple Node Types**:
  - Swap Nodes: Execute token swaps
  - Liquidity Nodes: Manage liquidity pools
  - ExSat Nodes: Handle external satellite operations
- **Real-time Balance Tracking**: Monitor your token balances across different networks
- **Workflow Management**:
  - Save and load workflows
  - Execute workflows with a single click
  - View workflow execution history
- **Wallet Integration**: Seamless connection with Web3 wallets
- **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite for build tooling
  - ReactFlow for workflow visualization
  - TailwindCSS for styling
  - Zustand for state management
  - Sonner for toast notifications

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB for data persistence

## Getting Started

### Prerequisites

- Node.js (v20.18.0 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd dex-workflowverse
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and the server directory with the following variables:
```env
```

4. Start the development servers:
```bash
# Start frontend (from root directory)
npm run dev

# Start backend (from server directory)
cd server
npm start
```

## Project Structure

```
dex-workflowverse/
├── src/
│   ├── components/
│   │   ├── workflow/         # Workflow-related components
│   │   ├── layout/          # Layout components
│   │   ├── swap/           # Swap-related components
│   │   └── liquidity/      # Liquidity-related components
│   ├── pages/              # Page components
│   ├── store/              # State management
│   ├── services/           # API services
│   └── types/              # TypeScript type definitions
├── server/
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── services/          # Backend services
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- ReactFlow for the workflow visualization library
- TailwindCSS for the styling framework
- All other open-source libraries used in this project
