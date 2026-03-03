import { AddressLink } from '@/components/ui';
import type { Member } from '@/lib/dao/types';

interface Props {
  members: Member[];
  totalPower: string;
}

export function DaoMembers({ members, totalPower }: Props) {
  const total = parseInt(totalPower) || 1;

  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p>No members found</p>
      </div>
    );
  }

  // Sort by weight descending
  const sorted = [...members].sort((a, b) => b.weight - a.weight);

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs text-text-secondary font-medium px-4 py-3">Member</th>
            <th className="text-right text-xs text-text-secondary font-medium px-4 py-3">Weight</th>
            <th className="text-right text-xs text-text-secondary font-medium px-4 py-3">Voting Power</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((member) => {
            const pct = ((member.weight / total) * 100).toFixed(1);
            return (
              <tr key={member.addr} className="border-b border-border last:border-0 hover:bg-bg-tertiary/50">
                <td className="px-4 py-3">
                  <AddressLink address={member.addr} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-text-primary font-[family-name:var(--font-mono)]">
                    {member.weight}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-purple rounded-full"
                        style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-text-secondary w-14 text-right">{pct}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
