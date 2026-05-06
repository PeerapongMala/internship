import CWWhiteBox from '@component/web/cw-white-box';
import { EStatusTemplate } from '@domain/g06/g06-d01/local/api/type';
import { TTemplate } from '@domain/g06/g06-d01/local/type/template';
import dayjs from '@global/utils/dayjs';
import 'dayjs/locale/th';

interface InfoPanelProps {
  template?: TTemplate;
}

const InfoPanel = ({ template }: InfoPanelProps) => {
  const infos: { title: string; content: any }[] = [
    {
      title: 'รหัส Template',
      content: template?.id?.toString?.().padStart?.(5, '0') ?? '-',
    },
    {
      title: 'สถานะ',
      content: template?.status
        ? template?.status === EStatusTemplate.cancel
          ? 'ยกเลิก'
          : template?.status === EStatusTemplate.published
            ? 'เผยแพร่'
            : 'แบบร่าง'
        : '-',
    },
    {
      title: 'แก้ไขล่าสุด',
      content: template?.updated_at
        ? dayjs(template.updated_at).locale('th').format('DD MMM BBBB HH:mm')
        : '-',
    },
    {
      title: 'แก้ไขล่าสุดโดย',
      content: template?.updated_by ?? '-',
    },
  ];

  return (
    <CWWhiteBox className="grid h-fit w-fit max-w-[437px] grid-cols-[auto,1fr] gap-4 truncate text-nowrap">
      {infos.map((info, index) => (
        <>
          <span key={`title-${index}`} className="w- max-w-32">
            {info.title}:
          </span>
          <span key={`content-${index}`} className="w-1/2 max-w-[265px] pr-10">
            {info.content}
          </span>
        </>
      ))}
    </CWWhiteBox>
  );
};

export default InfoPanel;
