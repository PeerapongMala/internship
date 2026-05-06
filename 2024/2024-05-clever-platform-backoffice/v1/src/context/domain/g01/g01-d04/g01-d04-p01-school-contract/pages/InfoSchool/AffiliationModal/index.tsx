import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import CWPagination from '@component/web/cw-pagination';
import API from '@domain/g01/g01-d04/local/api';
import { SchoolAffiliation } from '@domain/g01/g01-d04/local/type.ts';
import usePagination from '@global/hooks/usePagination';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

interface AffiliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOptions: {
    affiliation: string;
    type: string;
    schoolAffiliationGroup: string;
  };
  handleDropdownSelect: (key: string) => (value: string) => void;
  setSelectAffiliation: (affiliation: SchoolAffiliation) => void;
}

const AffiliationModal = ({
  isOpen,
  onClose,
  selectedOptions,
  handleDropdownSelect,
  setSelectAffiliation,
}: AffiliationModalProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { pagination, setPagination } = usePagination();

  const [affiliations, setAffiliations] = useState<SchoolAffiliation[]>([]);
  const [selectedAffiliationIndex, setSelectedAffiliationIndex] = useState<
    number | undefined
  >();

  const selectedAffiliation =
    typeof selectedAffiliationIndex === 'number' && affiliations[selectedAffiliationIndex]
      ? affiliations[selectedAffiliationIndex]
      : null;

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const res = await API.school.GetSchoolAffiliations({
          page: pagination.page,
          limit: pagination.limit,
          type: selectedOptions.type === 'ทั้งหมด' ? undefined : selectedOptions.type,
          school_affiliation_group:
            selectedOptions.schoolAffiliationGroup === 'ทั้งหมด'
              ? undefined
              : selectedOptions.schoolAffiliationGroup.replace(/\./g, ''),
          name: searchValue,
        });
        if (res.status_code === 200) {
          setAffiliations(res.data);
          setPagination((prev) => {
            const newTotalCount = res._pagination.total_count;
            if (prev.total_count === newTotalCount) return prev;
            return {
              ...prev,
              total_count: newTotalCount,
            };
          });
        }
      } catch (error) {
        console.error('Failed to fetch school affiliations', error);
      }
    };

    fetchAffiliations();
  }, [
    pagination.page,
    pagination.limit,
    selectedOptions.type,
    selectedOptions.schoolAffiliationGroup,
    searchValue,
  ]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/60">
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
                  className="my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 bg-white p-0 text-black dark:bg-black dark:text-white-dark"
                >
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <div className="text-lg font-bold">สังกัดโรงเรียน</div>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={onClose}
                    >
                      X
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 p-5">
                    <div className="flex flex-row gap-6">
                      <div className="flex w-1/2 flex-col gap-4">
                        <div className="relative">
                          <input
                            type="text"
                            className="form-input w-full"
                            placeholder="ค้นหา"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-0 mr-2 flex h-full items-center justify-center"
                          >
                            <IconSearch className="!h-5 !w-5" />
                          </button>
                        </div>
                        <div className="flex flex-row gap-4">
                          <WCADropdown
                            placeholder={
                              selectedOptions.schoolAffiliationGroup ||
                              'เลือกกลุ่มสังกัดโรงเรียน'
                            }
                            options={[
                              'ทั้งหมด',
                              'สพฐ.',
                              'สนศ. กทม.',
                              'สช.',
                              'อปท.',
                              'อื่นๆ',
                            ]}
                            onSelect={handleDropdownSelect('schoolAffiliationGroup')}
                          />
                          <WCADropdown
                            placeholder={selectedOptions.type || 'เลือกประเภท'}
                            options={['ทั้งหมด', 'เอกชน', 'รัฐ', 'อื่นๆ']}
                            onSelect={handleDropdownSelect('type')}
                          />
                        </div>
                      </div>
                      <div className="flex w-1/2 flex-col gap-2 rounded-md border p-4 text-sm">
                        {selectedAffiliation ? (
                          <>
                            <div className="flex flex-row gap-2">
                              <span>เขตตรวจราชการ:</span>
                              <span className="text-black">
                                {selectedAffiliation.school_affiliation_group}
                              </span>
                            </div>
                            <div className="flex flex-row gap-2">
                              <span>สำนักงานเขตพื้นที่:</span>
                              <span className="text-black">
                                {selectedAffiliation.name}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-50">
                            <span className="text-base font-medium text-gray-600">
                              โปรดเลือกสังกัด
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-b-2 dark:border-gray-500"></div>

                    {affiliations.length > 0 ? (
                      affiliations.map(
                        (affiliation: SchoolAffiliation, index: number) => (
                          <div
                            key={affiliation.id}
                            className={`flex h-auto w-full cursor-pointer flex-row justify-between rounded-md border px-4 py-2 ${
                              selectedAffiliationIndex === index ? 'border-primary' : ''
                            }`}
                            onClick={() => setSelectedAffiliationIndex(index)}
                          >
                            <span className="w-2/12">
                              {String(affiliation.id).padStart(11, '0')}
                            </span>
                            <span className="w-1/12">{affiliation.short_name}</span>
                            <span className="w-4/12">{affiliation.name}</span>
                            <span className="w-3/12">
                              {affiliation.school_affiliation_group}
                            </span>
                            <span className="w-2/12">{affiliation.type}</span>
                          </div>
                        ),
                      )
                    ) : (
                      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg bg-gray-50">
                        <span className="text-lg font-medium text-gray-600">
                          ไม่พบข้อมูล
                        </span>
                        <span className="text-sm text-gray-400">
                          โปรดตรวจสอบตัวกรองหรือข้อมูลที่คุณเลือกใหม่อีกครั้ง
                        </span>
                      </div>
                    )}

                    <CWPagination
                      currentPage={pagination.page}
                      totalPages={Math.ceil(pagination.total_count / pagination.limit)}
                      onPageChange={(page) =>
                        setPagination((prev) => ({ ...prev, page }))
                      }
                      pageSize={pagination.limit}
                      setPageSize={(limit) =>
                        setPagination({
                          page: 1,
                          limit,
                          total_count: pagination.total_count,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between px-5 pb-5">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={onClose}
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary ltr:ml-4 rtl:mr-4"
                      onClick={() => {
                        onClose();
                        setSelectAffiliation(affiliations[selectedAffiliationIndex!]);
                      }}
                    >
                      เลือก
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default AffiliationModal;
