# Dungeon DAO

A DAODAO-style DAO management dapp for [Dungeon Chain](https://dungeongames.io), built with Next.js and CosmJS.

Users can create multisig DAOs, submit proposals, vote, manage treasuries, and discover other DAOs — all using [DAODAO's](https://daodao.zone) open-source CosmWasm contracts deployed on Dungeon Chain.

## Features

- **DAO Discovery** — Browse all DAOs on Dungeon Chain
- **Create DAO** — 5-step wizard to deploy a multisig DAO
- **Proposals** — Create text or treasury-spend proposals
- **Voting** — Vote Yes/No/Abstain via Keplr wallet
- **Execute** — Execute passed proposals on-chain
- **Treasury** — View DAO token balances
- **Members** — View members and voting power distribution

## Tech Stack

- **Next.js 16** (App Router, Server Components, ISR)
- **React 19**
- **Tailwind CSS 4**
- **CosmJS 0.38** (CosmWasm signing + queries)
- **DAODAO Contracts** (dao-dao-core, dao-proposal-single, dao-voting-cw4-group)

## Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your deployed contract code IDs
npm run dev
```

## Contract Deployment

Before the dapp is fully functional, deploy 5 DAODAO contracts to Dungeon Chain:

1. Download WASM binaries from [DAODAO releases](https://github.com/DA0-DA0/dao-contracts/releases)
2. Upload each contract:
   ```bash
   dungeond tx wasm store <file>.wasm --from deployer --gas auto --fees 50000udgn
   ```
3. Record the code IDs and set them in `.env.local`

### Required Code IDs

| Contract | Env Var |
|----------|---------|
| `dao_dao_core` | `NEXT_PUBLIC_DAO_CORE_CODE_ID` |
| `dao_proposal_single` | `NEXT_PUBLIC_DAO_PROPOSAL_SINGLE_CODE_ID` |
| `dao_pre_propose_single` | `NEXT_PUBLIC_DAO_PRE_PROPOSE_SINGLE_CODE_ID` |
| `dao_voting_cw4_group` | `NEXT_PUBLIC_DAO_VOTING_CW4_CODE_ID` |
| `cw4_group` | `NEXT_PUBLIC_DAO_CW4_GROUP_CODE_ID` |

## Project Structure

```
src/
  app/
    dao/
      page.tsx                          # DAO discovery (ISR)
      create/page.tsx                   # Create DAO wizard
      [address]/
        page.tsx                        # DAO detail + tabs
        proposals/
          create/page.tsx               # Create proposal
          [proposalId]/page.tsx         # Proposal detail + voting
  components/
    dao/                                # 20 DAO-specific components
    layout/                             # Header, WalletButton
    ui/                                 # Shared UI (AddressLink, etc.)
  lib/
    dao/
      types.ts                          # DAODAO contract type definitions
      contracts.ts                      # Code IDs from env vars
      queries.ts                        # Smart query helper
      messages.ts                       # Tx message builders
      factory.ts                        # DAO instantiation builder
    api/
      client.ts                         # REST client
      dao.ts                            # DAO query functions
    chain.ts                            # Dungeon Chain config
    wallet.ts                           # Keplr wallet integration
```

## License

MIT
