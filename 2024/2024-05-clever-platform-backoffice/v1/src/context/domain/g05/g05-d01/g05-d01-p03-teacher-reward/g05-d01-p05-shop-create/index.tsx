import StoreGlobal from '@global/store/global';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import {
  CopyShop,
  Item,
  NewStoreItem,
  StoreItem,
  SubjectShop,
} from '../local/api/types/shop';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWMInputFileButton from '../local/components/web/organism/cw-m-input-file-button';
import useModal from '@global/utils/useModal';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWTable from '../local/components/web/table/cw-table.';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import { DataTableColumn } from 'mantine-datatable';
import CWTitleBack from '@component/web/cw-title-back';
import CWSidePanelShop from '../local/components/web/organism/cw-sidebar-shop';
import { ModalClassroom, ModalStudyGroup } from '../local/type';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import CWModalSelectClassroom from '@component/web/cw-modal/cw-modal-select-classroom';
import CWModalSelectStudyGroup from '@component/web/cw-modal/cw-modal-select-study-group';
import CWModalSelectStudent from '@component/web/cw-modal/cw-modal-select-student';
import SelectUserSubjectData from '@component/web/cw-select-user-subject-data';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const modalselectStudent = useModal();
  const modalselectClassroom = useModal();
  const modalselectStudyGroup = useModal();

  const { targetData, userData } = StoreGlobalPersist.StateGet([
    'targetData',
    'userData',
  ]) as {
    targetData: IUserData;
    userData: IUserData;
  };
  const { itemType, storeItemId }: { itemType: 'coupon'; storeItemId: string } =
    useParams({
      strict: false,
    });

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      if (
        isMobile &&
        window.location.pathname !== '/teacher/reward/store/coupon/create'
      ) {
        navigate({ to: '/teacher/reward/store/coupon/create' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const { id } = useSearch({ strict: false });

  const schoolId = userData?.school_id ?? targetData?.school_id;
  const subjectId =
    Array.isArray(targetData?.subject) && targetData.subject.length > 0
      ? targetData.subject[0].id
      : Array.isArray(userData?.subject) && userData.subject.length > 0
        ? userData.subject[0].id
        : undefined;

  // modal data
  const [selectedStudentId, setSelectedStudentId] = useState<
    {
      user_id: string;
      student_id: string;
      first_name?: string;
      last_name?: string;
    }[]
  >([]);
  const [selectedClassRoom, setSelectedClassRoom] = useState<ModalClassroom[]>([]);
  const [selectedStudyGroup, setSelectedStudyGroup] = useState<ModalStudyGroup[]>([]);

  const [copyData, setCopyData] = useState<CopyShop[]>([]);

  const [fetching, setFetching] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const [imageSize] = useState(5);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [iconURL, setIconURL] = useState<string>('');

  const [selectStatus, setSelectStatus] = useState<any>();
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    price: 0,
    initial_stock: 0,
    limit_per_user: 0,
    open_date: '',
    closed_date: '',
    initial_stock_unlimited: false,
    limit_per_user_unlimited: false,
    open_date_unlimited: false,
    closed_date_unlimited: false,
  });

  useEffect(() => {
    if (subjectId) {
      API.item.Get(+subjectId, itemType).then((res) => {
        if (res.status_code == 200) {
          setItems(res.data);
        }
      });
    }
  }, [itemType]);

  useEffect(() => {
    if (id) {
      console.log('Fetching data for ID:', id);
      fetchCopyShop();
    } else {
      console.log('No ID provided');
    }
  }, [id]);
  const fetchCopyShop = async () => {
    setFetching(true);
    try {
      const res = await API.store.CopyByIdShop(id, {});
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
  useEffect(() => {
    if (copyData && copyData.length > 0) {
      const data = copyData[0];
      setFormData({
        item_name: data.item_name || '',
        item_description: data.item_description || '',
        price: data.price || 0,
        initial_stock: data.initial_stock || 0,
        limit_per_user: data.limit_per_user || 0,
        open_date: data.open_date || '',
        closed_date: data.closed_date || '',
        initial_stock_unlimited:
          data.initial_stock === null || data.initial_stock === undefined,
        limit_per_user_unlimited:
          data.limit_per_user === null || data.limit_per_user === undefined,
        open_date_unlimited: !data.open_date,
        closed_date_unlimited: !data.closed_date,
      });

      if (data.image_url) {
        setIconURL(data.image_url);

        fetch(data.image_url)
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

      setSelectStatus(data.status || 'enabled');

      if (data.class_ids && data.class_ids.length > 0) {
        setSelectedClassRoom(
          data.class_ids.map((classroom) => ({
            class_id: classroom.class_id,
            class_name: classroom.class_name,
            class_year: classroom.class_year,
            class_academic_year: classroom.class_academic_year,
            student_count: classroom.student_count,
          })),
        );
      }

      // ตั้งค่ากลุ่มเรียน
      if (data.study_group_ids && data.study_group_ids.length > 0) {
        setSelectedStudyGroup(
          data.study_group_ids.map((group) => ({
            study_group_id: group.study_group_id,
            study_group_name: group.study_group_name,
            class_name: group.class_name,
            class_year: group.class_year,
            student_count: group.student_count,
          })),
        );
      }

      // ตั้งค่านักเรียน
      if (data.student_ids && data.student_ids.length > 0) {
        setSelectedStudentId(
          data.student_ids.map((student) => ({
            user_id: student.user_id,
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
          })),
        );
      }
    }
  }, [copyData]);

  function onSubmit() {
    setIsSubmit(true);
    if (!subjectId) return;

    if (!formData.item_name.trim()) {
      showMessage('กรุณากรอกชื่อไอเทม', 'warning');
      setIsSubmit(false);
      return;
    }

    if (formData.price <= 0) {
      showMessage('กรุณากรอกราคาที่มากกว่า 0', 'warning');
      setIsSubmit(false);
      return;
    }

    if (!formData.initial_stock_unlimited && formData.initial_stock <= 0) {
      showMessage(
        'กรุณากรอกจำนวนที่ขายในร้านให้มากกว่า 0 หรือเลือกไม่จำกัดจำนวน',
        'warning',
      );
      setIsSubmit(false);
      return;
    }

    if (!formData.limit_per_user_unlimited && formData.limit_per_user <= 0) {
      showMessage(
        'กรุณากรอกจำนวนจำกัดต่อคนให้มากกว่า 0 หรือเลือกไม่จำกัดจำนวน',
        'warning',
      );
      setIsSubmit(false);
      return;
    }

    if (!formData.open_date_unlimited && !formData.open_date) {
      showMessage('กรุณาเลือกวันที่เริ่มเผยแพร่ หรือเลือกไม่จำกัดวันที่', 'warning');
      setIsSubmit(false);
      return;
    }
    if (!formData.closed_date_unlimited && !formData.closed_date) {
      showMessage('กรุณาเลือกวันที่หยุดเผยแพร่ หรือเลือกไม่จำกัดวันที่', 'warning');
      setIsSubmit(false);
      return;
    }
    if (
      !formData.open_date_unlimited &&
      !formData.closed_date_unlimited &&
      formData.open_date &&
      formData.closed_date
    ) {
      const openDate = new Date(formData.open_date);
      const closedDate = new Date(formData.closed_date);

      if (openDate > closedDate) {
        showMessage('วันที่เริ่มเผยแพร่ต้องไม่มากกว่าวันที่หยุดเผยแพร่', 'warning');
        setIsSubmit(false);
        return;
      }
    }
    if (!imageFile) {
      showMessage('กรุณาเลือกรูปรางวัล', 'warning');
      setIsSubmit(false);
      return;
    }
    if (!selectStatus || selectStatus === 'expired') {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      setIsSubmit(false);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('item_name', formData.item_name);
    formDataToSubmit.append('item_description', formData.item_description);
    formDataToSubmit.append('price', formData.price.toString());

    if (!formData.initial_stock_unlimited) {
      formDataToSubmit.append('initial_stock', formData.initial_stock.toString());
    }

    if (!formData.limit_per_user_unlimited) {
      formDataToSubmit.append('limit_per_user', formData.limit_per_user.toString());
    }

    if (!formData.open_date_unlimited && formData.open_date) {
      formDataToSubmit.append('open_date', new Date(formData.open_date).toISOString());
    }

    if (!formData.closed_date_unlimited && formData.closed_date) {
      formDataToSubmit.append(
        'closed_date',
        new Date(formData.closed_date).toISOString(),
      );
    }

    formDataToSubmit.append('status', selectStatus || 'pending');

    if (imageFile) {
      formDataToSubmit.append('image', imageFile);
    } else if (iconURL) {
      formDataToSubmit.append('image_key', copyData[0].image_key);
    }

    if (selectedClassRoom.length > 0) {
      selectedClassRoom.forEach((classroom) => {
        formDataToSubmit.append('class_ids', String(classroom.class_id));
      });
    }
    if (selectedStudyGroup.length > 0) {
      selectedStudyGroup.forEach((study) => {
        formDataToSubmit.append('study_group_ids', String(study.study_group_id));
      });
    }

    if (selectedStudentId.length > 0) {
      selectedStudentId.forEach((student) => {
        formDataToSubmit.append('student_ids', student.user_id);
      });
    }

    API.store.Create(+subjectId, formDataToSubmit).then((res) => {
      setIsSubmit(false);
      if (res.status_code == 200 || res.status_code == 201) {
        showMessage('บันทึกสำเร็จ', 'success');
        navigate({ to: '..' });
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  const handleStatusChange = (value: any) => {
    setSelectStatus(value);
  };

  const handleRemoveStudent = (user_id: string) => {
    setSelectedStudentId((prev) => prev.filter((student) => student.user_id !== user_id));
  };
  const handleRemoveClassroom = (class_id: number) => {
    setSelectedClassRoom((prev) =>
      prev.filter((classroom) => classroom.class_id !== class_id),
    );
  };
  const handleRemoveStudyGroup = (study_group_id: number) => {
    setSelectedStudyGroup((prev) =>
      prev.filter((studyGroup) => studyGroup.study_group_id !== study_group_id),
    );
  };

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
  const columnClassroom = useMemo<DataTableColumn<ModalClassroom>[]>(() => {
    return [
      { accessor: 'class_id', title: 'รหัสห้อง' },
      { accessor: 'class_name', title: 'ชื่อห้อง' },
      { accessor: 'class_year', title: 'ชั้นปี' },
      { accessor: 'class_academic_year', title: 'ปีการศึกษา' },
      { accessor: 'student_count', title: 'จำนวนนักเรียน' },
      {
        accessor: 'delete',
        title: 'เอาออก',
        textAlign: 'center',
        render: (record) => (
          <button
            onClick={() => handleRemoveClassroom(record.class_id)}
            className="flex w-full items-center justify-center"
          >
            <IconX />
          </button>
        ),
      },
    ];
  }, []);
  const columnStudyGroup = useMemo<DataTableColumn<ModalStudyGroup>[]>(() => {
    return [
      { accessor: 'study_group_id', title: 'รหัสกลุ่มเรียน' },
      { accessor: 'study_group_name', title: 'ชื่อกลุ่มเรียน' },
      { accessor: 'class_year', title: 'ชั้นปี' },
      { accessor: 'class_name', title: 'ห้อง' },
      { accessor: 'student_count', title: 'จำนวนนักเรียน' },
      {
        accessor: 'delete',
        title: 'เอาออก',
        textAlign: 'center',
        render: (record) => (
          <button
            onClick={() => handleRemoveStudyGroup(record.study_group_id)}
            className="flex w-full items-center justify-center"
          >
            <IconX />
          </button>
        ),
      },
    ];
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // ถ้าเป็น initial_stock และ initial_stock_unlimited เป็น true ให้เคลียร์ค่า
      if (field === 'initial_stock' && prev.initial_stock_unlimited) {
        newData.initial_stock = 0;
      } else if (field === 'limit_per_user' && prev.limit_per_user_unlimited) {
        newData.limit_per_user = 0;
      } else if (field === 'open_date' && prev.open_date_unlimited) {
        newData.open_date = '';
      } else if (field === 'closed_date' && prev.closed_date_unlimited) {
        newData.closed_date = '';
      }

      return newData;
    });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
      ...(field === 'initial_stock_unlimited' && !checked ? { initial_stock: 0 } : {}),
      ...(field === 'limit_per_user_unlimited' && !checked ? { limit_per_user: 0 } : {}),
      ...(field === 'open_date_unlimited' && !checked ? { open_date: '' } : {}),
      ...(field === 'closed_date_unlimited' && !checked ? { closed_date: '' } : {}),
    }));
  };

  return (
    <LineLiffPage className="mb-28 px-5">
      <div className="w-full">
        <div className="my-5">
          <CWTitleBack label="สร้างรางวัลในร้านค้า" href="../" />
        </div>
        <div className="flex w-full flex-col gap-5 md:flex-row md:gap-10">
          <div className="w-full md:w-[70%]">
            <CWWhiteBox>
              <div className="w-full">
                <p className="text-base font-bold">รายละเอียด</p>
                <div className="mt-5 grid grid-cols-2 gap-5">
                  <CWInput
                    label={'ชื่อไอเทม'}
                    required
                    className="col-span-2 md:col-span-1"
                    value={formData.item_name}
                    onChange={(e) => handleInputChange('item_name', e.target.value)}
                  />
                  <SelectUserSubjectData label="วิชา" className="w-full" />
                  <CWInput
                    label={'คำอธิบาย'}
                    required={false}
                    placeholder="คำอธิบาย..."
                    className="col-span-2"
                    value={formData.item_description}
                    onChange={(e) =>
                      handleInputChange('item_description', e.target.value)
                    }
                  />
                </div>

                <div className="mt-5 grid w-full grid-cols-3 gap-5">
                  <CWInput
                    label={'ราคา(เหรียญทอง)'}
                    required={true}
                    type={'number'}
                    className="col-span-3 md:col-span-1"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  />
                  <div className="col-span-3 flex flex-col gap-2 md:col-span-1">
                    <CWInput
                      label={'จำนวนที่ขายในร้าน'}
                      required={true}
                      type={'number'}
                      value={
                        formData.initial_stock_unlimited ? '' : formData.initial_stock
                      }
                      onChange={(e) =>
                        handleInputChange('initial_stock', Number(e.target.value))
                      }
                      disabled={formData.initial_stock_unlimited}
                    />
                    <CWInputCheckbox
                      label={'ไม่จำกัดจำนวน'}
                      checked={formData.initial_stock_unlimited}
                      onChange={(e) =>
                        handleCheckboxChange('initial_stock_unlimited', e.target.checked)
                      }
                    />
                  </div>
                  <div className="col-span-3 flex flex-col gap-2 md:col-span-1">
                    <CWInput
                      label={'จำนวนจำกัดต่อคน'}
                      required={true}
                      type={'number'}
                      value={
                        formData.limit_per_user_unlimited ? '' : formData.limit_per_user
                      }
                      onChange={(e) =>
                        handleInputChange('limit_per_user', Number(e.target.value))
                      }
                      disabled={formData.limit_per_user_unlimited}
                    />
                    <CWInputCheckbox
                      label={'ไม่จำกัดจำนวน'}
                      checked={formData.limit_per_user_unlimited}
                      onChange={(e) =>
                        handleCheckboxChange('limit_per_user_unlimited', e.target.checked)
                      }
                    />
                  </div>
                </div>

                <div className="mt-5 grid w-full grid-cols-2 gap-5">
                  <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                    <WCAInputDateFlat
                      label="วันที่เริ่มเผยแพร่"
                      required
                      value={formData.open_date_unlimited ? '' : formData.open_date}
                      onChange={(value) => handleInputChange('open_date', value)}
                      disabled={formData.open_date_unlimited}
                      options={{
                        minDate:
                          formData.open_date && !formData.open_date_unlimited
                            ? new Date(formData.open_date)
                            : new Date(),
                      }}
                    />
                    <CWInputCheckbox
                      label={'เผยแพร่ทันที'}
                      checked={formData.open_date_unlimited}
                      onChange={(e) =>
                        handleCheckboxChange('open_date_unlimited', e.target.checked)
                      }
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                    <WCAInputDateFlat
                      label="วันที่หยุดเผยแพร่"
                      required
                      value={formData.closed_date_unlimited ? '' : formData.closed_date}
                      onChange={(value) => handleInputChange('closed_date', value)}
                      disabled={formData.closed_date_unlimited}
                      options={{
                        minDate: 'today',
                      }}
                    />
                    <CWInputCheckbox
                      label={'ไม่กำหนด'}
                      checked={formData.closed_date_unlimited}
                      onChange={(e) =>
                        handleCheckboxChange('closed_date_unlimited', e.target.checked)
                      }
                    />
                  </div>
                </div>

                <div className="mt-5 w-full">
                  <div className="text-sm text-dark">
                    <span className="text-red-500">*</span>รูปรางวัล
                  </div>
                  <div className="text-sm text-dark">
                    format: .jpg, .png | ขนาดไม่เกิน {imageSize} MB
                  </div>
                  <CWMInputFileButton
                    label={'อัปโหลด'}
                    onFileChange={(file) => {
                      setImageFile(file);
                      if (!file) setIconURL('');
                    }}
                    accept="image/jpeg, image/png"
                    size={imageSize}
                    file={imageFile || iconURL}
                    preview={true}
                  />
                </div>
              </div>
            </CWWhiteBox>

            <CWWhiteBox className="mt-5">
              <div className="w-full">
                <div className="flex w-full gap-3">
                  <CWButton
                    title="เพิ่มห้องเรียน"
                    icon={<IconPlus />}
                    onClick={modalselectClassroom.open}
                  />
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <p className="text-xl font-bold">ห้องเรียน</p>
                  <CWTable
                    columns={columnClassroom}
                    records={selectedClassRoom}
                    fetching={fetching}
                    height={'350px'}
                    noRecordsText={'เลือกข้อมูลห้องเรียน'}
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex w-full gap-3">
                  <CWButton
                    title="เพิ่มกลุ่มเรียน"
                    icon={<IconPlus />}
                    onClick={modalselectStudyGroup.open}
                  />
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <p className="text-xl font-bold">กลุ่มเรียน</p>
                  <CWTable
                    columns={columnStudyGroup}
                    records={selectedStudyGroup}
                    fetching={fetching}
                    height={'350px'}
                    noRecordsText={'เลือกข้อมูลกลุ่มเรียน'}
                  />
                </div>
              </div>

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

          <CWSidePanelShop
            titleName="รหัสไอเทม"
            status={handleStatusChange}
            statusValue={selectStatus}
            onClick={onSubmit}
          />
        </div>

        <CWModalSelectClassroom
          open={modalselectClassroom.isOpen}
          onClose={modalselectClassroom.close}
          onSelect={(classroom) => {
            setSelectedClassRoom(classroom);
          }}
          initialSelected={selectedClassRoom}
        />
        <CWModalSelectStudyGroup
          open={modalselectStudyGroup.isOpen}
          onClose={modalselectStudyGroup.close}
          onSelect={(classroom) => {
            setSelectedStudyGroup(classroom);
          }}
          initialSelected={selectedStudyGroup}
        />

        <CWModalSelectStudent
          open={modalselectStudent.isOpen}
          onClose={modalselectStudent.close}
          onSelect={(students) => {
            setSelectedStudentId(students);
          }}
          initialSelected={selectedStudentId}
        />
      </div>
    </LineLiffPage>
  );
};

export default DomainJSX;
