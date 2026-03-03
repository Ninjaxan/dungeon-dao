import { CHAIN } from '@/lib/chain';
import type { DaoCreateFormData } from '@/lib/dao/types';

interface Props {
  form: DaoCreateFormData;
}

export function DaoCreateStep5({ form }: Props) {
  const totalWeight = form.members.reduce((sum, m) => sum + m.weight, 0);
  const thresholdLabel = form.threshold.type === 'majority'
    ? 'Majority (>50%)'
    : `${(parseFloat(form.threshold.value) * 100).toFixed(0)}%`;
  const quorumLabel = form.quorum.type === 'majority'
    ? 'Majority (>50%)'
    : `${(parseFloat(form.quorum.value) * 100).toFixed(0)}%`;

  const durationHours = form.votingDurationSeconds / 3600;
  const durationLabel = durationHours >= 24
    ? `${(durationHours / 24).toFixed(0)} day${durationHours >= 48 ? 's' : ''}`
    : `${durationHours.toFixed(0)} hour${durationHours !== 1 ? 's' : ''}`;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary mb-1">
          Review &amp; Deploy
        </h2>
        <p className="text-text-secondary text-sm">Review your DAO configuration before deploying to Dungeon Chain.</p>
      </div>

      {/* Summary card */}
      <div className="bg-bg-secondary border border-border rounded-xl divide-y divide-border">
        {/* Identity */}
        <div className="p-4">
          <h3 className="text-xs text-text-secondary mb-2">Identity</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center shrink-0 overflow-hidden">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-accent-purple font-bold">{form.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{form.name || 'Untitled DAO'}</p>
              <p className="text-xs text-text-secondary truncate max-w-[300px]">{form.description || 'No description'}</p>
            </div>
          </div>
        </div>

        {/* Governance */}
        <div className="p-4">
          <h3 className="text-xs text-text-secondary mb-2">Governance</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text-secondary text-xs">Type</p>
              <p className="text-text-primary">Multisig</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Threshold</p>
              <p className="text-text-primary">{thresholdLabel}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Quorum</p>
              <p className="text-text-primary">{quorumLabel}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Voting Duration</p>
              <p className="text-text-primary">{durationLabel}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Revoting</p>
              <p className="text-text-primary">{form.allowRevoting ? 'Allowed' : 'Not allowed'}</p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="p-4">
          <h3 className="text-xs text-text-secondary mb-2">
            Members ({form.members.length}) &middot; Total weight: {totalWeight}
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {form.members.map((m, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-text-primary font-[family-name:var(--font-mono)] text-xs truncate max-w-[280px]">
                  {m.address || '(empty)'}
                </span>
                <span className="text-text-secondary text-xs shrink-0 ml-2">
                  Weight: {m.weight} ({totalWeight > 0 ? ((m.weight / totalWeight) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost estimate */}
      <div className="bg-bg-tertiary/50 border border-border rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Estimated gas cost</span>
          <span className="text-accent-gold font-[family-name:var(--font-mono)]">
            ~0.05 {CHAIN.displayDenom}
          </span>
        </div>
      </div>
    </div>
  );
}
