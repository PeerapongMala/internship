import { Fragment, useEffect, useState } from 'react';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconArchive from '@core/design-system/library/vristo/source/components/Icon/IconArchive';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import { Link } from '@tanstack/react-router';
import { Learning } from '../../../../../local/type';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import ModalArchive from '@domain/g02/g02-d01/local/components/Modal/ModalArchive';
import Pagination from '@domain/g02/g02-d01/local/components/organism/Pagination';

interface ReportTableProps {
  initialRecords: Learning[];
}
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const ReportTable = ({ initialRecords }: ReportTableProps) => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [recordsData, setRecordsData] = useState(initialRecords);
  const modalArchive = useModal();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  const totalPages = Math.max(1, Math.ceil(initialRecords.length / pageSize));

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto">
        <table className="mt-5 min-w-full whitespace-nowrap bg-white">
          <thead>
            <tr>
              <th>#</th>
              <th>รหัสตัวชี้วัด</th>
              <th>ชื่อย่อตัวชี้วัด</th>
              <th>ชั้นปี</th>
              <th>ชื่อสาระ</th>
              <th>มาตรฐาน</th>
              <th>สาระการเรียนรู้</th>
              <th>ตัวชี้วัด / ผลการเรียนรู้</th>
              <th>บทเรียนหลัก</th>
              <th>บทเรียนย่อย</th>
              <th>ด่านที่</th>
            </tr>
          </thead>
          <tbody>
            {recordsData.length > 0 ? (
              recordsData.map((data: any, index: number) => {
                return (
                  <tr key={data.learningId}>
                    <td>{index + 1}</td>
                    <td>{data.Content[0].ContentId}</td>
                    <td>
                      {
                        data.Content[0].Standard[0].LearningContent[0].indicator[0]
                          .indicator_ShortName
                      }
                    </td>
                    <td>{data.course}</td>
                    <td>{data.Content[0].ContentName}</td>
                    <td
                      className="w-[500px] max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                      title={data.Content[0].Standard[0].StandardName}
                    >
                      {data.Content[0].Standard[0].StandardName}
                    </td>
                    <td
                      className="w-[500px] max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                      title={
                        data.Content[0].Standard[0].LearningContent[0].LearningContentName
                      }
                    >
                      {data.Content[0].Standard[0].LearningContent[0].LearningContentName}
                    </td>
                    <td
                      className="w-[500px] max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                      title={
                        data.Content[0].Standard[0].LearningContent[0].indicator[0]
                          .indicatorName
                      }
                    >
                      {
                        data.Content[0].Standard[0].LearningContent[0].indicator[0]
                          .indicatorName
                      }
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="text-center">
                  ไม่มีข้อมูลที่จะแสดง
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalArchive open={modalArchive.isOpen} onClose={modalArchive.close} />

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          {/* Showing Pages */}
          <span>
            แสดง {page} จาก {totalPages} หน้า
          </span>
          <div className="dropdown pl-2">
            <Dropdown
              placement={`${true ? 'top-start' : 'top-end'}`}
              btnClassName="border border-[1px] border-[#E0E6ED] rounded-md p-2"
              button={
                <>
                  <div className="flex flex-row gap-4">
                    <span>{pageSize}</span>{' '}
                    <span>
                      <IconCaretDown />
                    </span>
                  </div>
                </>
              }
            >
              <ul className="!min-w-[170px]">
                {PAGE_SIZES.map((size) => (
                  <li key={size}>
                    <button type="button" onClick={() => setPageSize(size)}>
                      {size}
                    </button>
                  </li>
                ))}
              </ul>
            </Dropdown>
          </div>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default ReportTable;
