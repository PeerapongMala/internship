import StoreGlobal from '@global/store/global';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import { Item, NewStoreItem, StoreItem, SubjectShop } from '../local/api/types/shop';
import { useNavigate, useParams } from '@tanstack/react-router';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWMInputFileButton from '../local/components/web/organism/cw-m-input-file-button';
import SidePanel from '../local/components/web/organism/Sidepanel';
import CWModalSelectStudent from '../local/components/web/modal/ModalSelectStudent';
import useModal from '@global/utils/useModal';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWTable from '../local/components/web/table/cw-table.';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import { DataTableColumn } from 'mantine-datatable';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWSidePanelShop from '../local/components/web/organism/cw-sidebar-shop';
import { ModalClassroom, ModalStudyGroup } from '../local/type';
import CWModalSelectClassroom from '../local/components/web/modal/ModalSelectClassRoom';
import CWModalSelectStudyGroup from '../local/components/web/modal/ModalSelectStudyGroup';

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
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (
        isMobile &&
        window.location.pathname !== '/line/teacher/reward/store/coupon/$storeItemId'
      ) {
        navigate({ to: '/line/teacher/reward/store/coupon/$storeItemId' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const schoolId = userData?.school_id ?? targetData?.school_id;
  const subjectId =
    Array.isArray(targetData?.subject) && targetData.subject.length > 0
      ? targetData.subject[0].id
      : Array.isArray(userData?.subject) && userData.subject.length > 0
        ? userData.subject[0].id
        : undefined;
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

  const [fetching, setFetching] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [storeItem, setStoreItem] = useState<NewStoreItem>();
  const [subject, setSubject] = useState<SubjectShop>();
  const [isSubmit, setIsSubmit] = useState(false);

  const [imageSize] = useState(5);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [iconURL, setIconURL] = useState<string>('');
  const [publishNow, setPublishNow] = useState(false);

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
    if (storeItemId && subjectId) {
      setFetching(true);
      API.store
        .GetById(+subjectId, +storeItemId)
        .then((res) => {
          if (res.status_code === 200) {
            const itemData = res.data;
            setStoreItem(itemData);
            setSelectStatus(itemData.status || 'pending');

            setFormData({
              item_name: itemData.item_name || '',
              item_description: itemData.item_description || '',
              price: itemData.price || 0,
              initial_stock: itemData.initial_stock || 0,
              limit_per_user: itemData.limit_per_user || 0,
              open_date: itemData.open_date || '',
              closed_date: itemData.closed_date || '',
              initial_stock_unlimited: itemData.initial_stock === null,
              limit_per_user_unlimited: itemData.limit_per_user === null,
              open_date_unlimited: !itemData.open_date,
              closed_date_unlimited: !itemData.closed_date,
            });

            if (itemData.image_url instanceof File) {
              setImageFile(itemData.image_url);
              setIconURL(URL.createObjectURL(itemData.image_url));
            } else if (typeof itemData.image_url === 'string') {
              setIconURL(itemData.image_url);
            }

            if (itemData.class_ids) {
              setSelectedClassRoom(
                itemData?.class_ids.map((classroom) => ({
                  class_id: classroom.class_id ?? '',
                  class_name: classroom.class_name ?? '',
                  class_year: classroom.class_year ?? '',
                  class_academic_year: classroom.class_academic_year ?? '',
                  student_count: classroom.student_count ?? '',
                })),
              );
            }
            if (itemData.study_group_ids) {
              setSelectedStudyGroup(
                itemData?.study_group_ids.map((study) => ({
                  study_group_id: study.study_group_id ?? '',
                  study_group_name: study.study_group_name ?? '',
                  class_year: study.class_year ?? '',
                  class_name: study.class_name ?? '',
                  student_count: study.student_count ?? '',
                })),
              );
            }

            if (itemData.student_ids) {
              setSelectedStudentId(
                itemData?.student_ids.map((student) => ({
                  user_id: student.user_id ?? '',
                  student_id: student.student_id ?? '',
                  first_name: student.first_name ?? '',
                  last_name: student.last_name ?? '',
                })),
              );
            }
          }
        })
        .catch(() => {
          showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [storeItemId, subjectId]);

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

    if (!selectStatus || selectStatus === 'expired') {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      setIsSubmit(false);
      return;
    }
    if (
      storeItem &&
      storeItem.initial_stock !== null &&
      !formData.initial_stock_unlimited &&
      formData.initial_stock < storeItem.initial_stock
    ) {
      showMessage('ไม่สามารถลดจำนวนสินค้าคงคลังให้น้อยกว่าที่มีอยู่ได้', 'error');
      return;
    }

    const formDataToSubmit = new FormData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
      const openDate = new Date(formData.open_date);
      openDate.setHours(0, 0, 0, 0);

      // ไม่ให้ย้อนหลังจากวันนี้
      // if (openDate < today) {
      //   showMessage('ไม่สามารถตั้งค่าวันที่เริ่มเผยแพร่ย้อนหลังได้', 'warning');
      //   return;
      // }
      if (storeItem?.open_date) {
        const originalOpenDate = new Date(storeItem.open_date);
        originalOpenDate.setHours(0, 0, 0, 0);
        if (
          originalOpenDate < today &&
          openDate.getTime() !== originalOpenDate.getTime()
        ) {
          showMessage('ไม่สามารถแก้ไขวันที่เริ่มเผยแพร่ย้อนหลังได้', 'warning');
          return;
        }
      }
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
      formDataToSubmit.append('image_url', iconURL);
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
        formDataToSubmit.append('student_ids', String(student.user_id));
      });
    }

    API.store
      .Update(+subjectId, +storeItemId, formDataToSubmit)
      .then((res) => {
        setIsSubmit(false);
        if (res.status_code === 200 || res.status_code === 201) {
          showMessage('อัปเดตข้อมูลสำเร็จ', 'success');
          navigate({ to: '../' });
        } else {
          showMessage(res.message || 'เกิดข้อผิดพลาด', 'error');
        }
      })
      .catch(() => {
        setIsSubmit(false);
        showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
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

  // Update your input handlers to update formData state
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'จัดการรางวัล', href: '#' },
          { label: 'แก้ไขรางวัลในร้านค้า', href: '#' },
        ]}
      />
      <div className="my-5">
        <CWTitleBack label="แก้ไขรางวัลในร้านค้า" href="../" />
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
                <CWInput
                  label={'คำอธิบาย'}
                  required={false}
                  className="col-span-2"
                  value={formData.item_description}
                  onChange={(e) => handleInputChange('item_description', e.target.value)}
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
                    value={formData.initial_stock}
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
                    value={formData.limit_per_user}
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
                    value={formData.open_date}
                    onChange={(value) => handleInputChange('open_date', value)}
                    disabled={formData.open_date_unlimited || true}
                    options={{
                      minDate:
                        formData.open_date && !formData.open_date_unlimited
                          ? new Date(formData.open_date)
                          : new Date(),
                    }}
                  />
                  <CWInputCheckbox
                    label="เผยแพร่ทันที"
                    checked={publishNow}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setPublishNow(checked);
                      if (checked) {
                        setFormData((prev) => ({
                          ...prev,
                          open_date: new Date().toISOString().split('T')[0],
                          open_date_unlimited: false,
                        }));
                      }
                    }}
                    disabled={true}
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                  <WCAInputDateFlat
                    label="วันที่หยุดเผยแพร่"
                    required
                    value={formData.closed_date}
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
                    if (!file) {
                      // Only set the URL if storeItem.image is a string
                      setIconURL(
                        typeof storeItem?.image_url === 'string'
                          ? storeItem.image_url
                          : '',
                      );
                    }
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
          onClick={onSubmit} // Changed to call onSubmit when clicked
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
  );
};

export default DomainJSX;
