'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { connectWallet, getSavedAddress, getOfflineSigner } from '@/lib/wallet';
import { CHAIN } from '@/lib/chain';
import { DAO_CODE_IDS, isDaoDeployed } from '@/lib/dao/contracts';
import { buildDaoInstantiateMsg, DAO_CREATE_GAS } from '@/lib/dao/factory';
import type { DaoCreateFormData } from '@/lib/dao/types';
import { DaoCreateStep1 } from './DaoCreateStep1';
import { DaoCreateStep2 } from './DaoCreateStep2';
import { DaoCreateStep3 } from './DaoCreateStep3';
import { DaoCreateStep4 } from './DaoCreateStep4';
import { DaoCreateStep5 } from './DaoCreateStep5';

const INITIAL_FORM: DaoCreateFormData = {
  name: '',
  description: '',
  imageUrl: '',
  members: [{ address: '', weight: 1 }],
  threshold: { type: 'majority', value: '' },
  quorum: { type: 'percent', value: '0.20' },
  votingDurationSeconds: 259200, // 3 days
  allowRevoting: false,
};

const STEPS = ['Identity', 'Type', 'Members', 'Settings', 'Review'];

export function DaoCreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<DaoCreateFormData>(INITIAL_FORM);
  const [deploying, setDeploying] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const onChange = useCallback((updates: Partial<DaoCreateFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const validate = useCallback((): string | null => {
    if (step === 0 && !form.name.trim()) return 'DAO name is required';
    if (step === 2) {
      if (form.members.length === 0) return 'At least one member is required';
      for (const m of form.members) {
        if (!m.address.trim()) return 'All member addresses must be filled';
        if (!m.address.startsWith(CHAIN.prefix)) return `Address must start with "${CHAIN.prefix}"`;
      }
    }
    return null;
  }, [step, form]);

  const next = useCallback(() => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [validate]);

  const prev = () => { setError(''); setStep((s) => Math.max(s - 1, 0)); };

  const deploy = useCallback(async () => {
    if (!isDaoDeployed()) {
      setError('DAO contracts are not yet deployed on Dungeon Chain. Please set the code IDs in environment variables.');
      return;
    }

    setError('');
    setTxHash('');
    setDeploying(true);

    try {
      let address = getSavedAddress();
      if (!address) {
        address = await connectWallet();
      }

      const instantiateMsg = buildDaoInstantiateMsg(form);

      const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
      const { GasPrice } = await import('@cosmjs/stargate');

      const signer = await getOfflineSigner();
      const client = await SigningCosmWasmClient.connectWithSigner(CHAIN.rpc, signer as never, {
        gasPrice: GasPrice.fromString(`0.025${CHAIN.denom}`),
      });

      const result = await client.instantiate(
        address,
        DAO_CODE_IDS.core,
        instantiateMsg,
        form.name,
        'auto',
        { memo: 'Create Dungeon DAO', admin: address }
      );

      setTxHash(result.transactionHash);

      // Find the DAO contract address from events
      const daoAddr = result.contractAddress;
      if (daoAddr) {
        setTimeout(() => router.push(`/dao/${daoAddr}`), 2000);
      } else {
        setTimeout(() => router.push('/dao'), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'DAO creation failed');
    } finally {
      setDeploying(false);
    }
  }, [form, router]);

  const isLastStep = step === STEPS.length - 1;

  return (
    <div>
      {/* Progress steps */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                i === step
                  ? 'bg-accent-purple/20 text-accent-purple'
                  : i < step
                    ? 'text-accent-green cursor-pointer hover:bg-bg-tertiary'
                    : 'text-text-secondary'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                i < step
                  ? 'bg-accent-green text-white'
                  : i === step
                    ? 'bg-accent-purple text-white'
                    : 'bg-bg-tertiary text-text-secondary'
              }`}>
                {i < step ? '\u2713' : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-px mx-1 ${i < step ? 'bg-accent-green' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[300px]">
        {step === 0 && <DaoCreateStep1 form={form} onChange={onChange} />}
        {step === 1 && <DaoCreateStep2 />}
        {step === 2 && <DaoCreateStep3 form={form} onChange={onChange} />}
        {step === 3 && <DaoCreateStep4 form={form} onChange={onChange} />}
        {step === 4 && <DaoCreateStep5 form={form} />}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-3 text-accent-red text-sm mt-4">
          {error}
        </div>
      )}

      {/* Success */}
      {txHash && (
        <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-3 text-sm mt-4">
          <p className="text-accent-green mb-1">DAO created successfully!</p>
          <a
            href={`/txs/${txHash}`}
            className="text-accent-purple hover:underline font-[family-name:var(--font-mono)] text-xs break-all"
          >
            {txHash}
          </a>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
        <button
          onClick={prev}
          disabled={step === 0}
          className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 cursor-pointer"
        >
          Back
        </button>

        {isLastStep ? (
          <button
            onClick={deploy}
            disabled={deploying || !!txHash}
            className="px-6 py-2.5 rounded-lg bg-accent-green text-white text-sm font-medium hover:bg-accent-green/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {deploying ? 'Deploying...' : 'Deploy DAO'}
          </button>
        ) : (
          <button
            onClick={next}
            className="px-6 py-2.5 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors cursor-pointer"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
