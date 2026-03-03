// ── DAODAO Contract Code IDs ──────────────────────────────────────────────────
// Set via env vars after deploying DAODAO WASM binaries to Dungeon Chain.
// See: https://github.com/DA0-DA0/dao-contracts/releases

export const DAO_CODE_IDS = {
  /** dao-dao-core: DAO treasury, module management, metadata */
  core: parseInt(process.env.NEXT_PUBLIC_DAO_CORE_CODE_ID || '0', 10),
  /** dao-proposal-single: single-choice proposals (yes/no/abstain) */
  proposalSingle: parseInt(process.env.NEXT_PUBLIC_DAO_PROPOSAL_SINGLE_CODE_ID || '0', 10),
  /** dao-pre-propose-single: proposal deposit gate */
  preProposeSingle: parseInt(process.env.NEXT_PUBLIC_DAO_PRE_PROPOSE_SINGLE_CODE_ID || '0', 10),
  /** dao-voting-cw4-group: multisig-style voting */
  votingCw4: parseInt(process.env.NEXT_PUBLIC_DAO_VOTING_CW4_CODE_ID || '0', 10),
  /** cw4-group: membership list management */
  cw4Group: parseInt(process.env.NEXT_PUBLIC_DAO_CW4_GROUP_CODE_ID || '0', 10),
} as const;

/** Check if all required code IDs are configured */
export function isDaoDeployed(): boolean {
  return Object.values(DAO_CODE_IDS).every((id) => id > 0);
}
