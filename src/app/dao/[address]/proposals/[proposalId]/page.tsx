import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  fetchDaoConfig,
  fetchProposalModules,
  fetchVotingModule,
  fetchDaoProposal,
  fetchProposalVotes,
} from '@/lib/api/dao';
import { DaoProposalDetail } from '@/components/dao/DaoProposalDetail';
import { DaoProposalVote } from '@/components/dao/DaoProposalVote';
import { DaoExecuteButton } from '@/components/dao/DaoExecuteButton';
import { DaoVotingPower } from '@/components/dao/DaoVotingPower';

export const revalidate = 15;

interface PageProps {
  params: Promise<{ address: string; proposalId: string }>;
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { address, proposalId: proposalIdStr } = await params;
  const proposalId = parseInt(proposalIdStr, 10);
  if (isNaN(proposalId)) notFound();

  let config;
  try {
    config = await fetchDaoConfig(address);
  } catch {
    notFound();
  }

  const [proposalModules, votingModule] = await Promise.all([
    fetchProposalModules(address).catch(() => []),
    fetchVotingModule(address).catch(() => ''),
  ]);

  if (proposalModules.length === 0) notFound();
  const proposalModuleAddr = proposalModules[0].address;

  let proposal;
  try {
    proposal = await fetchDaoProposal(proposalModuleAddr, proposalId);
  } catch {
    notFound();
  }

  const votes = await fetchProposalVotes(proposalModuleAddr, proposalId).catch(() => []);

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
        <span className="text-text-primary">Proposal #{proposalId}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <DaoProposalDetail proposal={proposal} proposalId={proposalId} votes={votes} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {votingModule && <DaoVotingPower votingModuleAddr={votingModule} />}
          <DaoProposalVote
            proposalModuleAddr={proposalModuleAddr}
            proposalId={proposalId}
            status={proposal.status}
          />
          <DaoExecuteButton
            proposalModuleAddr={proposalModuleAddr}
            proposalId={proposalId}
            status={proposal.status}
          />
        </div>
      </div>
    </div>
  );
}
