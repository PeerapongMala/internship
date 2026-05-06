import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import {
  Curriculum,
  FilterSubject,
  GetByStudent,
  ItemList,
  NewCreateReward,
  SpecialRewardInside,
  Status,
  StatusReward,
  Student,
  TeacherItem,
  TeacherReward,
} from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
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

import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import CWMInputFileButton from '../local/components/web/organism/cw-m-input-file-button';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import CWTable from '../local/components/web/table/cw-table.';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import { CopyReward } from '../local/api/types/reward';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import CWModalSelectStudent from '@component/web/cw-modal/cw-modal-select-student';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};
const DomainJSX = () => {
  const navigate = useNavigate();
  const modalselectStudent = useModal();
  const confirmModal = useModal(false);

  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  const { targetData, userData } = StoreGlobalPersist.StateGet([
    'targetData',
    'userData',
  ]) as {
    targetData: IUserData;
    userData: IUserData;
  };

  const subjectId =
    Array.isArray(targetData?.subject) && targetData.subject.length > 0
      ? targetData.subject[0].id
      : Array.isArray(userData?.subject) && userData.subject.length > 0
        ? userData.subject[0].id
        : undefined;
  const teacherName = targetData?.first_name ?? userData?.first_name;

  const { id } = useSearch({ strict: false });

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      if (isMobile && window.location.pathname !== '/teacher/reward/free/create') {
        navigate({ to: '/teacher/reward/free/create' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<
    {
      user_id: string;
      student_id: string;
      first_name?: string;
      last_name?: string;
    }[]
  >([]);

  const [copyData, setCopyData] = useState<CopyReward[]>([]);

  // get
  const [subjectData, setSubjectData] = useState<FilterSubject[]>([]);
  const [itemData, setItemData] = useState<TeacherItem[]>([]);
  const [itemDataDetail, setItemDataDetail] = useState<ItemList>();
  // setCreate
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [displayStudentId, setDisplayStudentId] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // image
  const [imageSize] = useState(5);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [iconURL, setIconURL] = useState<string>('');
  const [imageURLs, setImageURLs] = useState<string[]>();

  const [rewardName, setRewardName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  // set Status
  const [selectStatus, setSelectStatus] = useState<StatusReward>();

  const [formData, setFormData] = useState<Partial<NewCreateReward>>({});

  useEffect(() => {
    if (selectedStudentId?.length > 0) {
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
      // setByStudent(validResults[0]);
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

  useEffect(() => {
    if (id) {
      console.log('Fetching data for ID:', id);
      fetchCopyReward();
    } else {
      console.log('No ID provided');
    }
  }, [id]);

  const fetchCopyReward = async () => {
    setFetching(true);
    try {
      const res = await API.reward.CopyByIdReward(id, {});
      if (res.status_code === 201) {
        console.log('API Response Data:', res.data);
        setCopyData(res.data);
      } else {
        console.error('API Error:', res);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  // copy
  useEffect(() => {
    if (copyData) {
      setRewardName(copyData[0]?.reward_name);
      setAmount(copyData[0]?.reward_amount);

      if (copyData[0]?.reward_image) {
        setIconURL(copyData[0]?.reward_image);

        fetch(copyData[0]?.reward_image)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'copy-image.jpg', { type: blob.type });
            setImageFile(file);
          })
          .catch((error) => {
            console.error('Error fetching image:', error);
            setImageFile(undefined);
          });
      }

      setSelectStatus(StatusReward.SEND);

      if (copyData[0]?.student_ids && copyData[0]?.student_ids.length > 0) {
        const students = copyData[0]?.student_ids.map((id) => ({
          user_id: id.toString(),
          student_id: id.toString(),
          first_name: '',
          last_name: '',
        }));
        setSelectedStudentId(students);
        setSelectedUserIds(students.map((student) => student.user_id));
      }
    }
  }, [copyData]);

  const handldCreate = async () => {
    if (!rewardName) {
      showMessage('โปรดกรอกชื่อรางวัล', 'warning');
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
    if (!imageFile) {
      showMessage('โปรดเลือกรูปรางวัล', 'warning');
      return;
    }
    if (selectedStudentId.length === 0) {
      showMessage('โปรดเลือกนักเรียน', 'warning');
      return;
    }
    setFetching(true);
    try {
      const formData: Partial<NewCreateReward> = {
        student_ids: selectedStudentId.map((student) => student.user_id),
        subject_id: String(subjectId),
        reward_name: id ? rewardName : `${rewardName} (${teacherName})`,
        reward_amount: String(amount),
        status: StatusReward.SEND,
        image: imageFile,
      };
      const res = await API.reward.CreateReward(formData);
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

  const handleSubjectChange = (selected: string) => {
    const selectedSubject = subjectData.find((s) => `วิชา${s.subject_name}` === selected);
  };

  const currentSubject = useMemo(() => {
    if (!subjectId || subjectData.length === 0) return null;
    return subjectData.find((s) => String(s.subject_id) === String(subjectId));
  }, [subjectData, subjectId]);

  // remove student
  const handleRemoveStudent = (user_id: string) => {
    setSelectedStudentId((prev) => prev.filter((student) => student.user_id !== user_id));
  };

  // student column
  const columnStudent = useMemo<
    DataTableColumn<{
      user_id: string;
      student_id: string;
      first_name?: string;
      last_name?: string;
    }>[]
  >(() => {
    return [
      { accessor: 'student_id', title: 'รหัสนักเรียน' },
      { accessor: 'first_name', title: 'ชื่อ' },
      { accessor: 'last_name', title: 'นามสกุล' },
      {
        accessor: 'delete',
        title: 'เอาออก',
        textAlign: 'center',
        render: (record) => (
          <button
            onClick={() => handleRemoveStudent(record.user_id)}
            className="flex w-full items-center justify-center"
          >
            <IconX />
          </button>
        ),
      },
    ];
  }, []);

  return (
    <LineLiffPage className="mb-28">
      <div className="w-full">
        <div className="my-5">
          <CWTitleBack label="สร้างรางวัลฟรี" href="../" />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex w-full flex-col md:w-[70%]">
            <CWWhiteBox>
              <div className="w-full">
                <div className="flex flex-col gap-5">
                  <div className="flex w-[250px] flex-col gap-2">
                    <p>
                      <span className="text-red-500">*</span>วิชา
                    </p>
                    <WCADropdown
                      placeholder={
                        currentSubject ? `${currentSubject.subject_name}` : 'เลือกวิชา'
                      }
                      options={subjectData.map((s) => `${s.subject_name}`)}
                      onSelect={handleSubjectChange}
                      disabled={true}
                    />
                  </div>

                  <div className="grid w-full grid-cols-2 gap-5">
                    <CWInput
                      label={'ชื่อรางวัล'}
                      required
                      className="col-span-1"
                      value={rewardName}
                      onChange={(e) => setRewardName(e.target.value)}
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
                  <hr />
                  <div className="text-sm text-dark">
                    <span className="text-red-500">*</span>รูปรางวัล
                  </div>
                  <div className="text-sm text-dark">
                    format: .jpg, .png | ขนาดไม่เกิน {imageSize} MB
                  </div>
                  <CWMInputFileButton
                    label={'อัปโหลด'}
                    onFileChange={setImageFile}
                    accept="image/jpeg, image/png"
                    size={imageSize}
                    file={imageFile || formData.image || iconURL}
                    preview={true}
                  />
                </div>
              </div>
            </CWWhiteBox>

            <CWWhiteBox className="mt-5">
              <div className="w-full">
                <div className="flex w-full gap-3">
                  <CWButton
                    title="เพิ่มนักเรียน"
                    icon={<IconPlus />}
                    onClick={modalselectStudent.open}
                  />
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <p className="text-xl font-bold">นักเรียน</p>
                  <CWTable
                    columns={columnStudent}
                    records={selectedStudentId}
                    fetching={fetching}
                    height={'350px'}
                    noRecordsText={'เลือกข้อมูลนักเรียน'}
                  />
                </div>
              </div>
            </CWWhiteBox>
          </div>

          <SidePanel
            titleName="รหัสไอเทม"
            status={handleStatusChange}
            statusValue={selectStatus}
            onClick={confirmModal.open}
          />
        </div>

        {/* modl selected  student*/}
        <CWModalSelectStudent
          open={modalselectStudent.isOpen}
          onClose={modalselectStudent.close}
          onSelect={(students) => {
            setSelectedStudentId(students);
          }}
          initialSelected={selectedStudentId}
        />

        <CWModalCustom
          open={confirmModal.isOpen}
          onClose={confirmModal.close}
          onOk={() => {
            confirmModal.close();
            handldCreate();
          }}
          title="ยืนยันการสร้างรางวัล"
          buttonName="ยืนยัน"
          cancelButtonName="ยกเลิก"
          variant="danger"
          size="medium"
        >
          <p className="text-base">
            กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนดำเนินการต่อ <br />
            <strong>เนื่องจากหลังจากนี้จะไม่สามารถแก้ไขข้อมูลได้อีก</strong>
          </p>
        </CWModalCustom>
      </div>
    </LineLiffPage>
  );
};

export default DomainJSX;
0;
