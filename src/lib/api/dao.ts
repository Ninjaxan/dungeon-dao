// ── DAO API Query Functions ───────────────────────────────────────────────────
// Fetches DAO data from DAODAO contracts via CosmWasm smart queries.

import { rest } from './client';
import { ENDPOINTS } from '../chain';
import { DAO_CODE_IDS } from '../dao/contracts';
import { daoSmartQuery } from '../dao/queries';
import type {
  DaoConfig,
  DaoDumpState,
  DaoSummary,
  Member,
  MemberListResponse,
  ProposalConfig,
  ProposalListResponse,
  ProposalModuleInfo,
  ProposalResponse,
  ProposalSummary,
  SingleChoiceProposal,
  TotalPowerResponse,
  VoteInfo,
  VoteListResponse,
  VotingPowerResponse,
} from '../dao/types';

// ── DAO Discovery ────────────────────────────────────────────────────────────

interface ContractsResponse {
  contracts: string[];
  pagination: { next_key: string | null; total: string };
}

/** Fetch all DAO-core contract addresses by code ID */
export async function fetchDaoAddresses(): Promise<string[]> {
  if (DAO_CODE_IDS.core === 0) return [];

  try {
    const res = await rest.get<ContractsResponse>(
      ENDPOINTS.codeContracts(DAO_CODE_IDS.core),
      { revalidate: 60 }
    );
    return res.contracts || [];
  } catch {
    return [];
  }
}

/** Fetch summary list of all DAOs for the discovery page */
export async function fetchDaoList(): Promise<DaoSummary[]> {
  const addresses = await fetchDaoAddresses();
  if (addresses.length === 0) return [];

  const summaries = await Promise.all(
    addresses.map(async (address) => {
      try {
        return await fetchDaoSummary(address);
      } catch {
        return null;
      }
    })
  );

  return summaries.filter((s): s is DaoSummary => s !== null);
}

/** Fetch a single DAO summary (config + member count + active proposals) */
async function fetchDaoSummary(address: string): Promise<DaoSummary> {
  const [config, memberCount, activeProposals] = await Promise.all([
    fetchDaoConfig(address),
    fetchDaoMemberCount(address).catch(() => 0),
    fetchDaoActiveProposalCount(address).catch(() => 0),
  ]);

  return {
    address,
    name: config.name,
    description: config.description,
    imageUrl: config.image_url,
    memberCount,
    activeProposals,
  };
}

// ── DAO Core Queries ─────────────────────────────────────────────────────────

/** Fetch DAO config (name, description, image) */
export async function fetchDaoConfig(address: string): Promise<DaoConfig> {
  return daoSmartQuery<DaoConfig>(address, { config: {} });
}

/** Fetch full DAO dump state (config + modules + admin) */
export async function fetchDaoDumpState(address: string): Promise<DaoDumpState> {
  return daoSmartQuery<DaoDumpState>(address, { dump_state: {} });
}

/** Fetch DAO admin address */
export async function fetchDaoAdmin(address: string): Promise<string> {
  const res = await daoSmartQuery<{ admin: string }>(address, { admin: {} });
  return res.admin;
}

/** Fetch DAO proposal module addresses */
export async function fetchProposalModules(address: string): Promise<ProposalModuleInfo[]> {
  const res = await daoSmartQuery<ProposalModuleInfo[]>(
    address,
    { proposal_modules: { limit: 10 } }
  );
  return res;
}

/** Fetch DAO voting module address */
export async function fetchVotingModule(address: string): Promise<string> {
  return daoSmartQuery<string>(address, { voting_module: {} });
}

// ── Proposals ────────────────────────────────────────────────────────────────

/** Fetch all proposals from a DAO's proposal module */
export async function fetchDaoProposals(
  proposalModuleAddr: string,
  startAfter?: number,
  limit = 20
): Promise<{ proposals: ProposalSummary[]; hasMore: boolean }> {
  const query: Record<string, unknown> = { limit: limit + 1 };
  if (startAfter !== undefined) query.start_after = startAfter;

  const res = await daoSmartQuery<ProposalListResponse>(
    proposalModuleAddr,
    { list_proposals: query },
    15
  );

  const all = res.proposals.map(toProposalSummary);
  const hasMore = all.length > limit;
  return { proposals: all.slice(0, limit), hasMore };
}

/** Fetch a single proposal by ID */
export async function fetchDaoProposal(
  proposalModuleAddr: string,
  proposalId: number
): Promise<SingleChoiceProposal> {
  const res = await daoSmartQuery<ProposalResponse>(
    proposalModuleAddr,
    { proposal: { proposal_id: proposalId } },
    10
  );
  return res.proposal;
}

/** Fetch proposal config (threshold, voting period, etc.) */
export async function fetchProposalConfig(proposalModuleAddr: string): Promise<ProposalConfig> {
  return daoSmartQuery<ProposalConfig>(proposalModuleAddr, { config: {} });
}

/** Fetch votes for a proposal */
export async function fetchProposalVotes(
  proposalModuleAddr: string,
  proposalId: number,
  startAfter?: string,
  limit = 20
): Promise<{ votes: VoteInfo[]; hasMore: boolean }> {
  const query: Record<string, unknown> = { proposal_id: proposalId, limit: limit + 1 };
  if (startAfter) query.start_after = { voter: startAfter };

  const res = await daoSmartQuery<VoteListResponse>(
    proposalModuleAddr,
    { list_votes: query },
    10
  );

  const hasMore = res.votes.length > limit;
  return { votes: res.votes.slice(0, limit), hasMore };
}

/** Fetch a specific voter's vote */
export async function fetchVoterVote(
  proposalModuleAddr: string,
  proposalId: number,
  voter: string
): Promise<VoteInfo | null> {
  try {
    const res = await daoSmartQuery<{ vote: VoteInfo | null }>(
      proposalModuleAddr,
      { get_vote: { proposal_id: proposalId, voter } },
      0
    );
    return res.vote;
  } catch {
    return null;
  }
}

/** Count active (open) proposals for a DAO */
async function fetchDaoActiveProposalCount(daoAddress: string): Promise<number> {
  const modules = await fetchProposalModules(daoAddress);
  if (modules.length === 0) return 0;

  const { proposals } = await fetchDaoProposals(modules[0].address, undefined, 50);
  return proposals.filter((p) => p.status === 'open').length;
}

// ── Voting / Members ─────────────────────────────────────────────────────────

/** Fetch member list from the cw4-group contract (via voting module) */
export async function fetchDaoMembers(
  votingModuleAddr: string,
  startAfter?: string,
  limit = 20
): Promise<{ members: Member[]; hasMore: boolean }> {
  const groupAddr = await daoSmartQuery<string>(votingModuleAddr, { group_contract: {} });
  const query: Record<string, unknown> = { limit: limit + 1 };
  if (startAfter) query.start_after = startAfter;

  const res = await daoSmartQuery<MemberListResponse>(groupAddr, { list_members: query });
  const hasMore = res.members.length > limit;
  return { members: res.members.slice(0, limit), hasMore };
}

/** Fetch total voting power */
export async function fetchTotalPower(votingModuleAddr: string): Promise<TotalPowerResponse> {
  return daoSmartQuery<TotalPowerResponse>(votingModuleAddr, { total_power_at_height: {} });
}

/** Fetch a specific address's voting power */
export async function fetchVotingPower(
  votingModuleAddr: string,
  address: string
): Promise<VotingPowerResponse> {
  return daoSmartQuery<VotingPowerResponse>(
    votingModuleAddr,
    { voting_power_at_height: { address } },
    0
  );
}

/** Count members in a DAO */
async function fetchDaoMemberCount(daoAddress: string): Promise<number> {
  const votingModule = await fetchVotingModule(daoAddress);
  const members = await fetchDaoMembers(votingModule);
  return members.members.length;
}

// ── Treasury ─────────────────────────────────────────────────────────────────

export interface DaoBalance {
  denom: string;
  amount: string;
}

/** Fetch DAO treasury balances (native tokens held by the DAO core contract) */
export async function fetchDaoTreasury(daoAddress: string): Promise<DaoBalance[]> {
  try {
    const res = await rest.get<{ balances: DaoBalance[] }>(
      ENDPOINTS.balances(daoAddress),
      { revalidate: 30 }
    );
    return res.balances || [];
  } catch {
    return [];
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toProposalSummary(resp: ProposalResponse): ProposalSummary {
  const p = resp.proposal;
  return {
    id: resp.id,
    title: p.title,
    description: p.description,
    status: p.status,
    proposer: p.proposer,
    votes: p.votes,
    totalPower: p.total_power,
    expiration: p.expiration,
  };
}
