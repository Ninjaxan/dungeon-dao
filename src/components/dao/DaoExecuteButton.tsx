'use client';

import { useState, useCallback } from 'react';
import { connectWallet, getSavedAddress, getOfflineSigner } from '@/lib/wallet';
import { CHAIN } from '@/lib/chain';
import { buildExecuteMsg, buildCloseMsg } from '@/lib/dao/messages';

interface Props {
  proposalModuleAddr: string;
  proposalId: number;
  status: string;
}

export function DaoExecuteButton({ proposalModuleAddr, proposalId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const canExecute = status === 'passed';
  const canClose = status === 'rejected';

  const handleAction = useCallback(async (action: 'execute' | 'close') => {
    setError('');
    setTxHash('');
    setLoading(true);

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

      const msg = action === 'execute'
        ? buildExecuteMsg(proposalId)
        : buildCloseMsg(proposalId);

      const memo = action === 'execute'
        ? 'Execute passed DAO proposal'
        : 'Close rejected DAO proposal';

      const result = await client.execute(address, proposalModuleAddr, msg, 'auto', memo);
      setTxHash(result.transactionHash);
    } catch (err) {
      setError(err instanceof Error ? err.message : `${action} failed`);
    } finally {
      setLoading(false);
    }
  }, [proposalModuleAddr, proposalId]);

  if (!canExecute && !canClose) return null;

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      {canExecute && (
        <button
          onClick={() => handleAction('execute')}
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-lg bg-accent-green text-white text-sm font-medium hover:bg-accent-green/80 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Executing...' : 'Execute Proposal'}
        </button>
      )}

      {canClose && (
        <button
          onClick={() => handleAction('close')}
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary text-text-secondary text-sm font-medium hover:bg-border transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Closing...' : 'Close Proposal'}
        </button>
      )}

      {error && (
        <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-3 text-accent-red text-sm mt-3">
          {error}
        </div>
      )}

      {txHash && (
        <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-3 text-sm mt-3">
          <p className="text-accent-green mb-1">Transaction submitted!</p>
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
