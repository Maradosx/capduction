import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProjectForm } from '../project-form';

export const metadata = { title: 'New Project — Capduction' };

export default function NewProjectPage() {
  return (
    <div className="max-w-[680px] mx-auto flex flex-col gap-6">
      <Link
        href="/dashboard/projects"
        data-cursor="go"
        className="hover-target inline-flex items-center gap-2 text-ink-3 hover:text-ink text-[13px] font-mono no-underline"
      >
        <ArrowLeft size={14} />
        Back to projects
      </Link>

      <div>
        <h1 className="font-display font-bold text-[clamp(28px,3.5vw,42px)] tracking-[-0.025em] text-ink lang-th:font-thai">
          <span className="text-iridescent">โปรเจกต์ใหม่</span>
        </h1>
        <p className="text-ink-3 text-[15px] mt-1 lang-th:font-thai">
          ตั้งชื่อสินค้า/แคมเปญ — แล้วทุก generation ที่สร้างหลังจากนี้สามารถผูกกับโปรเจกต์ได้
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
