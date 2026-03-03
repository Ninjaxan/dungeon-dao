'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DaoCard } from './DaoCard';
import type { DaoSummary } from '@/lib/dao/types';

interface Props {
  daos: DaoSummary[];
}

type SortOption = 'name' | 'members' | 'active';

export function DaoList({ daos }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('members');

  const filtered = useMemo(() => {
    let result = daos;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'members') return b.memberCount - a.memberCount;
      return b.activeProposals - a.activeProposals;
    });

    return result;
  }, [daos, search, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search DAOs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Sort:</span>
          {(['members', 'active', 'name'] as SortOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                sort === opt
                  ? 'bg-accent-purple/20 text-accent-purple'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {opt === 'members' ? 'Members' : opt === 'active' ? 'Active' : 'Name'}
            </button>
          ))}
        </div>

        <div className="sm:ml-auto">
          <Link
            href="/dao/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-purple text-white text-sm font-medium rounded-lg hover:bg-accent-purple/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create DAO
          </Link>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          {daos.length === 0 ? (
            <div>
              <p className="text-lg mb-2">No DAOs found on Dungeon Chain</p>
              <p className="text-sm">Be the first to create one!</p>
            </div>
          ) : (
            <p>No DAOs match your search</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dao) => (
            <DaoCard key={dao.address} dao={dao} />
          ))}
        </div>
      )}
    </div>
  );
}
