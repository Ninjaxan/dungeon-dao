import Link from 'next/link';
import type { DaoSummary } from '@/lib/dao/types';

interface Props {
  dao: DaoSummary;
}

export function DaoCard({ dao }: Props) {
  return (
    <Link
      href={`/dao/${dao.address}`}
      className="block bg-bg-secondary border border-border rounded-xl p-5 hover:border-border-glow transition-colors group"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center shrink-0 overflow-hidden">
          {dao.imageUrl ? (
            <img src={dao.imageUrl} alt={dao.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-accent-purple text-lg font-bold font-[family-name:var(--font-heading)]">
              {dao.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-primary font-[family-name:var(--font-heading)] truncate group-hover:text-accent-gold transition-colors">
            {dao.name}
          </h3>
          <p className="text-text-secondary text-sm mt-1 line-clamp-2">
            {dao.description || 'No description'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{dao.memberCount} member{dao.memberCount !== 1 ? 's' : ''}</span>
        </div>

        {dao.activeProposals > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-accent-gold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{dao.activeProposals} active</span>
          </div>
        )}
      </div>
    </Link>
  );
}
