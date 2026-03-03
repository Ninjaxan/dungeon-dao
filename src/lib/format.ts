import { CHAIN } from './chain';

/** Convert micro-denom amount to display amount */
export function formatDenom(amount: string | number, denom?: string): string {
  const d = denom || CHAIN.denom;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (d === CHAIN.denom || d === `u${CHAIN.displayDenom.toLowerCase()}`) {
    const display = num / Math.pow(10, CHAIN.decimals);
    return `${formatNumber(display)} ${CHAIN.displayDenom}`;
  }
  // IBC / factory tokens — show raw
  if (d.startsWith('ibc/')) {
    return `${formatNumber(num)} ${d.slice(0, 10)}...`;
  }
  if (d.startsWith('factory/')) {
    const parts = d.split('/');
    return `${formatNumber(num)} ${parts[parts.length - 1]}`;
  }
  return `${formatNumber(num)} ${d}`;
}

/** Format a number with commas and up to 6 decimal places */
export function formatNumber(n: number, maxDecimals = 6): string {
  if (n === 0) return '0';
  if (Math.abs(n) < 0.000001) return n.toExponential(2);
  const fixed = n.toFixed(maxDecimals);
  // Remove trailing zeros after decimal
  const trimmed = fixed.replace(/\.?0+$/, '');
  const [int, dec] = trimmed.split('.');
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${withCommas}.${dec}` : withCommas;
}

/** Format a large token amount compactly (e.g., 1.2M DGN) */
export function formatCompact(amount: string | number, denom?: string): string {
  const d = denom || CHAIN.denom;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  let display = num;
  if (d === CHAIN.denom) {
    display = num / Math.pow(10, CHAIN.decimals);
  }
  if (display >= 1_000_000_000) return `${(display / 1_000_000_000).toFixed(2)}B ${CHAIN.displayDenom}`;
  if (display >= 1_000_000) return `${(display / 1_000_000).toFixed(2)}M ${CHAIN.displayDenom}`;
  if (display >= 1_000) return `${(display / 1_000).toFixed(2)}K ${CHAIN.displayDenom}`;
  return `${formatNumber(display, 2)} ${CHAIN.displayDenom}`;
}

/** Truncate a hash or address: dungeon1abc...xyz */
export function truncate(str: string, start = 8, end = 6): string {
  if (!str) return '';
  if (str.length <= start + end + 3) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
}

/** Format a date string to relative time */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/** Format a date string to a readable format */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

/** Format gas: 123,456 */
export function formatGas(gas: string | number): string {
  const n = typeof gas === 'string' ? parseInt(gas) : gas;
  return n.toLocaleString();
}

/** Format percentage from decimal string (e.g. "0.050000" -> "5.00%") */
export function formatPercent(decStr: string, decimals = 2): string {
  const pct = parseFloat(decStr) * 100;
  return `${pct.toFixed(decimals)}%`;
}

/** Convert proposal status enum to human-readable label */
export function proposalStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: 'Deposit Period',
    PROPOSAL_STATUS_VOTING_PERIOD: 'Voting Period',
    PROPOSAL_STATUS_PASSED: 'Passed',
    PROPOSAL_STATUS_REJECTED: 'Rejected',
    PROPOSAL_STATUS_FAILED: 'Failed',
  };
  return map[status] || status;
}

/** Convert validator status to label */
export function validatorStatusLabel(status: string): string {
  const map: Record<string, string> = {
    BOND_STATUS_BONDED: 'Active',
    BOND_STATUS_UNBONDING: 'Unbonding',
    BOND_STATUS_UNBONDED: 'Inactive',
  };
  return map[status] || status;
}
