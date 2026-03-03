'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from './WalletButton';

const NAV = [
  { href: '/dao', label: 'DAOs' },
  { href: '/dao/create', label: 'Create' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/dao" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
              <span className="text-accent-purple font-bold text-sm">DD</span>
            </div>
            <span className="font-semibold text-text-primary font-[family-name:var(--font-heading)]">
              Dungeon DAO
            </span>
          </Link>

          {/* Center: Nav */}
          <nav className="flex items-center gap-0.5 mx-4">
            {NAV.map(({ href, label }) => {
              const isActive = href === '/dao'
                ? pathname === '/dao' || (pathname.startsWith('/dao/') && pathname !== '/dao/create')
                : pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-accent-gold bg-accent-gold/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Wallet */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://explorer.dungeongames.io"
              className="text-xs text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              Explorer
            </a>
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
