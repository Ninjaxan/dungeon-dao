'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DaoProposalCard } from './DaoProposalCard';
import type { ProposalSummary, ProposalStatus } from '@/lib/dao/types';

interface Props {
  daoAddress: string;
  proposals: ProposalSummary[];
}

type StatusFilter = 'all' | ProposalStatus;

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'passed', label: 'Passed' },
  { key: 'executed', label: 'Executed' },
  { key: 'rejected', label: 'Rejected' },
];

export function DaoProposalList({ daoAddress, proposals }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return proposals;
    return proposals.filter((p) => p.status === filter);
  }, [proposals, filter]);

  return (
    <div>
      {/* Header with filters + create button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                filter === key
                  ? 'bg-accent-purple/20 text-accent-purple'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Link
          href={`/dao/${daoAddress}/proposals/create`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-purple text-white text-xs font-medium rounded-lg hover:bg-accent-purple/80 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Proposal
        </Link>
      </div>

      {/* Proposal list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>{proposals.length === 0 ? 'No proposals yet' : 'No proposals match this filter'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <DaoProposalCard key={p.id} daoAddress={daoAddress} proposal={p} />
          ))}
        </div>
      )}
    </div>
  );
}
