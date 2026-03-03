'use client';

import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, getSavedAddress } from '@/lib/wallet';

export function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setAddress(getSavedAddress());
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setAddress(null);
  };

  if (address) {
    return (
      <button
        onClick={handleDisconnect}
        className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary hover:border-border-glow transition-colors cursor-pointer font-[family-name:var(--font-mono)]"
        title={address}
      >
        {address.slice(0, 8)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="px-4 py-1.5 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
