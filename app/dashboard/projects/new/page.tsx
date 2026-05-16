import { ProjectForm } from '../project-form';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'New Project — Capduction' };

export default function NewProjectPage() {
  return (
    <div className="max-w-[680px] mx-auto flex flex-col gap-6">
      <PageHeader
        backHref="/dashboard/projects"
        backKey="pj.back_all"
        titleKey="pj.new.title"
        subKey="pj.new.sub"
      />
      <ProjectForm mode="create" />
    </div>
  );
}
