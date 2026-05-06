import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import {
  Curriculum,
  FilterSubject,
  GetByStudent,
  ItemList,
  SpecialRewardInside,
  Status,
  StatusReward,
  TeacherItem,
} from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInputSearch from '@component/web/cw-input-search';
import CWButton from '@component/web/cw-button';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import SidePanel from '../local/components/web/organism/Sidepanel';
import ModalSelectStudent from '../local/components/web/modal/ModalSelectStudent';
import CWModalSelectStudent from '../local/components/web/modal/ModalSelectStudent';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import CWSelectValue from '@component/web/cw-selectValue';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};
const DomainJSX = () => {
  const navigate = useNavigate();
  const modalselectStudent = useModal();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/reward/create') {
        navigate({ to: '/line/teacher/reward/create' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<
    { user_id: string; student_id: string }[]
  >([]);
  const [byStudent, setByStudent] = useState<GetByStudent | undefined>(undefined);

  // get
  const [subjectData, setSubjectData] = useState<FilterSubject[]>([]);
  const [itemData, setItemData] = useState<TeacherItem[]>([]);
  const [itemDataDetail, setItemDataDetail] = useState<ItemList>();
  // setCreate
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [displayStudentId, setDisplayStudentId] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [amount, setAmount] = useState<number>(0);
  // set Status
  const [selectStatus, setSelectStatus] = useState<StatusReward>();

  useEffect(() => {
    if (selectedStudentId?.length === 0) {
      fetchStudentData(selectedStudentId);
    }
  }, [selectedStudentId]);
  useEffect(() => {
    fetchSubjetDropdown();
  }, []);
  useEffect(() => {
    fetchItem();
  }, [selectedSubject]);
  useEffect(() => {
    fetchItemDetail();
  }, [selectedItem]);
  useEffect(() => {
    if (!selectedSubject) {
      setSelectedItem('');
    }
  }, [selectedSubject]);

  const fetchStudentData = async (
    students: { user_id: string; student_id: string }[],
  ) => {
    setFetching(true);
    try {
      const results = await Promise.all(
        students.map(async (student) => {
          const res = await API.reward.GetByStudent(student.user_id);
          if (res.status_code === 200) {
            return res.data;
          } else {
            showMessage(`ไม่พบรหัสนักเรียน: ${student.student_id}`, 'error');
            return null;
          }
        }),
      );
      const validResults = results.filter((result) => result !== null);
      setByStudent(validResults[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const fetchSubjetDropdown = async () => {
    setFetching(true);
    try {
      const res = await API.reward.GetSubject({
        limit: -1,
      });

      if (res.status_code === 200) {
        setSubjectData(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };
  const fetchItem = async () => {
    if (!selectedSubject) {
      return;
    }
    setFetching(true);
    try {
      const res = await API.reward.GetTeacherItem(selectedSubject, {
        limit: -1,
      });
      if (res.status_code === 200) {
        setItemData(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };
  const fetchItemDetail = async () => {
    setFetching(true);
    try {
      const res = await API.reward.GetByItem(selectedItem);
      if (res.status_code === 200) {
        setItemDataDetail(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };
  const handldCreate = async () => {
    if (selectedStudentId.length === 0) {
      showMessage('โปรดเลือกนักเรียน', 'warning');
      return;
    }
    if (!selectedSubject) {
      showMessage('โปรดเลือกวิชา', 'warning');
      return;
    }
    if (!selectedItem) {
      showMessage('โปรดเลือกไอเทม', 'warning');
      return;
    }
    if (!amount) {
      showMessage('โปรดกรอกจำนวน', 'warning');
      return;
    }
    if (amount < 1) {
      showMessage('จำนวนไม่น้อยกว่า 1', 'warning');
      return;
    }
    setFetching(true);
    try {
      const res = await API.reward.CreateReward({
        student: selectedStudentId.map((student) => ({ id: student.user_id })),
        subject_id: Number(selectedSubject),
        item_id: Number(selectedItem),
        amount: amount,
        status: StatusReward.SEND,
      });
      if (res.status_code === 201) {
        showMessage('เพิ่มข้อมูลสำเร็จ', 'success');
        navigate({ to: '../' });
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาด', 'error');
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleStatusChange = (value: StatusReward) => {
    setSelectStatus(value);
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'การให้รางวัลโดยครู', href: '#' },
          { label: 'ให้รางวัล', href: '#' },
        ]}
      />
      <div className="my-5">
        <CWTitleBack label="ให้รางวัล" href="../" />
      </div>
      <div className="flex gap-5">
        <CWWhiteBox className="w-[70%]">
          <div className="w-full">
            <h1 className="text-xl font-bold">เลือกนักเรียน</h1>
            <div className="relative mt-5 flex w-full items-center gap-3">
              <CWInputSearch
                label={'ค้นหาจากรหัสนักเรียน'}
                required
                placeholder="รหัสนักเรียน"
                value={displayStudentId}
                disabled
              />
              <CWButton
                title="รายชื่อนักเรียนทั้งหมด"
                className="absolute top-[12px] h-[35px]"
                onClick={modalselectStudent.open}
              />
            </div>

            <CWNeutralBox className="my-5">
              <div className="flex flex-col">
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    รหัสผู้ใช้งาน:
                  </label>
                  <p className="w-full">{byStudent?.user_id || '-'}</p>
                </div>
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    รหัสนักเรียน:
                  </label>
                  <p className="w-full">{byStudent?.student_id || '-'}</p>
                </div>
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    ชื่อสกุล:
                  </label>
                  <p className="w-full">
                    {byStudent ? `${byStudent.first_name} ${byStudent.last_name}` : '-'}
                  </p>
                </div>
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    ชั้นปี:
                  </label>
                  <p className="w-full">{byStudent?.year || '-'}</p>
                </div>
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    ห้อง:
                  </label>
                  <p className="w-full">{byStudent?.class || '-'}</p>
                </div>
              </div>
            </CWNeutralBox>

            <hr />
            <div className="mt-5 flex flex-col">
              <CWSelectValue
                label="วิชา"
                required
                title="วิชา"
                value={selectedSubject}
                options={subjectData.map((s) => ({
                  label: `${s.subject_name}`,
                  value: s.subject_id,
                }))}
                onChange={(value) => setSelectedSubject(value || '')}
              />
              <h1 className="my-5 text-xl font-bold">เลือกรางวัล</h1>
              <div className="grid w-full grid-cols-2 gap-5">
                <CWSelectValue
                  label="เลือกรางวัล"
                  required
                  title="เลือกรางวัล"
                  className="col-span-1"
                  value={selectedItem}
                  options={itemData.map((s) => ({
                    label: `${s.ItemName}`,
                    value: s.ItemId,
                  }))}
                  onChange={(value) => setSelectedItem(value || '')}
                  disabled={!selectedSubject}
                />
                <CWInput
                  label="จำนวน"
                  type="number"
                  required
                  placeholder="โปรดใส่จำนวน"
                  className="col-span-1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <CWNeutralBox className="mt-5">
                <div className="flex w-full items-center gap-5">
                  <div className="flex size-16 items-center justify-center bg-white">
                    {itemDataDetail?.image_url ? (
                      <img src={itemDataDetail.image_url} alt="item" />
                    ) : (
                      <span className="text-sm text-gray-400">รูป</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold">
                      ชื่อ {itemDataDetail?.name || ''}
                    </h1>
                    <p>
                      รหัสไอเทม: {itemDataDetail?.id || ''} -{' '}
                      {itemDataDetail?.description || ''}
                    </p>
                  </div>
                </div>
              </CWNeutralBox>
            </div>
          </div>
          <CWModalSelectStudent
            open={modalselectStudent.isOpen}
            onClose={modalselectStudent.close}
            onSelect={(students) => {
              setSelectedStudentId(students);
              setSelectedUserIds(students.map((student) => student.user_id));
              setDisplayStudentId(students[0]?.student_id || '');
              fetchStudentData(students);
            }}
          />
        </CWWhiteBox>

        <SidePanel
          titleName="รหัสไอเทม"
          status={handleStatusChange}
          statusValue={selectStatus}
          onClick={handldCreate}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
