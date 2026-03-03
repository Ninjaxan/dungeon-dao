'use client';

import { useState, useEffect } from 'react';
import { getSavedAddress } from '@/lib/wallet';
import { fetchVotingPower, fetchTotalPower } from '@/lib/api/dao';

interface Props {
  votingModuleAddr: string;
}

export function DaoVotingPower({ votingModuleAddr }: Props) {
  const [power, setPower] = useState<string | null>(null);
  const [totalPower, setTotalPower] = useState<string | null>(null);

  useEffect(() => {
    const address = getSavedAddress();
    if (!address || !votingModuleAddr) return;

    Promise.all([
      fetchVotingPower(votingModuleAddr, address),
      fetchTotalPower(votingModuleAddr),
    ]).then(([vp, tp]) => {
      setPower(vp.power);
      setTotalPower(tp.power);
    }).catch(() => {});
  }, [votingModuleAddr]);

  if (!power || power === '0') return null;

  const total = parseInt(totalPower || '1');
  const pct = total > 0 ? ((parseInt(power) / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <h3 className="text-xs text-text-secondary mb-1">Your Voting Power</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-accent-purple font-[family-name:var(--font-heading)]">
          {power}
        </span>
        <span className="text-sm text-text-secondary">({pct}%)</span>
      </div>
    </div>
  );
}
