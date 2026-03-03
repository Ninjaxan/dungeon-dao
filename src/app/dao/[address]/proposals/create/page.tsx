import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchDaoConfig, fetchProposalModules } from '@/lib/api/dao';
import { daoSmartQuery } from '@/lib/dao/queries';
import { DaoProposalCreate } from '@/components/dao/DaoProposalCreate';

interface PageProps {
  params: Promise<{ address: string }>;
}

export default async function CreateProposalPage({ params }: PageProps) {
  const { address } = await params;

  let config;
  try {
    config = await fetchDaoConfig(address);
  } catch {
    notFound();
  }

  const proposalModules = await fetchProposalModules(address).catch(() => []);
  if (proposalModules.length === 0) notFound();

  // Get the pre-propose module address from the proposal module
  let preProposeAddr = '';
  try {
    const creationPolicy = await daoSmartQuery<{
      module: { addr: string };
    }>(proposalModules[0].address, { proposal_creation_policy: {} });
    preProposeAddr = creationPolicy.module.addr;
  } catch {
    // Fallback: propose directly on proposal module
    preProposeAddr = proposalModules[0].address;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link href="/dao" className="hover:text-text-primary transition-colors">DAOs</Link>
        <span>/</span>
        <Link href={`/dao/${address}`} className="hover:text-text-primary transition-colors truncate max-w-[200px]">
          {config.name}
        </Link>
        <span>/</span>
        <span className="text-text-primary">New Proposal</span>
      </div>

      <h1 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6">
        Create Proposal
      </h1>

      <DaoProposalCreate daoAddress={address} preProposeAddr={preProposeAddr} />
    </div>
  );
}
