export const CHAIN = {
  chainId: 'dungeon-1',
  chainName: 'Dungeon Chain',
  denom: 'udgn',
  displayDenom: 'DGN',
  decimals: 6,
  prefix: 'dungeon',
  rest: 'https://rest.cosmos.directory/dungeon',
  rpc: 'https://rpc.cosmos.directory/dungeon',
  ws: 'wss://rpc.cosmos.directory/dungeon/websocket',
  explorerName: 'Dungeon Chain Explorer',
} as const;

export const ENDPOINTS = {
  // Bank
  balances: (addr: string) => `/cosmos/bank/v1beta1/balances/${addr}`,
  supply: () => '/cosmos/bank/v1beta1/supply',
  supplyDenom: (denom: string) => `/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`,

  // Blocks
  latestBlock: () => '/cosmos/base/tendermint/v1beta1/blocks/latest',
  block: (height: string | number) => `/cosmos/base/tendermint/v1beta1/blocks/${height}`,

  // Staking
  validators: (status = 'BOND_STATUS_BONDED') =>
    `/cosmos/staking/v1beta1/validators?status=${status}&pagination.limit=200`,
  validator: (addr: string) => `/cosmos/staking/v1beta1/validators/${addr}`,
  validatorDelegations: (addr: string) =>
    `/cosmos/staking/v1beta1/validators/${addr}/delegations?pagination.limit=100`,
  delegations: (addr: string) => `/cosmos/staking/v1beta1/delegations/${addr}`,
  pool: () => '/cosmos/staking/v1beta1/pool',

  // Distribution
  rewards: (addr: string) => `/cosmos/distribution/v1beta1/delegators/${addr}/rewards`,
  commission: (addr: string) => `/cosmos/distribution/v1beta1/validators/${addr}/commission`,

  // Slashing
  signingInfos: () => '/cosmos/slashing/v1beta1/signing_infos?pagination.limit=200',

  // Mint
  inflation: () => '/cosmos/mint/v1beta1/inflation',
  annualProvisions: () => '/cosmos/mint/v1beta1/annual_provisions',

  // Gov
  proposals: (status = '') =>
    `/cosmos/gov/v1/proposals${status ? `?proposal_status=${status}` : ''}`,
  proposal: (id: string | number) => `/cosmos/gov/v1/proposals/${id}`,
  proposalVotes: (id: string | number) => `/cosmos/gov/v1/proposals/${id}/votes?pagination.limit=100`,
  proposalDeposits: (id: string | number) => `/cosmos/gov/v1/proposals/${id}/deposits`,
  proposalTally: (id: string | number) => `/cosmos/gov/v1/proposals/${id}/tally`,

  // Tx
  tx: (hash: string) => `/cosmos/tx/v1beta1/txs/${hash}`,
  txsByHeight: (height: string | number) =>
    `/cosmos/tx/v1beta1/txs?query=tx.height%3D${height}&order_by=ORDER_BY_DESC`,
  txsByEvents: (events: string, page = 1, limit = 20) =>
    `/cosmos/tx/v1beta1/txs?query=${encodeURIComponent(events)}&order_by=ORDER_BY_DESC&pagination.offset=${(page - 1) * limit}&pagination.limit=${limit}`,

  // CosmWasm
  codes: () => '/cosmwasm/wasm/v1/code?pagination.limit=100',
  code: (id: string | number) => `/cosmwasm/wasm/v1/code/${id}`,
  codeContracts: (id: string | number) => `/cosmwasm/wasm/v1/code/${id}/contracts?pagination.limit=100`,
  contract: (addr: string) => `/cosmwasm/wasm/v1/contract/${addr}`,
  contractState: (addr: string) => `/cosmwasm/wasm/v1/contract/${addr}/state?pagination.limit=20`,
  contractSmartQuery: (addr: string, queryBase64: string) =>
    `/cosmwasm/wasm/v1/contract/${addr}/smart/${queryBase64}`,
} as const;
