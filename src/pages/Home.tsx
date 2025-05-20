import React from 'react';
import { ArrowRight, Zap, Shield, Code, Workflow } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Simplify DeFi with Visual Workflows
            </h1>
            <p className="text-lg md:text-xl mb-8 text-indigo-200">
              Drag, drop, and deploy Bitcoin-backed DeFi operations without writing a single line of code. 
              Connect modules to create powerful financial workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-none"
                rightIcon={<ArrowRight />}
                onClick={handleGetStarted}
              >
                Start Building
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-indigo-300 text-white hover:bg-indigo-800/30"
                onClick={() => navigate('/learn')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        {/* Visual decoration */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Powerful DeFi Operations Made Simple
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col items-start h-full" padding="lg">
              <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
                <Workflow size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Visual Workflow Builder</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop DeFi operations into a visual canvas. Connect modules to create custom financial workflows.
              </p>
            </Card>
            
            <Card className="flex flex-col items-start h-full" padding="lg">
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">One-Click Execution</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Execute complex DeFi operations with a single click. No more hopping between protocols and interfaces.
              </p>
            </Card>
            
            <Card className="flex flex-col items-start h-full" padding="lg">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Bitcoin-Backed Security</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Built for Bitcoin-backed assets like sBTC, combining the security of Bitcoin with the flexibility of DeFi.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
              Ready to Streamline Your DeFi Experience?
            </h2>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              Join the DeFi revolution with DEX WorkflowVerse. Start building your custom workflows today.
            </p>
            <Button 
              size="lg"
              onClick={handleGetStarted}
              rightIcon={<ArrowRight />}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  DW
                </div>
                <span className="font-bold text-xl text-white">DEX WorkflowVerse</span>
              </div>
              <p className="mt-2 text-sm">
                Simplifying DeFi operations through visual workflows
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8 justify-center md:justify-end">
              <div>
                <h4 className="font-semibold text-white mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Roadmap</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>© {new Date().getFullYear()} DEX WorkflowVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};