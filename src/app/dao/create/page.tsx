import Link from 'next/link';
import { DaoCreateWizard } from '@/components/dao/DaoCreateWizard';

export default function CreateDaoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link href="/dao" className="hover:text-text-primary transition-colors">DAOs</Link>
        <span>/</span>
        <span className="text-text-primary">Create</span>
      </div>

      <h1 className="text-xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-8">
        Create a DAO
      </h1>

      <DaoCreateWizard />
    </div>
  );
}
