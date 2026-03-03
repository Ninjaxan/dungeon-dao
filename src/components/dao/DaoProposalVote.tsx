'use client';

import { useState, useCallback } from 'react';
import { connectWallet, getSavedAddress, getOfflineSigner } from '@/lib/wallet';
import { CHAIN } from '@/lib/chain';
import { buildVoteMsg } from '@/lib/dao/messages';

interface Props {
  proposalModuleAddr: string;
  proposalId: number;
  status: string;
}

const VOTE_OPTIONS = [
  { label: 'Yes', value: 'yes' as const, color: 'bg-accent-green hover:bg-accent-green/80 text-white' },
  { label: 'Abstain', value: 'abstain' as const, color: 'bg-bg-tertiary hover:bg-border text-text-secondary' },
  { label: 'No', value: 'no' as const, color: 'bg-accent-red/80 hover:bg-accent-red text-white' },
];

export function DaoProposalVote({ proposalModuleAddr, proposalId, status }: Props) {
  const [voting, setVoting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const isOpen = status === 'open';

  const handleVote = useCallback(async (vote: 'yes' | 'no' | 'abstain') => {
    setError('');
    setTxHash('');
    setVoting(true);

    try {
      let address = getSavedAddress();
      if (!address) {
        address = await connectWallet();
      }

      const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
      const { GasPrice } = await import('@cosmjs/stargate');

      const signer = await getOfflineSigner();
      const client = await SigningCosmWasmClient.connectWithSigner(CHAIN.rpc, signer as never, {
        gasPrice: GasPrice.fromString(`0.025${CHAIN.denom}`),
      });

      const msg = buildVoteMsg(proposalId, vote);
      const result = await client.execute(address, proposalModuleAddr, msg, 'auto', 'Vote on DAO proposal');

      setTxHash(result.transactionHash);
      setExpanded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vote failed');
    } finally {
      setVoting(false);
    }
  }, [proposalModuleAddr, proposalId]);

  if (!isOpen) return null;

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <h3 className="font-semibold font-[family-name:var(--font-heading)] mb-3">Cast Your Vote</h3>

      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="px-6 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors cursor-pointer"
        >
          Vote on Proposal #{proposalId}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {VOTE_OPTIONS.map(({ label, value, color }) => (
              <button
                key={value}
                onClick={() => handleVote(value)}
                disabled={voting}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer ${color}`}
              >
                {voting ? '...' : label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="text-text-secondary text-xs hover:text-text-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-3 text-accent-red text-sm mt-3">
          {error}
        </div>
      )}

      {txHash && (
        <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-3 text-sm mt-3">
          <p className="text-accent-green mb-1">Vote submitted!</p>
          <a
            href={`/txs/${txHash}`}
            className="text-accent-purple hover:underline font-[family-name:var(--font-mono)] text-xs break-all"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}
