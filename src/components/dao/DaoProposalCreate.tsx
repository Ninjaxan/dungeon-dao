'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { connectWallet, getSavedAddress, getOfflineSigner } from '@/lib/wallet';
import { CHAIN } from '@/lib/chain';
import { buildProposeMsg, buildBankSendMsg } from '@/lib/dao/messages';
import type { ProposalMessage } from '@/lib/dao/types';

interface Props {
  daoAddress: string;
  preProposeAddr: string;
}

type ProposalType = 'text' | 'spend';

export function DaoProposalCreate({ daoAddress, preProposeAddr }: Props) {
  const router = useRouter();
  const [type, setType] = useState<ProposalType>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Spend fields
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    if (type === 'spend') {
      if (!recipient.trim()) { setError('Recipient address is required'); return; }
      if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError('Valid amount is required'); return;
      }
    }

    setError('');
    setTxHash('');
    setSubmitting(true);

    try {
      let address = getSavedAddress();
      if (!address) {
        address = await connectWallet();
      }

      const msgs: ProposalMessage[] = [];
      if (type === 'spend') {
        const microAmount = Math.floor(Number(amount) * Math.pow(10, CHAIN.decimals)).toString();
        msgs.push(buildBankSendMsg(recipient, [{ denom: CHAIN.denom, amount: microAmount }]));
      }

      const proposeMsg = buildProposeMsg(title, description, msgs);

      const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
      const { GasPrice } = await import('@cosmjs/stargate');

      const signer = await getOfflineSigner();
      const client = await SigningCosmWasmClient.connectWithSigner(CHAIN.rpc, signer as never, {
        gasPrice: GasPrice.fromString(`0.025${CHAIN.denom}`),
      });

      const result = await client.execute(
        address,
        preProposeAddr,
        proposeMsg,
        'auto',
        'Create DAO proposal'
      );

      setTxHash(result.transactionHash);
      setTimeout(() => router.push(`/dao/${daoAddress}`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create proposal');
    } finally {
      setSubmitting(false);
    }
  }, [title, description, type, recipient, amount, daoAddress, preProposeAddr, router]);

  return (
    <div className="max-w-2xl">
      {/* Type selector */}
      <div className="mb-6">
        <label className="block text-xs text-text-secondary mb-2">Proposal Type</label>
        <div className="flex gap-2">
          {(['text', 'spend'] as ProposalType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                type === t
                  ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                  : 'bg-bg-tertiary text-text-secondary border border-border hover:text-text-primary'
              }`}
            >
              {t === 'text' ? 'Text Proposal' : 'Treasury Spend'}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-xs text-text-secondary mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Proposal title"
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-xs text-text-secondary mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this proposal is about..."
          rows={6}
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple resize-y"
        />
      </div>

      {/* Spend fields */}
      {type === 'spend' && (
        <div className="mb-4 p-4 bg-bg-tertiary/50 border border-border rounded-lg space-y-3">
          <h3 className="text-sm font-medium text-text-primary">Treasury Spend Details</h3>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={`${CHAIN.prefix}1...`}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple font-[family-name:var(--font-mono)]"
            />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Amount ({CHAIN.displayDenom})</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.000001"
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple"
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="px-6 py-2.5 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {submitting ? 'Submitting...' : 'Create Proposal'}
      </button>

      {error && (
        <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-3 text-accent-red text-sm mt-4">
          {error}
        </div>
      )}

      {txHash && (
        <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-3 text-sm mt-4">
          <p className="text-accent-green mb-1">Proposal created!</p>
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
