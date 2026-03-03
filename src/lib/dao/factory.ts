// ── DAO Factory: Composite Instantiation ─────────────────────────────────────
// Creates a single MsgInstantiateContract for dao-dao-core that internally
// instantiates voting + proposal modules via nested init messages.

import { DAO_CODE_IDS } from './contracts';
import type { DaoCreateFormData } from './types';

/** Build the full dao-dao-core instantiate message from wizard form data */
export function buildDaoInstantiateMsg(form: DaoCreateFormData) {
  const { name, description, imageUrl, members, threshold, quorum, votingDurationSeconds, allowRevoting } = form;

  // Build CW4-group init (member list) — nested inside voting module
  const cw4GroupInit = {
    members: members.map((m) => ({ addr: m.address, weight: m.weight })),
  };

  // Build voting module init (dao-voting-cw4-group)
  const votingModuleInit = {
    cw4_group_code_id: DAO_CODE_IDS.cw4Group,
    initial_members: cw4GroupInit.members,
  };

  // Build threshold config
  const thresholdConfig = buildThresholdConfig(threshold, quorum);

  // Build pre-propose init (dao-pre-propose-single)
  const preProposeInit = {
    deposit_info: null,
    open_proposal_submission: false,
    extension: {},
  };

  // Build proposal module init (dao-proposal-single)
  const proposalModuleInit = {
    threshold: thresholdConfig,
    max_voting_period: { time: votingDurationSeconds },
    min_voting_period: null,
    allow_revoting: allowRevoting,
    close_proposal_on_execution_failure: true,
    pre_propose_info: {
      module_may_propose: {
        info: {
          code_id: DAO_CODE_IDS.preProposeSingle,
          msg: toBase64(preProposeInit),
          admin: { core_module: {} },
          funds: [],
          label: `${name}_pre-propose-single`,
        },
      },
    },
  };

  // Build the top-level dao-dao-core instantiate message
  return {
    admin: null,
    name,
    description,
    image_url: imageUrl || null,
    automatically_add_cw20s: true,
    automatically_add_cw721s: true,
    voting_module_instantiate_info: {
      code_id: DAO_CODE_IDS.votingCw4,
      msg: toBase64(votingModuleInit),
      admin: { core_module: {} },
      funds: [],
      label: `${name}_voting-cw4`,
    },
    proposal_modules_instantiate_info: [
      {
        code_id: DAO_CODE_IDS.proposalSingle,
        msg: toBase64(proposalModuleInit),
        admin: { core_module: {} },
        funds: [],
        label: `${name}_proposal-single`,
      },
    ],
    initial_items: [],
  };
}

function buildThresholdConfig(
  threshold: DaoCreateFormData['threshold'],
  quorum: DaoCreateFormData['quorum']
) {
  const thresholdValue =
    threshold.type === 'majority'
      ? { majority: {} }
      : { percent: threshold.value };

  if (threshold.type === 'absolute') {
    return { absolute_count: { threshold: threshold.value } };
  }

  const quorumValue =
    quorum.type === 'majority'
      ? { majority: {} }
      : { percent: quorum.value };

  return {
    threshold_quorum: {
      threshold: thresholdValue,
      quorum: quorumValue,
    },
  };
}

function toBase64(obj: unknown): string {
  return btoa(JSON.stringify(obj));
}

/** Gas estimate for DAO creation (instantiates ~4 contracts) */
export const DAO_CREATE_GAS = '2000000';
