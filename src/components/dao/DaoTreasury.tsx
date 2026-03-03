import { CHAIN } from '@/lib/chain';
import type { DaoBalance } from '@/lib/api/dao';

interface Props {
  balances: DaoBalance[];
}

export function DaoTreasury({ balances }: Props) {
  if (balances.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p>No tokens in the treasury</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs text-text-secondary font-medium px-4 py-3">Token</th>
            <th className="text-right text-xs text-text-secondary font-medium px-4 py-3">Balance</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((bal) => {
            const isNative = bal.denom === CHAIN.denom;
            const display = isNative
              ? (parseInt(bal.amount) / Math.pow(10, CHAIN.decimals)).toLocaleString(undefined, {
                  maximumFractionDigits: CHAIN.decimals,
                })
              : bal.amount;
            const symbol = isNative ? CHAIN.displayDenom : bal.denom;

            return (
              <tr key={bal.denom} className="border-b border-border last:border-0 hover:bg-bg-tertiary/50">
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${isNative ? 'text-accent-gold' : 'text-text-primary'}`}>
                    {symbol}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-text-primary font-[family-name:var(--font-mono)]">
                    {display}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
