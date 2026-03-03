import type { ProposalStatus } from '@/lib/dao/types';

interface Props {
  status: ProposalStatus;
}

const STATUS_STYLES: Record<ProposalStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20' },
  passed: { label: 'Passed', className: 'bg-accent-green/10 text-accent-green border-accent-green/20' },
  executed: { label: 'Executed', className: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20' },
  rejected: { label: 'Rejected', className: 'bg-accent-red/10 text-accent-red border-accent-red/20' },
  closed: { label: 'Closed', className: 'bg-bg-tertiary text-text-secondary border-border' },
  execution_failed: { label: 'Failed', className: 'bg-accent-red/10 text-accent-red border-accent-red/20' },
};

export function DaoProposalStatusBadge({ status }: Props) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.closed;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style.className}`}>
      {style.label}
    </span>
  );
}
