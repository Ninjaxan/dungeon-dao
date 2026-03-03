// ── DAODAO Smart Query Helper ─────────────────────────────────────────────────
// Mirrors the smartQuery pattern from lib/api/marketplace.ts

import { rest } from '../api/client';
import { ENDPOINTS } from '../chain';

/**
 * Execute a CosmWasm smart query against a DAODAO contract.
 * Encodes the query as base64 and unwraps the { data: T } response.
 */
export async function daoSmartQuery<T>(
  contract: string,
  query: object,
  revalidate = 30
): Promise<T> {
  const queryJson = JSON.stringify(query);
  const queryBase64 = btoa(queryJson);
  const path = ENDPOINTS.contractSmartQuery(contract, queryBase64);
  const res = await rest.get<{ data: T }>(path, { revalidate });
  return res.data;
}
