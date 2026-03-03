import Link from 'next/link';
import { truncate } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface AddressLinkProps {
  address: string;
  truncateLength?: number;
}

export function AddressLink({ address, truncateLength }: AddressLinkProps) {
  const isValidator = address.startsWith('dungeonvaloper');
  const href = isValidator ? `/validators/${address}` : `/account/${address}`;
  const display = truncateLength
    ? truncate(address, truncateLength, truncateLength)
    : truncate(address);

  return (
    <span className="inline-flex items-center gap-1">
      <Link
        href={href}
        className="font-[family-name:var(--font-mono)] text-accent-purple hover:text-accent-gold transition-colors text-sm"
        title={address}
      >
        {display}
      </Link>
      <CopyButton text={address} />
    </span>
  );
}
