import { CHAIN } from '@/lib/chain';
import type { DaoCreateFormData } from '@/lib/dao/types';

interface Props {
  form: DaoCreateFormData;
  onChange: (updates: Partial<DaoCreateFormData>) => void;
}

export function DaoCreateStep3({ form, onChange }: Props) {
  const members = form.members;

  const addMember = () => {
    onChange({ members: [...members, { address: '', weight: 1 }] });
  };

  const removeMember = (index: number) => {
    if (members.length <= 1) return;
    onChange({ members: members.filter((_, i) => i !== index) });
  };

  const updateMember = (index: number, field: 'address' | 'weight', value: string | number) => {
    const updated = members.map((m, i) => {
      if (i !== index) return m;
      return { ...m, [field]: value };
    });
    onChange({ members: updated });
  };

  const totalWeight = members.reduce((sum, m) => sum + m.weight, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary mb-1">
          Members
        </h2>
        <p className="text-text-secondary text-sm">Add members and their voting weights.</p>
      </div>

      {/* Member list */}
      <div className="space-y-3">
        {members.map((member, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={member.address}
              onChange={(e) => updateMember(index, 'address', e.target.value)}
              placeholder={`${CHAIN.prefix}1...`}
              className="flex-1 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple font-[family-name:var(--font-mono)]"
            />
            <input
              type="number"
              value={member.weight}
              onChange={(e) => updateMember(index, 'weight', Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-20 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary text-center focus:outline-none focus:border-accent-purple"
            />
            <button
              onClick={() => removeMember(index)}
              disabled={members.length <= 1}
              className="p-2 text-text-secondary hover:text-accent-red transition-colors disabled:opacity-30 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addMember}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-accent-purple hover:text-accent-purple/80 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Member
      </button>

      {/* Summary */}
      <div className="bg-bg-tertiary/50 border border-border rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">{members.length} member{members.length !== 1 ? 's' : ''}</span>
          <span className="text-text-secondary">Total weight: <span className="text-text-primary font-medium">{totalWeight}</span></span>
        </div>
      </div>
    </div>
  );
}
