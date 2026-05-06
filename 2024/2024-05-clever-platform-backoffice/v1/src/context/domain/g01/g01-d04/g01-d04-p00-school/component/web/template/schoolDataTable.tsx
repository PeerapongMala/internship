import { Fragment, useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';

import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';

import IconArchive from '@core/design-system/library/vristo/source/components/Icon/IconArchive';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import { Link } from '@tanstack/react-router';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import IconCaretsDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretsDown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';

interface SchoolData {
  id: number;
  schoolId: string;
  schoolAbbreviation: string;
  schoolName: string;
  affiliation: string;
  inspectionRegion: number;
  districtOffice: string;
  province: string;
  status: string;
  contractCount: number;
}

interface SchoolDataTableProps {
  initialRecords: SchoolData[];
}

const SchoolDataTable: React.FC<SchoolDataTableProps> = ({ initialRecords }) => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [closeSchoolId, setCloseSchoolId] = useState();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  const totalPages = Math.ceil(initialRecords.length / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const [modalClose, setModalClose] = useState(false);

  return (
    <div className="flex flex-col gap-5 overflow-x-auto">
      <table className="min-w-full whitespace-nowrap bg-white dark:bg-black">
        <thead>
          <tr>
            <th>
              <input type="checkbox" className="form-checkbox" />
            </th>
            <th>#</th>
            <th>School Id</th>
            <th>School Abbreviation</th>
            <th>School Name</th>
            <th>affiliation</th>
            <th>Inspection Region</th>
            <th>District Office</th>
            <th>province</th>
            <th>status</th>
            <th>Contract Count</th>
            <th>Watch</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {recordsData.map((data: any, index: number) => {
            return (
              <tr key={data.id}>
                <td>
                  <input type="checkbox" className="form-checkbox" />
                </td>
                <td>{index + 1}</td>
                <td>{data.schoolId}</td>
                <td>{data.schoolAbbreviation}</td>
                <td>{data.schoolName}</td>
                <td>{data.affiliation}</td>
                <td>{data.inspectionRegion}</td>
                <td>{data.districtOffice}</td>
                <td>{data.province}</td>
                <td>
                  <span
                    className={`badge ${
                      data.status.toLowerCase() === 'active'
                        ? 'badge-outline-success'
                        : data.status.toLowerCase() === 'draft'
                          ? 'badge-outline-warning'
                          : 'badge-outline-danger'
                    } flex w-14 items-center justify-center`}
                  >
                    {data.status.toLowerCase() === 'active'
                      ? 'ใช้งาน'
                      : data.status.toLowerCase() === 'inactive'
                        ? 'ไม่ใช้งาน'
                        : data.status.toLowerCase() === 'draft'
                          ? 'แบบร่าง'
                          : 'มีข้อผิดพลาด'}
                  </span>
                </td>
                <td>{data.contractCount}</td>
                <td>
                  <div className="flex justify-center">
                    <Link
                      to={`${location.pathname}/$schoolId`}
                      params={{ schoolId: data.schoolId }}
                    >
                      <IconSearch />
                    </Link>
                  </div>
                </td>
                <td>
                  <div
                    className="flex justify-center hover:cursor-pointer"
                    onClick={() => {
                      setModalClose(true);
                      setCloseSchoolId(data.schoolId);
                    }}
                  >
                    <IconArchive />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          {/* Showing Pages */}
          <span>
            Showing {page} from {totalPages} pages
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
        <div className="flex items-center">
          <ul className="m-auto inline-flex items-center gap-1 rtl:space-x-reverse">
            {/* First Page Button */}
            {page !== 1 && (
              <li>
                <button
                  type="button"
                  onClick={() => handlePageChange(1)}
                  className="flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                >
                  <IconCaretsDown className="rotate-90" />
                </button>
              </li>
            )}

            {/* Prev Button */}
            <li>
              <button
                type="button"
                onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                className="flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                disabled={page === 1}
              >
                <IconCaretDown className="rotate-90" />
              </button>
            </li>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handlePageChange(index + 1)}
                  className={`flex justify-center rounded-full p-2 font-semibold transition ${
                    page === index + 1
                      ? 'bg-primary text-white dark:bg-primary dark:text-white-light'
                      : 'bg-white-light text-dark hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary'
                  }`}
                >
                  <span className="h-4 w-4">{index + 1}</span>
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li>
              <button
                type="button"
                onClick={() =>
                  handlePageChange(page < totalPages ? page + 1 : totalPages)
                }
                className="flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                disabled={page === totalPages}
              >
                <IconCaretDown className="-rotate-90" />
              </button>
            </li>

            {/* Last Page Button */}
            {page !== totalPages && (
              <li>
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages)}
                  className="flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                >
                  <IconCaretsDown className="-rotate-90" />
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <Transition appear show={modalClose} as={Fragment}>
        <Dialog as="div" open={modalClose} onClose={() => setModalClose(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  as="div"
                  className="my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 bg-white p-0 text-black dark:bg-black dark:text-white-dark"
                >
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <div className="text-lg font-bold">ปิดโรงเรียน {closeSchoolId}</div>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={() => setModalClose(false)}
                    >
                      <IconX />
                    </button>
                  </div>
                  <div className="p-5">
                    <p>
                      ข้อมูลจะถูกถ่ายโอนจากหน้านี้ และสำรองไว้ในฐานข้อมูล
                      คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
                    </p>

                    <div className="mt-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        รหัสผ่าน:
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#2b2f3a] dark:text-white"
                        placeholder="กรุณากรอกรหัสผ่าน"
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                      <button
                        type="button"
                        className="btn btn-outline-dark w-full"
                        onClick={() => setModalClose(false)}
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger w-full ltr:ml-4 rtl:mr-4"
                        onClick={() => setModalClose(false)}
                      >
                        จัดเก็บข้อมูลถาวร
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SchoolDataTable;
