import type { DaoCreateFormData } from '@/lib/dao/types';

interface Props {
  form: DaoCreateFormData;
  onChange: (updates: Partial<DaoCreateFormData>) => void;
}

export function DaoCreateStep1({ form, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary mb-1">
          DAO Identity
        </h2>
        <p className="text-text-secondary text-sm">Give your DAO a name and description.</p>
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1.5">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="My Dungeon DAO"
          maxLength={64}
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple"
        />
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What is this DAO for?"
          rows={4}
          maxLength={512}
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple resize-y"
        />
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1.5">Image URL (optional)</label>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => onChange({ imageUrl: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple"
        />
        {form.imageUrl && (
          <div className="mt-2 w-16 h-16 rounded-lg bg-bg-tertiary border border-border overflow-hidden">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
