// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import showMessage from '@global/utils/showMessage';

import ConfigJson from './config/index.json';
import SidePanel from '../local/components/organisms/Sidepanel';
import CWTitleBack from '@component/web/cw-title-back';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import IconArrowDown from '@asset/icon/arrow-down.svg';
import IconArrowRight from '@asset/icon/arrow-right.svg';
import { YearData, CreateHomeworkRequest, Status } from '../local/type';
import API from '../local/api';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import SelectLevel from './components/template/SelectLevel';
import SelectLessonDropdown from './components/SelectLessonDropdown';
import { getUserData } from '@global/utils/store/getUserData';
import { getUserSubjectData } from '@global/utils/store/user-subject';
import ModalContactAdminForSubject from '@component/web/cw-modal/cw-modal-contact-admin-for-subject';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import dayjs from '@global/utils/dayjs';
import SelectUserSubjectData from '@component/web/cw-select-user-subject-data';

// ปัญหารูป Thjumbnail
const DomainJSX = () => {
  const userData = getUserData();
  const subjectData = getUserSubjectData();

  // TODO: Should validate this before this page load
  if (!userData.is_subject_teacher) {
    return <ModalContactAdminForSubject />;
  }

  const subjectId = subjectData.id;
  const year_id = subjectData.year_id;

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      if (isMobile && window.location.pathname !== '/line/teacher/homework/homework') {
        navigate({ to: '/line/teacher/homework/homework' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = () => {
    setIsExpanded(!isExpanded);
  };

  const [selectedLessonID, setSelectedLessonID] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number[]>([]);
  const [homeworkName, setHomeworkName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [dueTime, setDueTime] = useState<string>('');
  const [closedDate, setClosedDate] = useState<string>('');
  const [closedTime, setClosedTime] = useState<string>('');
  const [sameAsDue, setSameAsDue] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusValue, setStatusValue] = useState<Status>(Status.IN_USE);
  const [isDateInvalid, setIsDateInvalid] = useState<boolean>(false);

  useEffect(() => {
    if (sameAsDue) {
      setClosedDate(dueDate);
      setClosedTime(dueTime);
    }
  }, [sameAsDue, dueDate, dueTime]);

  const handleSaveClick = () => {
    // ป้องกันการกดซ้ำระหว่างที่กำลังส่งข้อมูล
    if (isSubmitting) {
      return;
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!homeworkName) {
      showMessage('กรุณากรอกชื่อการบ้าน', 'warning');
      return;
    }

    if (!statusValue) {
      showMessage('กรุณาเลือกสถานะการบ้าน', 'warning');
      return;
    }

    if (!selectedLessonID) {
      showMessage('กรุณาเลือกบทเรียน', 'warning');
      return;
    }

    if (selectedLevel.length == 0) {
      showMessage('กรุณาเลือกด่าน', 'warning');
      return;
    }

    // เพิ่ม console.log เพื่อดูค่าของวันที่และเวลา
    console.log('วันที่และเวลา:', {
      startDate,
      startTime,
      dueDate,
      dueTime,
      closedDate,
      closedTime,
    });

    // ตรวจสอบว่าข้อมูลวันที่และเวลาไม่เป็นค่าว่าง
    if (!startDate || !startTime) {
      showMessage('กรุณากรอกวันที่และเวลาเริ่มต้น', 'error');
      return;
    }

    if (!dueDate || !dueTime) {
      showMessage('กรุณากรอกวันที่และเวลากำหนดส่ง', 'error');
      return;
    }

    if (!closedDate || !closedTime) {
      showMessage('กรุณากรอกวันที่และเวลาปิดการส่ง', 'error');
      return;
    }

    const toDateTime = (date: string, time: string) =>
      date ? new Date(`${date}T${time || '00:00'}`) : null;

    const startDT = toDateTime(startDate, startTime);
    const dueDT = toDateTime(dueDate, dueTime);
    const closedDT = toDateTime(closedDate, closedTime);

    const isDateInvalid =
      !startDate ||
      !startTime ||
      !dueDate ||
      !dueTime ||
      !closedDate ||
      !closedTime ||
      (startDT && dueDT && dueDT < startDT) ||
      (dueDT && closedDT && closedDT < dueDT) ||
      (startDT && closedDT && closedDT < startDT);

    if (isDateInvalid) {
      showMessage('กรุณาระบุวันและเวลาให้ถูกต้อง', 'error');
      return;
    }

    // ตรวจสอบว่ามีการเลือกกลุ่มเป้าหมายหรือไม่
    const selectedClassIds: number[] = [];
    const selectedStudyGroupIds: number[] = [];
    const selectedYearIds: number[] = [];

    yearData.forEach((year) => {
      if (year.selected) {
        selectedYearIds.push(year.seed_year_id);
      }

      year.class.forEach((cls) => {
        if (cls.selected) {
          selectedClassIds.push(cls.class_id);
        }

        cls.study_group.forEach((group) => {
          if (group.selected) {
            selectedStudyGroupIds.push(group.study_group_id);
          }
        });
      });
    });

    if (
      selectedClassIds.length === 0 &&
      selectedStudyGroupIds.length === 0 &&
      selectedYearIds.length === 0
    ) {
      showMessage('กรุณาเลือกกลุ่มเป้าหมายอย่างน้อย 1 กลุ่ม', 'error');
      return;
    }

    const formatDateTimeToUTC = (date: string, time: string) => {
      const dateTimeString = `${date}T${time.length === 5 ? time + ':00' : time}`;
      const dateObj = new Date(dateTimeString);
      return dateObj.toISOString();
    };

    // เพิ่มการแปลงค่า Status เป็นค่าที่ API ต้องการ
    const mapStatusToApiValue = (status: Status): string => {
      switch (status) {
        case Status.IN_USE:
          return 'enabled';
        case Status.NOT_IN_USE:
          return 'disabled';
        case Status.DRAFT:
          return 'draft';
        default:
          return 'draft';
      }
    };

    const requestData: CreateHomeworkRequest = {
      name: homeworkName,
      subject_id: subjectId,
      year_id: year_id,
      homework_template_name: '',
      homework_template_subject_id: subjectId,
      homework_template_year_id: year_id,
      // if someone know why selected LessonID is string you can remove Number in this line
      homework_template_lesson_id: Number(selectedLessonID),
      homework_template_status: mapStatusToApiValue(statusValue),
      started_at: formatDateTimeToUTC(startDate, startTime),
      due_at: formatDateTimeToUTC(dueDate, dueTime),
      closed_at: formatDateTimeToUTC(closedDate, closedTime),
      status: mapStatusToApiValue(statusValue),
      assigned_to: {
        class_ids: selectedClassIds,
        study_group_ids: selectedStudyGroupIds,
        // seed_year_ids: selectedYearIds,
      },

      level_ids: selectedLevel,
    };

    // เพิ่ม console.log เพื่อตรวจสอบข้อมูลที่จะส่ง
    console.log('ข้อมูลที่จะส่ง:', requestData);

    setIsSubmitting(true);

    API.teacherHomework
      .CreateHomework(requestData)
      .then((response) => {
        if (response.status_code === 200) {
          showMessage('บันทึกข้อมูลการบ้านสำเร็จ', 'success');
          // แก้ไขการนำทางให้ส่ง query parameters ไปด้วย
          navigate({
            to: '../',
          });
        } else {
          showMessage(`เกิดข้อผิดพลาด: ${response.message}`, 'error');
        }
      })
      .catch((error) => {
        console.error('Error creating homework:', error);
        showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const [yearData, setYearData] = useState<YearData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Log selected items
    const selectedItems = yearData.map((year) => ({
      year: year.seed_year_short_name,
      selected: year.selected,
      classes: year.class.map((cls) => ({
        class: cls.class_name,
        selected: cls.selected,
        study_groups: cls.study_group.map((group) => ({
          group: group.study_group_name,
          selected: group.selected,
        })),
      })),
    }));

    console.log('Currently selected items:', selectedItems);
  }, [yearData]);

  useEffect(() => {
    console.log('yearData', yearData);
  }, [yearData]);

  useEffect(() => {
    setIsLoading(true);
    API.teacherHomework
      .GetAssignTargetList(Number(userData.school_id) || 1)
      .then((response) => {
        if (response.status_code === 200) {
          // เพิ่ม property selected เป็น false ให้กับทุกรายการ
          const dataWithSelection = response.data.map((year) => ({
            ...year,
            selected: false,
            class: year.class.map((cls) => ({
              ...cls,
              selected: false,
              study_group: cls.study_group.map((group) => ({
                ...group,
                selected: false,
              })),
            })),
          }));

          setYearData(dataWithSelection);
        } else {
          console.error('Failed to fetch assign target list:', response.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching assign target list:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // เรียกครั้งเดียวเมื่อ component mount

  const handleSelectAllGroupsInClass = (
    seedYearId: number,
    classId: number,
    isChecked: boolean,
  ) => {
    const updated = yearData.map((yearItem) => {
      if (yearItem.seed_year_id !== seedYearId) return yearItem;

      return {
        ...yearItem,
        class: yearItem.class.map((classItem) => {
          if (classItem.class_id !== classId) return classItem;

          return {
            ...classItem,
            study_group: classItem.study_group.map((group) => ({
              ...group,
              selected: isChecked,
            })),
          };
        }),
      };
    });

    setYearData(updated);
  };

  const handleClassSelect = (
    yearId: number,
    classId: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isSelected = event.target.checked;
    setYearData((prevData) =>
      prevData.map((year) => {
        if (year.seed_year_id === yearId) {
          const updatedClasses = year.class.map((cls) => {
            if (cls.class_id === classId) {
              return {
                ...cls,
                selected: isSelected,
                study_group: cls.study_group.map((group) => ({
                  ...group,
                  selected: isSelected,
                })),
              };
            }
            return cls;
          });

          const allClassesSelected = updatedClasses.every((cls) =>
            cls.study_group.every((group) => group.selected),
          );

          return {
            ...year,
            selected: allClassesSelected,
            class: updatedClasses,
          };
        }
        return year;
      }),
    );

    if (isSelected) {
      setExpandedClasses((prev) => ({
        ...prev,
        [`${yearId}-${classId}`]: true,
      }));
    }
  };
  const [dateError, setDateError] = useState<{
    start: string;
    due: string;
    closed: string;
  }>({
    start: '',
    due: '',
    closed: '',
  });

  useEffect(() => {
    const errors: typeof dateError = { start: '', due: '', closed: '' };

    const toDateTime = (date: string, time: string) =>
      date ? new Date(`${date}T${time || '00:00'}`) : null;

    const startDT = toDateTime(startDate, startTime);
    const dueDT = toDateTime(dueDate, dueTime);
    const closedDT = toDateTime(closedDate, closedTime);

    // 1. กำหนดส่งต้อง >= เริ่ม
    if (startDT && dueDT) {
      if (dueDT < startDT) {
        showMessage('กำหนดส่ง ต้องไม่น้อยกว่า เริ่มต้น', 'error');
        return;
      }
    }

    // 2. ปิดรับต้อง >= กำหนดส่ง
    if (dueDT && closedDT) {
      if (closedDT < dueDT) {
        showMessage('ปิดรับ ต้องไม่น้อยกว่า กำหนดส่ง', 'error');
        return;
      }
    }

    // 3. ปิดรับต้อง >= วันที่เริ่ม
    if (startDT && closedDT) {
      if (closedDT < startDT) {
        showMessage('ปิดรับ ต้องไม่น้อยกว่า กำหนดส่ง', 'error');
        return;
      }
    }

    setDateError(errors);
  }, [startDate, startTime, dueDate, dueTime, closedDate, closedTime]);

  const handleGroupSelect = (
    yearId: number,
    classId: number,
    groupId: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isSelected = event.target.checked;
    setYearData((prevData) =>
      prevData.map((year) => {
        if (year.seed_year_id === yearId) {
          const updatedClasses = year.class.map((cls) => {
            if (cls.class_id === classId) {
              const updatedGroups = cls.study_group.map((group) => ({
                ...group,
                selected: group.study_group_id === groupId ? isSelected : group.selected,
              }));

              const allGroupsSelected = updatedGroups.every((group) => group.selected);

              return {
                ...cls,
                selected: allGroupsSelected,
                study_group: updatedGroups,
              };
            }
            return cls;
          });

          const allClassesSelected = updatedClasses.every((cls) =>
            cls.study_group.every((group) => group.selected),
          );

          return {
            ...year,
            selected: allClassesSelected,
            class: updatedClasses,
          };
        }
        return year;
      }),
    );
  };

  // แยกฟังก์ชันสำหรับการ toggle การแสดงผล
  const toggleYearExpand = (yearId: number) => {
    setExpandedYears((prev) => {
      // สร้าง object ใหม่ที่ทุก key มีค่าเป็น false
      const allClosed = Object.keys(prev).reduce(
        (acc, key) => {
          acc[Number(key)] = false;
          return acc;
        },
        {} as { [key: number]: boolean },
      );

      // ถ้า year ที่คลิกกำลังเปิดอยู่ ให้ปิด ถ้าปิดอยู่ให้เปิด
      return {
        ...allClosed,
        [yearId]: !prev[yearId],
      };
    });

    // เมื่อปิด year ให้ปิด class ทั้งหมดที่อยู่ภายใต้ year นั้นด้วย
    setExpandedClasses((prev) => {
      const newExpandedClasses = { ...prev };
      Object.keys(newExpandedClasses).forEach((key) => {
        if (key.startsWith(`${yearId}-`)) {
          newExpandedClasses[key] = false;
        }
      });
      return newExpandedClasses;
    });
  };

  const toggleClassExpand = (yearId: number, classId: number) => {
    const key = `${yearId}-${classId}`;
    setExpandedClasses((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // เพิ่ม state สำหรับเก็บสถานะการเปิด/ปิดของแต่ละปีการศึกษา
  const [expandedYears, setExpandedYears] = useState<{ [key: number]: boolean }>({});

  // เพิ่ม state สำหรับเก็บสถานะการเปิด/ปิดของแต่ละคลาส
  const [expandedClasses, setExpandedClasses] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log('expandedClasses', expandedClasses);
  }, [expandedClasses]);

  // เช็คว่าทุก class และ study group ถูกเลือกหมดหรือยัง
  const areAllSelected = () => {
    return yearData.every((yearItem) =>
      yearItem.class.every(
        (classItem) =>
          classItem.selected && classItem.study_group.every((group) => group.selected),
      ),
    );
  };

  // เมื่อกด select all จะเลือก/ยกเลิกเลือกทั้งหมด
  const handleSelectAll = (e: { target: { checked: any } }) => {
    const checked = e.target.checked;

    const newYearData = yearData.map((yearItem) => ({
      ...yearItem,
      class: yearItem.class.map((classItem) => ({
        ...classItem,
        selected: checked,
        study_group: classItem.study_group.map((group) => ({
          ...group,
          selected: checked,
        })),
      })),
    }));

    setYearData(newYearData);
  };

  function handleStatusChange(value: Status) {
    console.log('Status changed to:', value);
    setStatusValue(value);
  }

  // สร้าง URL สำหรับปุ่มย้อนกลับที่มี query parameters
  const backUrl = `..`;

  return (
    <div className="w-full">
      <div>
        <CWBreadcrumbs
          links={[
            { label: 'การเรียนการสอน', href: '/', disabled: true },
            { label: 'การบ้าน', href: '/teacher/homework/homework' },
            { label: 'สั่งการบ้าน', href: '/' },
          ]}
        />
        <div className="my-8 flex items-center gap-5">
          <CWTitleBack label="สั่งการบ้าน" href={backUrl} />
        </div>
      </div>
      <div className="flex w-full gap-10">
        <div className="w-[75%]">
          <div className="bg-white p-5 shadow-sm">
            <h1 className="text-[24px] font-bold">ข้อมูลการบ้าน</h1>

            <div className="mt-5 grid grid-cols-3 gap-8">
              <div className="col-span-1 w-full">
                <label htmlFor="homework-name">
                  <span className="text-red-500">*</span>ชื่อการบ้าน
                </label>
                <input
                  id="homework-name"
                  type="text"
                  className="form-input"
                  placeholder="ชื่อการบ้าน"
                  value={homeworkName}
                  onChange={(e) => setHomeworkName(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-8">
              {/* <div className="col-span-1 w-full">
                <label htmlFor="">
                  <span className="text-red-500">*</span>วิชา
                </label>
                <input
                  type="text"
                  className="form-input cursor-not-allowed"
                  placeholder="คณิตศาสตร์"
                  value={subject_name}
                  disabled
                />
              </div>
              <div className="col-span-1 w-full">
                <label htmlFor="">
                  <span className="text-red-500">*</span>ชั้นปี:
                </label>
                <input
                  type="text"
                  className="form-input cursor-not-allowed"
                  placeholder="ชั้นปี"
                  value={year_name}
                  disabled
                />
              </div> */}
              <div className="col-span-1 w-full">
                <SelectUserSubjectData label="วิชา" required />
              </div>
              <div className="col-span-1 w-full">
                <label htmlFor="template-select">
                  <span className="text-red-500">*</span>เลือกบทเรียน:
                </label>
                <SelectLessonDropdown
                  subjectID={subjectId}
                  onChange={(id) => setSelectedLessonID(id ? id : null)}
                />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 items-end gap-8">
              {/* วันที่เริ่ม */}
              <div className="col-span-1 w-full">
                <WCAInputDateFlat
                  label="วันที่เริ่ม"
                  required
                  value={startDate}
                  onChange={(dates) => {
                    if (dates && dates[0]) {
                      const date = new Date(dates[0]);
                      const formattedDate = dayjs(date)
                        .format('YYYY-MM-DDTHH:mm:ssZ')
                        .split('T')[0];
                      setStartDate(formattedDate);
                    } else {
                      setStartDate('');
                    }
                  }}
                  options={{
                    minDate: 'today',
                  }}
                />
              </div>
              <div className="col-span-1 w-full">
                <input
                  type="time"
                  className="form-input w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black transition duration-150 ease-in-out"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 items-end gap-8">
              {/* กำหนดส่ง */}
              <div className="col-span-1 w-full">
                <WCAInputDateFlat
                  label="กำหนดส่ง"
                  required
                  value={dueDate}
                  onChange={(dates) => {
                    if (dates && dates[0]) {
                      const date = new Date(dates[0]);
                      const formattedDate = dayjs(date)
                        .format('YYYY-MM-DDTHH:mm:ssZ')
                        .split('T')[0];
                      setDueDate(formattedDate);
                    } else {
                      setDueDate('');
                    }
                  }}
                  options={{
                    minDate: 'today',
                  }}
                  disabled={!startDate}
                />
              </div>
              <div className="col-span-1 w-full">
                <input
                  type="time"
                  className={cn(
                    `form-input w-full rounded-md border px-3 py-2 transition duration-150 ease-in-out`,
                    !startDate
                      ? 'cursor-not-allowed border-gray-200 !bg-neutral-50 !text-gray-400'
                      : 'border-gray-300 bg-white text-black',
                  )}
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  disabled={!startDate}
                />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 items-end gap-8">
              {/* วันที่ปิดรับ */}
              <div className="col-span-1 w-full">
                <WCAInputDateFlat
                  label="วันที่ปิดรับ"
                  required
                  value={closedDate}
                  onChange={(dates) => {
                    if (dates && dates[0]) {
                      const date = new Date(dates[0]);
                      const formattedDate = dayjs(date)
                        .format('YYYY-MM-DDTHH:mm:ssZ')
                        .split('T')[0];
                      setClosedDate(formattedDate);
                    } else {
                      setClosedDate('');
                    }
                  }}
                  options={{
                    minDate: 'today',
                  }}
                  disabled={!dueDate || sameAsDue}
                />
              </div>
              <div className="col-span-1 w-full">
                <input
                  type="time"
                  className={cn`form-input w-full rounded-md border px-3 py-2 transition duration-150 ease-in-out ${!dueDate || sameAsDue
                      ? 'cursor-not-allowed border-gray-200 !bg-neutral-50 !text-gray-400'
                      : 'border-gray-300 bg-white text-black'
                    }`}
                  value={closedTime}
                  onChange={(e) => setClosedTime(e.target.value)}
                  disabled={!dueDate || sameAsDue}
                />
              </div>

              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={sameAsDue}
                  onChange={(e) => setSameAsDue(e.target.checked)}
                />
                <label htmlFor="" className="mt-1">
                  เหมือนวันกำหนดส่ง
                </label>
              </div>
            </div>
          </div>
          <div className="mt-5 bg-white p-5 shadow-sm">
            <h1 className="text-[24px] font-bold">มอบหมายให้</h1>
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  {/* ชั้น select all */}
                  <div className="flex items-center py-4">
                    <CWInputCheckbox
                      type="checkbox"
                      id="select-all"
                      checked={areAllSelected()}
                      onChange={handleSelectAll}
                      className="h-4 w-4"
                      label="ทั้งหมด"
                    />
                  </div>

                  {/* แสดง Year > Class > Study Group */}
                  {yearData
                    .filter((yearItem) => yearItem.class && yearItem.class.length > 0)
                    .map((yearItem) =>
                      yearItem.class.map((classItem) => {
                        // คำนวณจำนวนกลุ่มเรียนที่เลือกและทั้งหมด
                        const selectedGroupsCount = classItem.study_group.filter(
                          (group) => group.selected,
                        ).length;
                        const totalGroupsCount = classItem.study_group.length;

                        return (
                          <div key={`${yearItem.seed_year_id}-${classItem.class_id}`}>
                            <div className="flex items-center justify-between py-3">
                              <div className="flex items-center">
                                {classItem.study_group.length > 0 ? (
                                  <button
                                    onClick={() =>
                                      toggleClassExpand(
                                        yearItem.seed_year_id,
                                        classItem.class_id,
                                      )
                                    }
                                    className="mr-4 w-3 text-center focus:outline-none"
                                  >
                                    {expandedClasses[
                                      `${yearItem.seed_year_id}-${classItem.class_id}`
                                    ] ? (
                                      <IconArrowDown />
                                    ) : (
                                      <IconArrowRight />
                                    )}
                                  </button>
                                ) : (
                                  <div className="mr-4 w-3" />
                                )}

                                <div className="flex items-center">
                                  <CWInputCheckbox
                                    type="checkbox"
                                    id={`class-${yearItem.seed_year_id}-${classItem.class_id}`}
                                    checked={classItem.selected}
                                    onChange={(e) =>
                                      handleClassSelect(
                                        yearItem.seed_year_id,
                                        classItem.class_id,
                                        e,
                                      )
                                    }
                                    className="h-4 w-4"
                                  />
                                  <label
                                    htmlFor={`class-${yearItem.seed_year_id}-${classItem.class_id}`}
                                    className="mb-0 ml-2"
                                  >
                                    {yearItem.seed_year_short_name} /{' '}
                                    {classItem.class_name}
                                  </label>
                                </div>
                              </div>

                              {/* แสดงจำนวนกลุ่มเรียนที่เลือก/ทั้งหมด */}
                              {totalGroupsCount > 0 && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={selectedGroupsCount === totalGroupsCount}
                                    onChange={(e) =>
                                      handleSelectAllGroupsInClass(
                                        yearItem.seed_year_id,
                                        classItem.class_id,
                                        e.target.checked,
                                      )
                                    }
                                    className="form-checkbox mr-2 h-4 w-4"
                                  />
                                  <span className="font-bold">
                                    {selectedGroupsCount}/{totalGroupsCount} กลุ่ม
                                  </span>
                                </div>
                              )}
                            </div>

                            {expandedClasses[
                              `${yearItem.seed_year_id}-${classItem.class_id}`
                            ] && (
                                <div className="ml-10 flex flex-wrap">
                                  {classItem.study_group.map((group) => (
                                    <div className="mr-4" key={group.study_group_id}>
                                      <div className="flex items-center py-4">
                                        <input
                                          type="checkbox"
                                          id={`group-${yearItem.seed_year_id}-${classItem.class_id}-${group.study_group_id}`}
                                          checked={group.selected}
                                          onChange={(e) =>
                                            handleGroupSelect(
                                              yearItem.seed_year_id,
                                              classItem.class_id,
                                              group.study_group_id,
                                              e,
                                            )
                                          }
                                          className="form-checkbox h-4 w-4"
                                        />
                                        <label
                                          htmlFor={`group-${yearItem.seed_year_id}-${classItem.class_id}-${group.study_group_id}`}
                                          className="ml-2"
                                        >
                                          {group.study_group_name}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            <hr />
                          </div>
                        );
                      }),
                    )}
                </>
              )}
            </div>
          </div>

          <SelectLevel
            selectedLesson={selectedLessonID}
            selectedLevels={selectedLevel}
            setSelectedLevels={(levels) => setSelectedLevel(levels)}
          />
        </div>

        <SidePanel
          onClick={handleSaveClick}
          titleName="รหัสการบ้าน"
          isLoading={isSubmitting}
          status={handleStatusChange}
          statusValue={statusValue}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
