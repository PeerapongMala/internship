import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { School, Subject } from '@domain/g01/g01-d06/local/type';
import { useRouter } from '@tanstack/react-router';

export interface SubjectTeacherHeaderProps {
  school?: School;
  subject?: Subject;
}

export default function SubjectTeacherHeader({
  school,
  subject,
}: SubjectTeacherHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-6">
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '/', disabled: true },
          { label: 'จัดการโรงเรียน', href: '/admin/school' },
          { label: 'จัดการครูประจำวิชา', href: '/admin/school/1?tab=teacher-management' },
          { label: school?.name ?? '', href: '/' },
        ]}
      />
      <div className="gap-2.5 rounded-md bg-neutral-100 p-2.5 dark:bg-black">
        {school ? (
          <ol className="flex text-left text-xl font-bold text-neutral-900 underline dark:text-neutral-500">
            <li>
              <span className="underline">{school.school_affiliation_name ?? '-'}</span>
            </li>
            <li className="before:px-1.5 before:content-['/']">
              <span className="underline">{school?.school_affiliation_type ?? '-'}</span>
            </li>
            <li className="before:px-1.5 before:content-['/']">
              <span className="underline">{school.name ?? ''}</span>
            </li>
          </ol>
        ) : (
          <div className="h-7"></div>
        )}
        <p className="text-sm font-normal">
          รหัสโรงเรียน: {school?.id ?? '-'} (ตัวย่อ: {school?.code ?? '-'})
        </p>
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row items-center gap-4 text-2xl font-bold leading-8">
          <button onClick={() => router.history.back()}>
            <IconArrowBackward />
          </button>
          <p>ครูประจำวิชา</p>
        </div>
        <p>
          {subject?.name ?? '-'} / {subject?.year ?? '-'}
        </p>
      </div>
    </div>
  );
}
