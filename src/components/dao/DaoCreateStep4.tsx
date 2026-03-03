import type { DaoCreateFormData } from '@/lib/dao/types';

interface Props {
  form: DaoCreateFormData;
  onChange: (updates: Partial<DaoCreateFormData>) => void;
}

const DURATION_PRESETS = [
  { label: '1 Hour', seconds: 3600 },
  { label: '1 Day', seconds: 86400 },
  { label: '3 Days', seconds: 259200 },
  { label: '1 Week', seconds: 604800 },
];

export function DaoCreateStep4({ form, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary mb-1">
          Governance Settings
        </h2>
        <p className="text-text-secondary text-sm">Configure voting rules for your DAO.</p>
      </div>

      {/* Threshold */}
      <div>
        <label className="block text-xs text-text-secondary mb-2">Passing Threshold</label>
        <div className="flex gap-2 mb-2">
          {(['majority', 'percent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChange({ threshold: { ...form.threshold, type: t, value: t === 'percent' ? '0.67' : '' } })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                form.threshold.type === t
                  ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                  : 'bg-bg-tertiary text-text-secondary border border-border'
              }`}
            >
              {t === 'majority' ? 'Majority (>50%)' : 'Custom %'}
            </button>
          ))}
        </div>
        {form.threshold.type === 'percent' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={(parseFloat(form.threshold.value) * 100).toFixed(0)}
              onChange={(e) => onChange({
                threshold: { ...form.threshold, value: (parseInt(e.target.value) / 100).toString() }
              })}
              min={1}
              max={100}
              className="w-24 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary text-center focus:outline-none focus:border-accent-purple"
            />
            <span className="text-sm text-text-secondary">%</span>
          </div>
        )}
      </div>

      {/* Quorum */}
      <div>
        <label className="block text-xs text-text-secondary mb-2">Quorum (minimum participation)</label>
        <div className="flex gap-2 mb-2">
          {(['majority', 'percent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChange({ quorum: { type: t, value: t === 'percent' ? '0.20' : '' } })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                form.quorum.type === t
                  ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                  : 'bg-bg-tertiary text-text-secondary border border-border'
              }`}
            >
              {t === 'majority' ? 'Majority (>50%)' : 'Custom %'}
            </button>
          ))}
        </div>
        {form.quorum.type === 'percent' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={(parseFloat(form.quorum.value) * 100).toFixed(0)}
              onChange={(e) => onChange({
                quorum: { type: 'percent', value: (parseInt(e.target.value) / 100).toString() }
              })}
              min={1}
              max={100}
              className="w-24 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary text-center focus:outline-none focus:border-accent-purple"
            />
            <span className="text-sm text-text-secondary">%</span>
          </div>
        )}
      </div>

      {/* Voting Duration */}
      <div>
        <label className="block text-xs text-text-secondary mb-2">Voting Duration</label>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map(({ label, seconds }) => (
            <button
              key={seconds}
              onClick={() => onChange({ votingDurationSeconds: seconds })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                form.votingDurationSeconds === seconds
                  ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                  : 'bg-bg-tertiary text-text-secondary border border-border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Allow Revoting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange({ allowRevoting: !form.allowRevoting })}
          className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${
            form.allowRevoting ? 'bg-accent-purple' : 'bg-bg-tertiary border border-border'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-0.5 ${
            form.allowRevoting ? 'translate-x-5' : ''
          }`} />
        </button>
        <div>
          <span className="text-sm text-text-primary">Allow revoting</span>
          <p className="text-xs text-text-secondary">Members can change their vote before expiration</p>
        </div>
      </div>
    </div>
  );
}
