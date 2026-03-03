import { CHAIN } from './chain';

const STORAGE_KEY = 'dungeon_wallet';

interface WalletProvider {
  experimentalSuggestChain(config: unknown): Promise<void>;
  enable(chainId: string): Promise<void>;
  getOfflineSigner(chainId: string): {
    getAccounts(): Promise<{ address: string; pubkey: Uint8Array }[]>;
  };
}

interface ProviderWindow {
  dungeon?: WalletProvider;
  keplr?: WalletProvider;
  cosmos?: WalletProvider;
}

/** Detect Dungeon Wallet (primary) or Keplr (fallback) */
function getProvider(): WalletProvider | undefined {
  const w = window as unknown as ProviderWindow;
  return w.dungeon ?? w.keplr ?? w.cosmos;
}

/** Wait up to 3s for the wallet provider to be injected */
function waitForProvider(): Promise<WalletProvider> {
  const existing = getProvider();
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('NO_WALLET'));
    }, 3000);

    function onReady() {
      const p = getProvider();
      if (p) {
        cleanup();
        resolve(p);
      }
    }

    function cleanup() {
      clearTimeout(timeout);
      window.removeEventListener('dungeon_loaded', onReady);
      window.removeEventListener('keplr#initialized', onReady);
    }

    window.addEventListener('dungeon_loaded', onReady);
    window.addEventListener('keplr#initialized', onReady);
  });
}

async function suggestChain(provider: WalletProvider) {
  await provider.experimentalSuggestChain({
    chainId: CHAIN.chainId,
    chainName: CHAIN.chainName,
    rpc: CHAIN.rpc,
    rest: CHAIN.rest,
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: CHAIN.prefix,
      bech32PrefixAccPub: `${CHAIN.prefix}pub`,
      bech32PrefixValAddr: `${CHAIN.prefix}valoper`,
      bech32PrefixValPub: `${CHAIN.prefix}valoperpub`,
      bech32PrefixConsAddr: `${CHAIN.prefix}valcons`,
      bech32PrefixConsPub: `${CHAIN.prefix}valconspub`,
    },
    currencies: [
      { coinDenom: CHAIN.displayDenom, coinMinimalDenom: CHAIN.denom, coinDecimals: CHAIN.decimals },
    ],
    feeCurrencies: [
      {
        coinDenom: CHAIN.displayDenom,
        coinMinimalDenom: CHAIN.denom,
        coinDecimals: CHAIN.decimals,
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 },
      },
    ],
    stakeCurrency: {
      coinDenom: CHAIN.displayDenom,
      coinMinimalDenom: CHAIN.denom,
      coinDecimals: CHAIN.decimals,
    },
  });
}

export async function connectWallet(): Promise<string> {
  const provider = await waitForProvider();

  await suggestChain(provider);
  await provider.enable(CHAIN.chainId);

  const signer = provider.getOfflineSigner(CHAIN.chainId);
  const accounts = await signer.getAccounts();
  const address = accounts[0].address;

  localStorage.setItem(STORAGE_KEY, address);
  return address;
}

export function disconnectWallet() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSavedAddress(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

// ── Signing client for marketplace transactions ─────────────────────────────

/** Get an offline signer for the connected wallet */
export async function getOfflineSigner() {
  const provider = await waitForProvider();
  await suggestChain(provider);
  await provider.enable(CHAIN.chainId);
  return provider.getOfflineSigner(CHAIN.chainId);
}

/** Execute a marketplace buy transaction */
export async function executeMarketplaceBuy(
  marketplaceContract: string,
  listingId: string,
  price: string,
  denom: string
): Promise<string> {
  const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
  const { GasPrice } = await import('@cosmjs/stargate');

  const signer = await getOfflineSigner();
  const accounts = await signer.getAccounts();
  const sender = accounts[0].address;

  const client = await SigningCosmWasmClient.connectWithSigner(CHAIN.rpc, signer as any, {
    gasPrice: GasPrice.fromString(`0.025${CHAIN.denom}`),
  });

  const result = await client.execute(
    sender,
    marketplaceContract,
    { buy: { listing_id: listingId } },
    'auto',
    'Buy NFT on Dungeon Marketplace',
    [{ denom, amount: price }]
  );

  return result.transactionHash;
}

/** Execute a marketplace bid transaction */
export async function executeMarketplaceBid(
  marketplaceContract: string,
  listingId: string,
  amount: string,
  denom: string
): Promise<string> {
  const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
  const { GasPrice } = await import('@cosmjs/stargate');

  const signer = await getOfflineSigner();
  const accounts = await signer.getAccounts();
  const sender = accounts[0].address;

  const client = await SigningCosmWasmClient.connectWithSigner(CHAIN.rpc, signer as any, {
    gasPrice: GasPrice.fromString(`0.025${CHAIN.denom}`),
  });

  const result = await client.execute(
    sender,
    marketplaceContract,
    { bid: { listing_id: listingId } },
    'auto',
    'Bid on Dungeon Marketplace',
    [{ denom, amount }]
  );

  return result.transactionHash;
}

/** Execute a marketplace listing (approve NFT + list) */
export async function executeMarketplaceList(
  marketplaceContract: string,
  nftContract: string,
  tokenId: string,
  price: string,
  listingType: 'FixedPrice' | 'Auction',
  durationSecs: number
): Promise<string> {
  const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
  const { GasPrice } = await import('@cosmjs/stargate');

  const signer = await getOfflineSigner();
  const accounts = await signer.getAccounts();
  const sender = accounts[0].address;

  const client = await SigningCosmWasmClient.connectWithSigner(CHAIN.rpc, signer as any, {
    gasPrice: GasPrice.fromString(`0.025${CHAIN.denom}`),
  });

  // First approve the marketplace to transfer the NFT
  await client.execute(
    sender,
    nftContract,
    { approve: { spender: marketplaceContract, token_id: tokenId } },
    'auto',
    'Approve marketplace to transfer NFT'
  );

  // Then list the NFT
  const result = await client.execute(
    sender,
    marketplaceContract,
    {
      list_nft: {
        nft_contract: nftContract,
        token_id: tokenId,
        listing_type: listingType,
        price,
        min_bid: null,
        duration_secs: durationSecs,
      },
    },
    'auto',
    'List NFT on Dungeon Marketplace'
  );

  return result.transactionHash;
}

/** Cancel a marketplace listing */
export async function executeMarketplaceCancel(
  marketplaceContract: string,
  listingId: string
): Promise<string> {
  const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
  const { GasPrice } = await import('@cosmjs/stargate');

  const signer = await getOfflineSigner();
  const accounts = await signer.getAccounts();
  const sender = accounts[0].address;

  const client = await SigningCosmWasmClient.connectWithSigner(CHAIN.rpc, signer as any, {
    gasPrice: GasPrice.fromString(`0.025${CHAIN.denom}`),
  });

  const result = await client.execute(
    sender,
    marketplaceContract,
    { cancel_listing: { listing_id: listingId } },
    'auto',
    'Cancel marketplace listing'
  );

  return result.transactionHash;
}
