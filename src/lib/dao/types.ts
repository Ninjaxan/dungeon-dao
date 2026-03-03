// ── DAODAO Contract Schema Types ──────────────────────────────────────────────
// Matches the on-chain JSON schemas from dao-dao-core, dao-proposal-single,
// dao-voting-cw4-group, and cw4-group contracts.

// ── DAO Core ──

export interface DaoConfig {
  name: string;
  description: string;
  image_url: string | null;
  automatically_add_cw20s: boolean;
  automatically_add_cw721s: boolean;
}

export interface DaoInfo {
  address: string;
  config: DaoConfig;
  proposalModules: ProposalModuleInfo[];
  votingModule: string;
  activeProposalCount: number;
  totalBalance: string;
  memberCount: number;
}

export interface ProposalModuleInfo {
  address: string;
  prefix: string;
  status: 'enabled' | 'disabled';
}

export interface DaoDumpState {
  admin: string;
  config: DaoConfig;
  version: { contract: string; version: string };
  proposal_modules: ProposalModuleInfo[];
  voting_module: string;
  active_proposal_module_count: number;
  total_proposal_module_count: number;
}

// ── Proposals (dao-proposal-single) ──

export type ProposalStatus =
  | 'open'
  | 'rejected'
  | 'passed'
  | 'executed'
  | 'closed'
  | 'execution_failed';

export interface SingleChoiceProposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  msgs: ProposalMessage[];
  status: ProposalStatus;
  expiration: Expiration;
  threshold: Threshold;
  total_power: string;
  votes: Votes;
  allow_revoting: boolean;
  min_voting_period: Expiration | null;
  start_height: number;
}

export interface Votes {
  yes: string;
  no: string;
  abstain: string;
}

export interface ProposalListResponse {
  proposals: ProposalResponse[];
}

export interface ProposalResponse {
  id: number;
  proposal: SingleChoiceProposal;
}

export interface ProposalMessage {
  bank?: {
    send: {
      to_address: string;
      amount: CosmosCoin[];
    };
  };
  wasm?: {
    execute: {
      contract_addr: string;
      msg: string; // base64
      funds: CosmosCoin[];
    };
  };
  stargate?: {
    type_url: string;
    value: string; // base64
  };
  custom?: unknown;
}

export interface CosmosCoin {
  denom: string;
  amount: string;
}

export type Expiration =
  | { at_height: number }
  | { at_time: string }  // nanoseconds
  | { never: Record<string, never> };

export type Threshold =
  | { absolute_percentage: { percentage: PercentageThreshold } }
  | { threshold_quorum: { threshold: PercentageThreshold; quorum: PercentageThreshold } }
  | { absolute_count: { threshold: string } };

export type PercentageThreshold =
  | { majority: Record<string, never> }
  | { percent: string };

// ── Voting (dao-voting-cw4-group / cw4-group) ──

export interface VotingPowerResponse {
  power: string;
  height: number;
}

export interface TotalPowerResponse {
  power: string;
  height: number;
}

export interface MemberListResponse {
  members: Member[];
}

export interface Member {
  addr: string;
  weight: number;
}

export interface VoteInfo {
  voter: string;
  vote: 'yes' | 'no' | 'abstain';
  power: string;
  rationale: string | null;
}

export interface VoteListResponse {
  votes: VoteInfo[];
}

// ── Pre-propose (dao-pre-propose-single) ──

export interface PreProposeConfig {
  deposit_info: DepositInfo | null;
  open_proposal_submission: boolean;
}

export interface DepositInfo {
  amount: string;
  denom: { token: { denom: { native: string } } } | { voting_module_token: Record<string, never> };
  refund_policy: 'always' | 'only_passed' | 'never';
}

// ── Proposal Config ──

export interface ProposalConfig {
  threshold: Threshold;
  max_voting_period: Duration;
  min_voting_period: Duration | null;
  allow_revoting: boolean;
  close_proposal_on_execution_failure: boolean;
}

export type Duration =
  | { height: number }
  | { time: number }; // seconds

// ── Frontend Display Types ──

export interface DaoSummary {
  address: string;
  name: string;
  description: string;
  imageUrl: string | null;
  memberCount: number;
  activeProposals: number;
}

export interface ProposalSummary {
  id: number;
  title: string;
  description: string;
  status: ProposalStatus;
  proposer: string;
  votes: Votes;
  totalPower: string;
  expiration: Expiration;
}

// ── DAO Creation Wizard Types ──

export interface DaoCreateFormData {
  name: string;
  description: string;
  imageUrl: string;
  members: { address: string; weight: number }[];
  threshold: { type: 'majority' | 'percent' | 'absolute'; value: string };
  quorum: { type: 'majority' | 'percent'; value: string };
  votingDurationSeconds: number;
  allowRevoting: boolean;
}
