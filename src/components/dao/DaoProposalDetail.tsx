import { AddressLink } from '@/components/ui';
import { DaoProposalStatusBadge } from './DaoProposalStatus';
import { CHAIN } from '@/lib/chain';
import type { SingleChoiceProposal, VoteInfo } from '@/lib/dao/types';

interface Props {
  proposal: SingleChoiceProposal;
  proposalId: number;
  votes: VoteInfo[];
}

export function DaoProposalDetail({ proposal, proposalId, votes }: Props) {
  const totalVotes =
    parseInt(proposal.votes.yes) +
    parseInt(proposal.votes.no) +
    parseInt(proposal.votes.abstain);
  const totalPower = parseInt(proposal.total_power) || 1;
  const turnout = (totalVotes / totalPower) * 100;

  const yesPercent = totalVotes > 0 ? (parseInt(proposal.votes.yes) / totalVotes) * 100 : 0;
  const noPercent = totalVotes > 0 ? (parseInt(proposal.votes.no) / totalVotes) * 100 : 0;
  const abstainPercent = totalVotes > 0 ? (parseInt(proposal.votes.abstain) / totalVotes) * 100 : 0;

  // Decode expiration
  let expirationText = '';
  if ('at_time' in proposal.expiration) {
    const ms = parseInt(proposal.expiration.at_time) / 1_000_000;
    expirationText = new Date(ms).toLocaleString();
  } else if ('at_height' in proposal.expiration) {
    expirationText = `Block ${proposal.expiration.at_height}`;
  } else {
    expirationText = 'Never';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-text-secondary text-sm font-[family-name:var(--font-mono)]">
                Proposal #{proposalId}
              </span>
              <DaoProposalStatusBadge status={proposal.status} />
            </div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
              {proposal.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span>
            Proposed by <AddressLink address={proposal.proposer} />
          </span>
          <span>Expires: {expirationText}</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <h2 className="text-sm font-medium text-text-secondary mb-3">Description</h2>
        <div className="text-text-primary text-sm whitespace-pre-wrap">
          {proposal.description || 'No description provided.'}
        </div>
      </div>

      {/* Messages */}
      {proposal.msgs.length > 0 && (
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-text-secondary mb-3">
            Actions ({proposal.msgs.length})
          </h2>
          <div className="space-y-2">
            {proposal.msgs.map((msg, i) => (
              <div key={i} className="bg-bg-tertiary rounded-lg p-3 text-xs font-[family-name:var(--font-mono)] text-text-primary break-all">
                {msg.bank ? (
                  <div>
                    <span className="text-accent-gold">Bank Send</span>
                    <span className="text-text-secondary"> to </span>
                    <span>{msg.bank.send.to_address}</span>
                    <span className="text-text-secondary"> amount </span>
                    <span className="text-accent-gold">
                      {msg.bank.send.amount.map((c) => {
                        if (c.denom === CHAIN.denom) {
                          return `${(parseInt(c.amount) / Math.pow(10, CHAIN.decimals)).toFixed(2)} ${CHAIN.displayDenom}`;
                        }
                        return `${c.amount} ${c.denom}`;
                      }).join(', ')}
                    </span>
                  </div>
                ) : msg.wasm ? (
                  <div>
                    <span className="text-accent-purple">Wasm Execute</span>
                    <span className="text-text-secondary"> on </span>
                    <span>{msg.wasm.execute.contract_addr}</span>
                  </div>
                ) : (
                  <span>{JSON.stringify(msg)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vote Tally */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <h2 className="text-sm font-medium text-text-secondary mb-4">Vote Tally</h2>

        <div className="space-y-3">
          <VoteBar label="Yes" count={proposal.votes.yes} percent={yesPercent} color="bg-accent-green" />
          <VoteBar label="No" count={proposal.votes.no} percent={noPercent} color="bg-accent-red" />
          <VoteBar label="Abstain" count={proposal.votes.abstain} percent={abstainPercent} color="bg-text-secondary" />
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-text-secondary">
          <span>Turnout: {turnout.toFixed(1)}%</span>
          <span>Total Power: {totalPower}</span>
        </div>
      </div>

      {/* Individual votes */}
      {votes.length > 0 && (
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-text-secondary mb-3">
            Votes ({votes.length})
          </h2>
          <div className="space-y-2">
            {votes.map((v) => (
              <div key={v.voter} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <AddressLink address={v.voter} />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary font-[family-name:var(--font-mono)]">
                    {v.power}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    v.vote === 'yes' ? 'bg-accent-green/10 text-accent-green' :
                    v.vote === 'no' ? 'bg-accent-red/10 text-accent-red' :
                    'bg-bg-tertiary text-text-secondary'
                  }`}>
                    {v.vote.charAt(0).toUpperCase() + v.vote.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VoteBar({ label, count, percent, color }: { label: string; count: string; percent: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-text-primary">{label}</span>
        <span className="text-text-secondary">{count} ({percent.toFixed(1)}%)</span>
      </div>
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
