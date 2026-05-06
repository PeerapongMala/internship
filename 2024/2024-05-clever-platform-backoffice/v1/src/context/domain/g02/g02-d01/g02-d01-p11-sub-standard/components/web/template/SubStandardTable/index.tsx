import { Fragment, useEffect, useState } from 'react';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconArchive from '@core/design-system/library/vristo/source/components/Icon/IconArchive';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import { Link } from '@tanstack/react-router';
import { Learning } from '../../../../../local/type';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import ModalArchive from '@domain/g02/g02-d01/local/components/Modal/ModalArchive';
import Pagination from '@domain/g02/g02-d01/local/components/organism/Pagination';

interface SubStandardTableProps {
  initialRecords: Learning[];
}
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const SubStandardTable = ({ initialRecords }: SubStandardTableProps) => {
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
              <th className="flex gap-2">
                <input type="checkbox" className="form-checkbox" />#
              </th>
              <th>รหัสมาตรฐานย่อย</th>
              <th>ชั้นปี</th>
              <th>ชื่อย่อ</th>
              <th className="w-[500px]" colSpan={5}>
                ชื่อกลุ่มสาระการเรียนรู้
              </th>
              <th>แก้ไขล่าสุด</th>
              <th>แก้ไขล่าสุดโดย</th>
              <th>สถานะ</th>
              <th>แก้ไข</th>
              <th>จัดเก็บ</th>
            </tr>
          </thead>
          <tbody>
            {recordsData.length > 0 ? (
              recordsData.map((data: any, index: number) => {
                return (
                  <tr key={data.Content.ContentId}>
                    <td className="flex gap-2">
                      <input type="checkbox" className="form-checkbox" />
                      {index + 1}
                    </td>
                    <td>{data.Content[0].ContentId}</td>
                    <td>{data.course}</td>
                    <td>{data.Content[0].Standard[0].Standard_ShortName}</td>
                    <td
                      className="w-[500px] max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                      colSpan={5}
                      title={data.Content[0].Standard[0].StandardName}
                    >
                      {data.Content[0].Standard[0].StandardName}
                    </td>
                    <td>{data.updatedAt}</td>
                    <td>{data.updatedBy}</td>
                    <td>
                      <span
                        className={`badge ${
                          data.status.toLowerCase() === 'ใช้งาน'
                            ? 'badge-outline-success'
                            : data.status.toLowerCase() === 'แบบร่าง'
                              ? 'badge-outline-dark'
                              : 'badge-outline-danger'
                        } flex w-14 items-center justify-center`}
                      >
                        {data.status.toLowerCase() === 'enabled'
                          ? 'ใช้งาน'
                          : data.status.toLowerCase() === 'disabled'
                            ? 'ไม่ใช้งาน'
                            : data.status.toLowerCase() === 'draft'
                              ? 'แบบร่าง'
                              : 'มีข้อผิดพลาด'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <Link
                          to={`${location.pathname}/$learningId`}
                          params={{ learningId: data.learningId }}
                        >
                          <IconSearch />
                        </Link>
                      </div>
                    </td>
                    <td>
                      <button className="flex gap-1" onClick={modalArchive.open}>
                        <IconArchive />{' '}
                      </button>
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

export default SubStandardTable;
