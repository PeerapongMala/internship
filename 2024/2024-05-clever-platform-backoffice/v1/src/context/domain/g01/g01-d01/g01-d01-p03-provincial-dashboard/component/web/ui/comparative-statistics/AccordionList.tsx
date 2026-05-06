import CWMAccordion from '@component/web/molecule/cw-m-accordion';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TreeDistrict } from '@domain/g01/g01-d01/local/api/group/provincial-dashboard/type';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

interface ListItemProps {
  item: TreeDistrict;
  level: number;
  openItemIds: string[];
  checkCurrent: number;
  indexParent?: string;
  indexId: string;
  setOpenItemIds: Dispatch<SetStateAction<string[]>>;
  setCheckCurrent: Dispatch<SetStateAction<number>>;
}
// interface TreeDistrict {
//   id?: number;
//   title?: string;
//   score_hight: number;
//   score_average: number;
//   score_average_pass: number;
//   children?: ListItem[]; // ทำให้ children เป็น optional
// }

export const ListItemComponent: React.FC<ListItemProps> = ({
  item,
  level,
  openItemIds,
  checkCurrent,
  setOpenItemIds,
  setCheckCurrent,
  indexId,
  indexParent,
}) => {
  // const id = 'level' + level + '-' + item.ClassRoomId + '-' + item.Name;
  // const id = `level${level}-${item.SchoolId}${item.ClassRoomId}-${item.Name}`;
  const id = `level${level}-${indexParent}${indexId}`;
  const handleClick = () => {
    setCheckCurrent(level);
    if (!openItemIds.includes(id)) {
      setOpenItemIds((prev: string[]) => [
        ...prev.filter((item) => {
          const getLevel = Number(item.match(/^level(\d)/)?.[1] || 10);
          return getLevel < level;
        }),
        id,
      ]);
    }
  };

  return (
    <CWMAccordion
      isOpen={openItemIds.includes(id)}
      expandAll={!openItemIds.includes(id)}
      title={
        <div
          className={cn(
            `my-1 flex cursor-pointer items-center justify-between px-4 py-3`,
          )}
          onClick={handleClick}
        >
          <div className={cn(`flex items-center`)}>{item.name}</div>
          {level === 1 || openItemIds.includes(id) || checkCurrent < level ? (
            <div className={cn(`flex space-x-8`)}>
              <div className={cn(`flex items-center`)}>
                <span className={cn(`text-sm text-gray-600`)}>คะแนนสูงสุด : </span>
                <span className={cn(`ml-1 text-sm text-red-500`)}>
                  {/* {item.MaxStarCount.toFixed(2)} */}
                  {item.max_star_count?.toFixed(2) ?? '-'}
                </span>
              </div>
              <div className={cn(`flex items-center`)}>
                <span className={cn(`text-sm text-gray-600`)}>คะแนนเฉลี่ย : </span>
                <span className={cn(`ml-1 text-sm text-red-500`)}>
                  {item.avg_star_count?.toFixed(2) ?? '-'}
                </span>
              </div>
              <div className={cn(`flex items-center`)}>
                <span className={cn(`text-sm text-gray-600`)}>ด่านที่ผ่านเฉลี่ย : </span>
                <span className={cn(`ml-1 text-sm text-green-500`)}>
                  {item.avg_pass_level?.toFixed(2) ?? '-'}
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      }
      className={cn(
        `[&_button.cursor-default_.flex_.flex_svg]:-rotate-90 [&_button.cursor-pointer_.flex_.flex_svg]:rotate-0 [&_button]:bg-[#FAFAFA] [&_button_.flex_.flex_svg]:opacity-100 [&_button_.flex_.w-full_.px-4]:py-1`,
        level == 1
          ? 'mb-2 [&_button]:border-b [&_button]:border-[#D4D4D4]'
          : 'mb-0 [&_button]:border-b-0',
      )}
    >
      {item.children && item.children.length && openItemIds.includes(id) ? (
        <div className={cn(`ml-6 pr-6`)}>
          {item.children?.map((child, index) => (
            <ListItemComponent
              key={`level${level}-${indexParent}${index}`}
              item={child}
              level={level + 1}
              openItemIds={openItemIds}
              setOpenItemIds={setOpenItemIds}
              checkCurrent={checkCurrent}
              setCheckCurrent={setCheckCurrent}
              indexParent={String(indexParent)}
              indexId={String(index)}
            />
          ))}
        </div>
      ) : (
        ''
      )}
    </CWMAccordion>
  );
};

interface AccordionListProps {
  data: TreeDistrict[];
}

const AccordionList: FC<AccordionListProps> = ({ data }) => {
  const [openCurrent, setOpenCurrent] = useState<number>(0);
  const [openItemIds, setOpenItemIds] = useState<string[]>([]);

  return (
    <div className="">
      {/* {data.length ? data.map((item: TreeDistrict) => ( */}
      {data.length
        ? data.map((item: TreeDistrict, index: number) => (
            <ListItemComponent
              key={index}
              // key={item.Name}
              item={item}
              level={1}
              checkCurrent={openCurrent}
              openItemIds={openItemIds}
              setOpenItemIds={setOpenItemIds}
              setCheckCurrent={setOpenCurrent}
              indexId={String(index)}
            />
          ))
        : ''}
    </div>
  );
};

export default AccordionList;
