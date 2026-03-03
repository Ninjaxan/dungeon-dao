import Link from 'next/link';
import { DaoProposalStatusBadge } from './DaoProposalStatus';
import type { ProposalSummary } from '@/lib/dao/types';

interface Props {
  daoAddress: string;
  proposal: ProposalSummary;
}

export function DaoProposalCard({ daoAddress, proposal }: Props) {
  const totalVotes =
    parseInt(proposal.votes.yes) +
    parseInt(proposal.votes.no) +
    parseInt(proposal.votes.abstain);
  const totalPower = parseInt(proposal.totalPower) || 1;
  const turnout = totalPower > 0 ? (totalVotes / totalPower) * 100 : 0;

  const yesPercent = totalVotes > 0 ? (parseInt(proposal.votes.yes) / totalVotes) * 100 : 0;
  const noPercent = totalVotes > 0 ? (parseInt(proposal.votes.no) / totalVotes) * 100 : 0;
  const abstainPercent = totalVotes > 0 ? (parseInt(proposal.votes.abstain) / totalVotes) * 100 : 0;

  return (
    <Link
      href={`/dao/${daoAddress}/proposals/${proposal.id}`}
      className="block bg-bg-secondary border border-border rounded-xl p-4 hover:border-border-glow transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-text-secondary text-xs font-[family-name:var(--font-mono)]">
              #{proposal.id}
            </span>
            <DaoProposalStatusBadge status={proposal.status} />
          </div>
          <h3 className="text-sm font-medium text-text-primary truncate">
            {proposal.title}
          </h3>
        </div>
      </div>

      {/* Vote tally bar */}
      {totalVotes > 0 && (
        <div className="mt-3">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-bg-tertiary">
            {yesPercent > 0 && (
              <div className="bg-accent-green" style={{ width: `${yesPercent}%` }} />
            )}
            {abstainPercent > 0 && (
              <div className="bg-text-secondary" style={{ width: `${abstainPercent}%` }} />
            )}
            {noPercent > 0 && (
              <div className="bg-accent-red" style={{ width: `${noPercent}%` }} />
            )}
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs text-text-secondary">
            <span>{turnout.toFixed(0)}% turnout</span>
            <span>{yesPercent.toFixed(0)}% Yes</span>
          </div>
        </div>
      )}
    </Link>
  );
}
