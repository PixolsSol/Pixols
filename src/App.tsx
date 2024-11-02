import React, { useState, useEffect } from 'react';
import { WalletContextProvider } from './components/WalletContextProvider';
import { PixelCanvas } from './components/PixelCanvas';
import { WalletButton } from './components/WalletButton';
import { Twitter } from 'lucide-react';
import { WelcomePopup } from './components/WelcomePopup';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome popup after a short delay
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="p-4 border-b border-gray-800">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Pixol</h1>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/pixolsolart"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Follow us</span>
              </a>
              <WalletButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <PixelCanvas />
        </main>
        <WelcomePopup isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      </div>
    </WalletContextProvider>
  );
}

export default App;