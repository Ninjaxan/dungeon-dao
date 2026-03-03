import { fetchDaoList } from '@/lib/api/dao';
import { DaoList } from '@/components/dao/DaoList';

export const revalidate = 60;

export default async function DaosPage() {
  let daos: Awaited<ReturnType<typeof fetchDaoList>>;
  try {
    daos = await fetchDaoList();
  } catch {
    daos = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
          Dungeon DAOs
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Decentralized organizations on Dungeon Chain
        </p>
      </div>

      <DaoList daos={daos} />
    </div>
  );
}
