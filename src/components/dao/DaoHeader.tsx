import { AddressLink } from '@/components/ui';
import type { DaoConfig } from '@/lib/dao/types';

interface Props {
  address: string;
  config: DaoConfig;
  memberCount: number;
  proposalCount: number;
}

export function DaoHeader({ address, config, memberCount, proposalCount }: Props) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6 mb-6">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-xl bg-bg-tertiary border border-border flex items-center justify-center shrink-0 overflow-hidden">
          {config.image_url ? (
            <img src={config.image_url} alt={config.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-accent-purple text-2xl font-bold font-[family-name:var(--font-heading)]">
              {config.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
            {config.name}
          </h1>
          {config.description && (
            <p className="text-text-secondary text-sm mt-1">{config.description}</p>
          )}
          <div className="mt-2">
            <AddressLink address={address} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border">
        <StatItem label="Members" value={String(memberCount)} />
        <StatItem label="Proposals" value={String(proposalCount)} />
        <StatItem label="Type" value="Multisig" />
        <StatItem label="Status" value="Active" accent />
      </div>
    </div>
  );
}

function StatItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-text-secondary text-xs">{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${accent ? 'text-accent-green' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  );
}
