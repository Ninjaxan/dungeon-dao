import { notFound } from 'next/navigation';
import {
  fetchDaoConfig,
  fetchDaoTreasury,
  fetchDaoMembers,
  fetchDaoProposals,
  fetchProposalModules,
  fetchVotingModule,
  fetchTotalPower,
} from '@/lib/api/dao';
import { DaoHeader } from '@/components/dao/DaoHeader';
import { DaoTabs } from '@/components/dao/DaoTabs';
import { DaoTreasury } from '@/components/dao/DaoTreasury';
import { DaoMembers } from '@/components/dao/DaoMembers';
import { DaoProposalList } from '@/components/dao/DaoProposalList';

export const revalidate = 30;

interface PageProps {
  params: Promise<{ address: string }>;
}

export default async function DaoDetailPage({ params }: PageProps) {
  const { address } = await params;

  let config;
  try {
    config = await fetchDaoConfig(address);
  } catch {
    notFound();
  }

  const [proposalModules, votingModule, balances] = await Promise.all([
    fetchProposalModules(address).catch(() => []),
    fetchVotingModule(address).catch(() => ''),
    fetchDaoTreasury(address).catch(() => []),
  ]);

  const [proposals, membersRes, totalPower] = await Promise.all([
    proposalModules.length > 0
      ? fetchDaoProposals(proposalModules[0].address).catch(() => [])
      : Promise.resolve([]),
    votingModule ? fetchDaoMembers(votingModule).catch(() => ({ members: [] })) : Promise.resolve({ members: [] }),
    votingModule ? fetchTotalPower(votingModule).catch(() => ({ power: '0', height: 0 })) : Promise.resolve({ power: '0', height: 0 }),
  ]);

  const members = membersRes.members;

  // Overview tab content
  const overview = (
    <div className="space-y-4">
      <div className="bg-bg-secondary border border-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-text-secondary mb-2">About</h3>
        <p className="text-text-primary text-sm">
          {config.description || 'No description provided.'}
        </p>
      </div>

      {proposals.length > 0 && (
        <div className="bg-bg-secondary border border-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Recent Proposals</h3>
          <div className="space-y-2">
            {proposals.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-text-primary truncate mr-2">#{p.id} {p.title}</span>
                <span className={`text-xs shrink-0 ${
                  p.status === 'open' ? 'text-accent-gold' :
                  p.status === 'passed' || p.status === 'executed' ? 'text-accent-green' :
                  'text-text-secondary'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DaoHeader
        address={address}
        config={config}
        memberCount={members.length}
        proposalCount={proposals.length}
      />

      <DaoTabs
        overview={overview}
        proposals={<DaoProposalList daoAddress={address} proposals={proposals} />}
        treasury={<DaoTreasury balances={balances} />}
        members={<DaoMembers members={members} totalPower={totalPower.power} />}
      />
    </div>
  );
}
