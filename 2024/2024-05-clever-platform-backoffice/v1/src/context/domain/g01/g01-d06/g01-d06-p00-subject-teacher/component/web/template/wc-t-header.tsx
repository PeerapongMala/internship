import Breadcrumbs from '@domain/g01/g01-d06/local/component/web/atom/wc-a-breadcrumbs';

export default function SubjectTeacherHeader() {
  const schoolDetails = [
    'สำนักงานคณะกรรมการศึกษาขั้นพื้นฐาน',
    'เขตตรวจราชการ 1',
    'สพป. เชียงใหม่ เขต 1',
    'โรงเรียนสาธิตมัธยม',
  ];

  return (
    <div className="flex flex-col gap-y-6">
      <Breadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '#' },
          { label: 'จัดการโรงเรียน', href: '#' },
          { label: '00000000001: โรงเรียนสาธิตมัธยม', href: '#' },
        ]}
      />
      <div className="flex flex-col gap-2 rounded-md bg-[#F5F5F5] p-2">
        <h1 className="text-2xl font-bold leading-8">
          {schoolDetails.map((detail, i) => (
            <>
              <span className="underline">{detail}</span>
              <span> / </span>
            </>
          ))}
        </h1>
        <p>รหัสโรงเรียน: 00000000001 (ตัวย่อ: AA109)</p>
      </div>
    </div>
  );
}
