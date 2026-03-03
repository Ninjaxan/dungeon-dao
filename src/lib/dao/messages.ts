// ── DAODAO Transaction Message Builders ───────────────────────────────────────
// Builds CosmWasm execute messages for proposals, voting, and member management.

import type { CosmosCoin, ProposalMessage } from './types';

/** Build a propose message for dao-pre-propose-single */
export function buildProposeMsg(
  title: string,
  description: string,
  msgs: ProposalMessage[] = []
) {
  return {
    propose: {
      msg: {
        propose: {
          title,
          description,
          msgs,
        },
      },
    },
  };
}

/** Build a bank send proposal message (treasury spend) */
export function buildBankSendMsg(
  toAddress: string,
  amount: CosmosCoin[]
): ProposalMessage {
  return {
    bank: {
      send: {
        to_address: toAddress,
        amount,
      },
    },
  };
}

/** Build a vote message for dao-proposal-single */
export function buildVoteMsg(proposalId: number, vote: 'yes' | 'no' | 'abstain') {
  return {
    vote: {
      proposal_id: proposalId,
      vote,
    },
  };
}

/** Build an execute message for dao-proposal-single (execute passed proposal) */
export function buildExecuteMsg(proposalId: number) {
  return {
    execute: {
      proposal_id: proposalId,
    },
  };
}

/** Build a close message for dao-proposal-single (close rejected proposal) */
export function buildCloseMsg(proposalId: number) {
  return {
    close: {
      proposal_id: proposalId,
    },
  };
}

/** Build an update_members message for cw4-group */
export function buildUpdateMembersMsg(
  add: { addr: string; weight: number }[],
  remove: string[]
) {
  return {
    update_members: {
      add,
      remove,
    },
  };
}
