export function DaoCreateStep2() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary mb-1">
          Governance Type
        </h2>
        <p className="text-text-secondary text-sm">Choose how voting power is distributed.</p>
      </div>

      {/* Multisig (active) */}
      <div className="bg-bg-secondary border-2 border-accent-purple rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-primary">Multisig</h3>
            <p className="text-text-secondary text-xs mt-1">
              Each member has an assigned voting weight. Best for small teams and treasuries.
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-accent-purple/10 text-accent-purple text-xs rounded">
              Selected
            </span>
          </div>
        </div>
      </div>

      {/* Token-weighted (coming soon) */}
      <div className="bg-bg-secondary border border-border rounded-xl p-5 opacity-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">Token-Weighted</h3>
            <p className="text-text-secondary text-xs mt-1">
              Voting power based on staked tokens. Coming in Phase 2.
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-bg-tertiary text-text-secondary text-xs rounded">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
