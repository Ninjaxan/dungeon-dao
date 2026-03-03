'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

export type DaoTab = 'overview' | 'proposals' | 'treasury' | 'members';

interface Props {
  overview: ReactNode;
  proposals: ReactNode;
  treasury: ReactNode;
  members: ReactNode;
}

const TABS: { key: DaoTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'proposals', label: 'Proposals' },
  { key: 'treasury', label: 'Treasury' },
  { key: 'members', label: 'Members' },
];

export function DaoTabs({ overview, proposals, treasury, members }: Props) {
  const [active, setActive] = useState<DaoTab>('overview');

  const content: Record<DaoTab, ReactNode> = { overview, proposals, treasury, members };

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-border mb-6">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
              active === key
                ? 'border-accent-purple text-accent-purple'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active panel */}
      {content[active]}
    </div>
  );
}
