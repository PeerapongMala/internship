import CWMBreadcrumbs from '../../molecule/cw-m-breadcrumbs';
import { useTranslation } from 'react-i18next';
import CWTLayout from '../cw-t-layout';
import CWMReverseNavigate from '../../molecule/cw-m-reverse-navigate';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWTModalUser from '../cw-t-modal-user';
import React, { useState } from 'react';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import ConfigJson from '../../../../config/index.json';
import { toDateTimeTH } from '@global/utils/date';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { Modal } from '@component/web/cw-modal';
import CWAButton from '../../atom/cw-a-button';
import { Classroom, School, Student, Teacher } from '@domain/g01/g01-d05/local/api/type';
import { DropdownItem } from '../../molecule/cw-m-dropdown';

interface CWTManageUserProps<T> {
  type: 'teacher' | 'student';
  children?: React.ReactNode;
  school?: School;
  classroom?: Classroom;
  bulkEditActions: DropdownItem[];
  tConfigKey: string;
  onDownload: (data: { dateFrom: string; dateTo: string }) => void;
  onRemoveUser: (record: T) => void;
  onSubmitUsers: (rows: T[]) => void;
  onMove?: (record: T) => void;
  selectTabIndex: number;

  onSearchChange: (text: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  page: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  userRecords: T[];
  fetching?: boolean;

  selectedRecords?: T[];
  onSelectedRecordsChange?: (records: T[]) => void;
}

const CWTManageUser = function ({
  school,
  classroom,
  onDownload,
  onSubmitUsers,
  ...props
}: CWTManageUserProps<Student | Teacher>) {
  const { t } = useTranslation([props.tConfigKey]);
  const { t: tLocal } = useTranslation([ConfigJson.key]);

  const navigate = useNavigate();
  const { schoolId, classroomId } = useParams({ strict: false });

  const [modalContent, setModalContent] = useState<React.ReactNode>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const classroomPathname = `/admin/school/${schoolId}?tab=classroom-management`;
  const pathname = `/admin/school/${schoolId}/classroom/${classroomId}`;

  const [currentMenuTabIndex] = useState(props.selectTabIndex);
  const menuTabs = [
    {
      key: `${pathname}/teacher`,
      label: 'ครูประจำชั้น',
    },
    {
      key: `${pathname}/student`,
      label: 'นักเรียน',
    },
  ];

  function onUserModalClose() {
    setIsModalOpen(false);
  }

  return (
    <CWTLayout
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/', disabled: true },
        { text: 'จัดการโรงเรียน', href: '/admin/school' },
        { text: 'จัดการห้องเรียน', href: '/admin/school/1?tab=classroom-management' },
        { text: school ? `${school.code}: ${school.name}` : '', href: '/' },
      ]}
    >
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
          รหัสโรงเรียน: {schoolId} (ตัวย่อ: {school?.code ?? '-'})
        </p>
      </div>

      <CWMReverseNavigate
        to={classroomPathname}
        label={'จัดการห้องเรียน'}
        className="gap-2"
      >
        <CWMBreadcrumbs
          className="h-5"
          breadcrumbs={
            classroom
              ? [
                  {
                    label: `ปีการศึกษา ${classroom?.academic_year}`,
                  },
                  { label: classroom?.year ?? '' },
                  { label: classroom?.name },
                ]
              : []
          }
        />
      </CWMReverseNavigate>

      <CWMTabs
        items={menuTabs.map((t) => t.label)}
        currentIndex={currentMenuTabIndex}
        onClick={(i) => {
          let href = menuTabs[i]?.key;
          if (href) navigate({ to: href });
        }}
      />

      <CWTableTemplate
        header={{
          showUploadButton: false,
          showDownloadModal: false,
          onSearchChange: (e) => {
            props.onSearchChange?.(e.currentTarget.value);
          },
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่ม' + (props.type == 'student' ? 'นักเรียน' : 'ครู'),
          onBtnClick() {
            setIsModalOpen(true);
          },
          bulkEditDisabled: props.selectedRecords?.length == 0,
          bulkEditActions: props.bulkEditActions,
          onDownload: (data) => {
            onDownload?.({
              dateFrom: data.dateFrom || '',
              dateTo: data.dateTo || '',
            });
          },
        }}
        table={{
          columns: [
            {
              accessor: 'id',
              title: 'รหัสบัญชี',
            },
            {
              accessor: 'student_id',
              title: 'รหัสนักเรียน',
              hidden: props.type === 'teacher',
            },
            {
              accessor: 'title',
              title: 'คำนำหน้า',
            },
            {
              accessor: 'first_name',
              title: 'ชื่อ',
            },
            {
              accessor: 'last_name',
              title: 'สกุล',
            },
            {
              accessor: 'email',
              title: 'อีเมล',
              hidden: props.selectTabIndex == 1,
            },
            {
              accessor: 'last_login',
              title: 'ใช้งานล่าสุด',
              render(record) {
                if (record.last_login) return toDateTimeTH(record.last_login);
              },
            },
            {
              accessor: 'moveBtn',
              title: 'ย้ายห้อง',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 100,
              render(record) {
                return (
                  <button onClick={() => props.onMove?.(record)}>
                    <IconPencil />
                  </button>
                );
              },
              hidden: props.selectTabIndex == 0,
            },
            {
              accessor: 'removeBtn',
              title: 'เอาออก',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 100,
              render(record) {
                return (
                  <button
                    onClick={() => {
                      setModalContent(
                        <Modal
                          open
                          title={'ลบบัญชีที่เลือก?'}
                          className="w-96"
                          onClose={() => setModalContent('')}
                        >
                          <div className="flex flex-col gap-4">
                            <div>
                              {
                                'แน่ใจว่าต้องการย้ายนักเเรียนออกจากห้องเรียนนี้ ข้อมูลบัญชีครูจะไม่ถูกลบ คุณสามารถเข้าถึงข้อมูลบัญชีได้ที่หน้าจัดการผู้ใช้งาน'
                              }
                            </div>
                            <div className="flex gap-2 *:flex-1">
                              <CWAButton
                                className="!border-dark-light !bg-transparent !text-black"
                                onClick={() => setModalContent('')}
                              >
                                {'ยกเลิก'}
                              </CWAButton>
                              <CWAButton
                                className="!border-danger !bg-danger"
                                onClick={() => {
                                  props.onRemoveUser?.(record);
                                  setModalContent('');
                                }}
                              >
                                {'ลบบัญชี'}
                              </CWAButton>
                            </div>
                          </div>
                        </Modal>,
                      );
                    }}
                  >
                    <IconX />
                  </button>
                );
              },
            },
          ],
          records: props.userRecords,
          page: props.page,
          onPageChange: props.onPageChange,
          limit: props.limit,
          onLimitChange: props.onLimitChange,
          totalRecords: props.totalRecords,
          minHeight: 400,
          fetching: props.fetching,

          selectedRecords: props.selectedRecords,
          onSelectedRecordsChange: props.onSelectedRecordsChange,
        }}
      />

      <CWTModalUser
        type={props.type}
        open={isModalOpen}
        onClose={onUserModalClose}
        title={`เลือก${props.type == 'student' ? 'นักเรียน' : 'ครู'}`}
        onSubmit={async (rows) => {
          onSubmitUsers(rows);
          setIsModalOpen(false);
        }}
      />

      {props.children}
      {modalContent}
    </CWTLayout>
  );
};

export default CWTManageUser;
