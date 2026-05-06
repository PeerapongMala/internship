import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  SubjectLessons,
  LessonStatus,
  BulkEditItem,
  IPagination,
  Lesson,
  Platform,
} from '../local/Type';
import API from '../local/api';
import APIG02D02 from '@domain/g02/g02-d02/local/api';

import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInputSearch from '@component/web/cw-input-search';
import CWTitleGroup from '@component/web/cw-title-group';
import CWButton from '@component/web/cw-button';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';

import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import showMessage from '@global/utils/showMessage';

import {
  IManageYear,
  IPlatform,
  ISubject,
  ISubjectGroup,
} from '@domain/g02/g02-d02/local/type';
import StoreGlobalPersist from '@store/global/persist';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import Tabs from '@component/web/cw-tabs';
import ModalSortBy from '@domain/g02/g02-d04/local/components/modal/ModalSortBy';
import useModal from '@global/utils/useModal';
import { toDateTimeTH } from '@global/utils/date';
import ModalSelectSubject from '../local/components/modal/ModalSelectSubject';
import CWModalCallback from '@domain/g03/g03-d07/local/components/web/modal/ModalCallback';
import CWTitleBack from '@component/web/cw-title-back';
import usePagination from '@global/hooks/usePagination';
import { AxiosError, isAxiosError } from 'axios';
import { TBaseErrorResponse } from '@global/types/api';
import ModalConfirmLessonBulkEdit from './component/web/organism/cw-o-modal-lesson-bulk-edit';
import IconCornerUpLeftAll from '@core/design-system/library/component/icon/IconCornerUpLeftAll';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const [dataList, setDataList] = useState<SubjectLessons[]>([]);
  const [showModalSelectSubject, setShowModalSelectSubject] = useState(false);
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  const subjectID = subjectData?.id;

  const { platformId, yearId, subjectGroupId } = StoreGlobalPersist.StateGet([
    'platformId',
    'yearId',
    'subjectGroupId',
  ]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const modalDownload = useModal();
  const modalArchive = useModal();
  const modalCallback = useModal();

  const [fetching, setFetching] = useState<boolean>(false);

  const [selectedRecords, setSelectedRecords] = useState<SubjectLessons[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [platformList, setPlatformList] = useState<Platform[]>([]);
  const [selectPlatform, setSelectPlatform] = useState<Platform | null>(null);
  const [yearList, setYearList] = useState<IManageYear[]>([]);
  const [selectYear, setSelectYear] = useState<IManageYear>();
  const [selectSubjectGroup, setSelectSubjectGroup] = useState<ISubjectGroup>();
  const [subjectGroupList, setSubjectGroupList] = useState<ISubjectGroup[]>([]);
  const [subjectList, setSubjectList] = useState<ISubject[]>([]);
  const [selectSubjectInModal, setSelectSubjectInModal] = useState<ISubject>();
  const [selectSubject, setSelectSubject] = useState<ISubject>();

  const [openSort, setOpenSort] = useState(false);
  const [levelsListState, setLevelsListState] = useState<any[]>([]);

  const [selectArchive, setSelectArchive] = useState<Lesson>({
    id: 0,
    status: LessonStatus.IN_USE,
    name: '',
  });

  const modalConfirmLessonLevelBulkEdit = useModal();

  const refUpload = useRef<HTMLInputElement>(null);

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const { pagination: paginationSubject, setPagination: setPaginationSubject } =
    usePagination();

  const [filterSearch, setFilterSearch] = useState<{
    search_text: string;
    status: LessonStatus | undefined;
  }>({
    search_text: '',
    status: undefined,
  });

  useEffect(() => {
    fetchLessonList();
    fetchPlatformList();

    if (subjectData) {
      setSelectSubject(subjectData);
    }
  }, [filterSearch]);

  useEffect(() => {
    if (!subjectData) {
      if (selectPlatform?.id) {
        fetchYearList();
      }
    }
  }, [selectPlatform, paginationSubject.page, paginationSubject.limit]);

  useEffect(() => {
    setSelectSubjectGroup(undefined);
    fetchSubjectGroupList();
  }, [selectYear, paginationSubject.page, paginationSubject.limit]);

  useEffect(() => {
    fetchSubjectList();
  }, [
    selectPlatform,
    selectSubjectGroup,
    selectYear,
    paginationSubject.page,
    paginationSubject.limit,
  ]);

  useEffect(() => {
    fetchLessonList();
  }, [filterSearch, selectSubject, pagination.limit, pagination.page]);

  // in modal
  useEffect(() => {
    if (selectPlatform?.id) {
      fetchYearList();
    }
  }, [selectPlatform]);

  useEffect(() => {
    if (selectYear?.id) {
      fetchSubjectGroupList();
    }
  }, [selectYear]);

  // select pagination set 1
  // useEffect(() => {
  //   if (selectSubjectGroup?.id) {
  //     setPaginationSubject((prev) => ({ ...prev, page: 1 }));
  //     fetchSubjectList();
  //   }
  // }, [selectSubjectGroup]);

  const fetchSubjectList = async () => {
    API.Lesson.SubjectList.Get(curriculumData?.id, {
      platform_id: selectPlatform?.id || 0,
      subject_group_id: selectSubjectGroup?.id || 0,
      year_id: selectYear?.id || 0,
      limit: paginationSubject.limit,
      page: paginationSubject.page,
      search_text: '',
    }).then((res) => {
      if (res.status_code === 200) {
        setSubjectList(res.data);
        setPaginationSubject((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      } else if (res.status_code === 401) {
        navigate({ to: '/' });
      }
    });
  };

  // const fetchPlatform = async () => {
  //   APIG02D02.platform.Get(curriculumData.id).then((res) => {
  //     if (res.status_code === 200) {
  //       setPlatformList(res.data);
  //     }
  //   });
  // };

  const fetchLessonList = async () => {
    if (!selectSubject?.id) return;

    setFetching(true);

    let request = { page: pagination.page, limit: pagination.limit };
    API.Lesson.LessonList.Get(selectSubject.id.toString(), {
      ...request,
      search_text: filterSearch.search_text,
      status: filterSearch.status,
    })
      .then((response) => {
        if (response.status_code === 200) {
          setDataList(response.data);
          setPagination((prev) => ({
            ...prev,
            total_count: response._pagination.total_count,
          }));
        } else if (response.status_code === 401) {
          navigate({ to: '/' });
        }
      })
      .catch((error) => {
        showMessage('เกิดข้อผิดพลาด', 'error');
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const fetchPlatformList = async () => {
    API.Lesson.PlatformList.Get(curriculumData?.id, {
      limit: -1,
    }).then((res) => {
      if (res.status_code === 200) {
        setPlatformList(res.data);
        if (res.data.length > 0) {
          setSelectPlatform(res.data[0]);
        } else {
          setSelectPlatform(null);
        }
      }
    });
  };

  const fetchYearList = async () => {
    APIG02D02.manageYear
      .GetAll(selectPlatform?.id as number, {
        limit: 100,
        page: 1,
        search_text: '',
        status: '',
      })
      .then((res) => {
        if (res.status_code === 200) {
          setYearList(res.data);
        }
      });
  };

  const fetchSubjectGroupList = async () => {
    if (selectYear?.id) {
      APIG02D02.subjectGroup
        .GetAll(selectYear.id, {
          limit: 100,
          page: 1,
          search_text: '',
          status: '',
        })
        .then((res) => {
          if (res.status_code === 200) {
            setSubjectGroupList(res.data);
          }
        });
    }
  };

  const confirmArchive = () => {
    modalArchive.close();
    modalCallback.close();
    API.Lesson.LessonUpdate.Patch(selectArchive.id as number, {
      ...selectArchive,
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('อัปเดตสถานะสำเร็จ', 'success');
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error) => showMessage(error.message, 'error'))
      .finally(() => {
        fetchLessonList();
      });
  };

  const handleBulkEdit = (status: LessonStatus) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    const updatedRecords = selectedRecords.map((record) => ({
      lesson_id: record.id,
      status,
    }));

    API.Lesson.BulkEdit.Post({ bulk_edit_list: updatedRecords as BulkEditItem[] })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('อัปเดตสถานะสำเร็จ');
        } else {
          showMessage('การอัปเดตล้มเหลว', 'error');
        }
        fetchLessonList();
      })
      .catch((error) => {
        showMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', 'error');
      });
  };

  const handleLessonBulkEdit = async (
    password: string,
    lessonIDs: number[],
    status: LessonStatus.USE_ALL,
  ) => {
    try {
      await API.Lesson.LessonLevelBulkEdit.Post({
        password: password,
        bulk_edit_list: lessonIDs.map((id) => ({ lesson_id: id, status: status })),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const err = error as AxiosError<TBaseErrorResponse>;

        if (err.response?.status == 403) {
          showMessage('รหัสผ่านไม่ถูกต้อง', 'error');
          throw error;
        }

        showMessage(err.response?.data.message, 'error');
        throw error;
      }

      throw error;
    }

    setSelectedRecords([]);
    showMessage('อัปเดทด่านทั้งหมดสำเร็จ');
  };

  const onConfirmDownload = () => {
    API.Lesson.DownloadCSV.Get({
      curriculum_group_id: curriculumData.id,
      start_date: startDate,
      end_date: endDate,
      subject_id: selectSubject?.id,
    }).then((res) => {
      modalDownload.close();
      fetchLessonList();
    });
  };

  useEffect(() => {
    const sortedData = [...dataList].sort((a, b) => a.index - b.index);

    setLevelsListState(
      sortedData.map((record, index) => ({
        id: record.id,
        label: `ID : ${record.id} / ${record.name}`,
        name: record.name,
        index: record.index,
        disabledUp: index === 0,
        disabledDown: index === sortedData.length - 1,
      })),
    );
  }, [dataList]);

  const swapIndex = (currentIndex: number, direction: 'up' | 'down') => {
    setLevelsListState((prev) => {
      const newList = [...prev];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= newList.length) return prev;

      const movedItem = newList[currentIndex];
      newList[currentIndex] = newList[targetIndex];
      newList[targetIndex] = movedItem;

      return newList.map((item, index) => ({
        ...item,
        index: index + 1,
        label: `ID : ${item.id} / ${item.name}`,
      }));
    });
  };

  const submitSort = async () => {
    const newLevelsList = {
      lessons: levelsListState
        .map(({ id, index }) => ({ [id]: index }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
    try {
      const res = await API.Lesson.SortLesson.Patch(
        Number(selectSubject?.id),
        newLevelsList,
      );
      if (res.status_code === 200) {
        showMessage('เรียงลำดับสำเร็จ', 'success');
        fetchLessonList();
        setOpenSort(false);
      } else {
        showMessage(res.message, 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการเรียงลำดับ', 'error');
    }
  };

  const rowColumns = useMemo<DataTableColumn<SubjectLessons>[]>(() => {
    const finalDefs: DataTableColumn<SubjectLessons>[] = [
      {
        accessor: 'id',
        title: '#ID',
      },
      {
        accessor: 'index',
        title: 'บทที่',
      },
      {
        accessor: 'name',
        title: 'ชื่อบทเรียนหลัก',
      },
      {
        accessor: 'rewarded_stage_count',
        title: 'ด่านที่มีรางวัลพิเศษ',
        textAlign: 'center',
        render: ({ rewarded_stage_count }) => (
          <div className="flex justify-center">
            <p>{rewarded_stage_count ?? '-'}</p>
          </div>
        ),
      },
      {
        accessor: 'updated_at',
        title: 'แก้ไขล่าสุด',
        render: ({ updated_at }) => {
          return updated_at ? toDateTimeTH(updated_at) : '-';
        },
      },
      {
        accessor: 'update_by',
        title: 'แก้ไขล่าสุดโดย',
        render: ({ updated_by }) => {
          return updated_by ?? '-';
        },
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === LessonStatus.IN_USE)
            return <span className="badge badge-outline-success">ใช้งาน</span>;
          else if (status === LessonStatus.DRAFT)
            return <span className="badge badge-outline-dark">แบบร่าง</span>;
          else if (status === LessonStatus.NOT_IN_USE)
            return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
        },
      },
      {
        accessor: 'edit_action',
        title: 'แก้ไข',
        render: (record: any, index: number) => (
          <Link to={`/content-creator/lesson/${record.id}/edit`}>
            <button>
              <IconPen />
            </button>
          </Link>
        ),
      },
      {
        accessor: 'archive_action',
        title: 'จัดเก็บ',
        render: (record: any) => {
          const { status } = record;
          return status === LessonStatus.NOT_IN_USE ? (
            <button
              type="button"
              onClick={() => {
                setSelectArchive({
                  ...record,
                  status: LessonStatus.IN_USE,
                });
                modalArchive.open();
              }}
            >
              <IconCornerUpLeft />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectArchive({
                  ...record,
                  status: LessonStatus.NOT_IN_USE,
                });
                modalArchive.open();
              }}
            >
              <IconArchive />
            </button>
          );
        },
      },
      {
        accessor: 'sublesson_action',
        title: 'บทเรียนย่อย',
        textAlign: 'center',
        render: (record: any, index: number) => (
          <div className="flex items-center justify-center">
            <Link to={`/content-creator/sublesson/${record.id}`} params={record.name}>
              <button>
                <IconSearch />
              </button>
            </Link>
          </div>
        ),
      },
    ];

    return finalDefs;
  }, [filterSearch]);

  const handlePageChange = (newPage: number) => {
    setPaginationSubject((prev) => ({ ...prev, page: newPage }));
  };
  const handlePageSizeChange = (newSize: number) => {
    setPaginationSubject((prev) => ({ ...prev, limit: newSize, page: 1 }));
  };

  return (
    <div className="w-full font-noto-sans-thai">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'จัดการบทเรียน', href: '/content-creator/lesson' },
          { label: 'บทเรียนหลัก', href: '/content-creator/lesson' },
        ]}
      />
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData?.name} (${curriculumData?.short_name})`,
          ...(selectSubject?.id
            ? [
                selectSubject?.seed_year_short_name,
                selectSubject?.seed_subject_group_name,
                `${selectSubject?.name}`,
              ]
            : [curriculumData?.short_name]),
        ]}
        className="mt-5"
        // buttonSpecial={!subjectData === false}
        // titleButton={'เลือกวิชา'}
        // onClickButton={() => {
        //   setShowModalSelectSubject(true);

        //   // StoreGlobalPersist.MethodGet().setSubjectData(selectSubjectInModal);
        // }}
        // iconButton={<IconPlus />}
      />
      <div className="w-full">
        <div className="my-5">
          <div className="flex w-full justify-between">
            <h1 className="text-[26px] font-bold">จัดการบทเรียนหลัก</h1>

            {!subjectData === false && (
              <CWButton
                icon={<IconPlus />}
                title="เลือกวิชา"
                className="flex-grow-0"
                onClick={() => {
                  setShowModalSelectSubject(true);
                }}
              />
            )}
          </div>

          <p className={subjectData ? '' : 'mt-3'}>
            ออกแบบโครงสร้างบทเรียนแต่ละวิชา และจัดกลุ่มบทเรียนย่อยด้วยบทเรียนหลัก
            คุณสามารถตั้งค่าวิชาก่อนสร้างบทเรียนได้ที่เมนู
            <Link to={'/content-creator/course'} className="text-primary underline">
              หลักสูตร
            </Link>
          </p>
        </div>
        <ModalSelectSubject
          title="เลือกวิชา"
          onOk={() => {
            setShowModalSelectSubject(false);
            setSelectSubject(selectSubjectInModal);
            StoreGlobalPersist.MethodGet().setSubjectData(selectSubjectInModal);
          }}
          size="large"
          buttonName="เลือก"
          disableOk={!selectSubjectInModal?.id}
          cancelButtonName="ย้อนกลับ"
          onClose={() => {
            setShowModalSelectSubject(false);
            setSelectPlatform(null);
            setSelectYear(undefined);
            setSelectSubjectGroup(undefined);
          }}
          open={showModalSelectSubject}
          platformList={platformList}
          yearList={yearList}
          subjectGroupList={subjectGroupList}
          subjectList={subjectList}
          selectPlatform={selectPlatform}
          selectYear={selectYear}
          selectSubjectGroup={selectSubjectGroup}
          selectSubjectInModal={selectSubjectInModal}
          setSelectPlatform={setSelectPlatform}
          setSelectYear={setSelectYear}
          setSelectSubjectGroup={setSelectSubjectGroup}
          setSelectSubjectInModal={setSelectSubjectInModal}
          paginationSubject={paginationSubject}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
        <CWWhiteBox className="mt-8">
          {selectSubject ? (
            <div>
              <div className="flex w-full flex-col justify-between lg:flex-row">
                <div className="flex flex-col items-center gap-3 lg:flex-row">
                  <div className="dropdown">
                    <Dropdown
                      placement={'bottom-start'}
                      btnClassName="btn btn-primary dropdown-toggle gap-1"
                      button={
                        <>
                          Bulk Edit
                          <IconCaretDown />
                        </>
                      }
                      disabled={selectedRecords.length === 0}
                    >
                      <ul className="!min-w-[180px] space-y-1">
                        <li>
                          <button
                            type="button"
                            className="w-full"
                            onClick={() => handleBulkEdit(LessonStatus.NOT_IN_USE)}
                          >
                            <div className="flex w-full items-center justify-start gap-2">
                              <IconArchive className="h-5 w-5" />
                              <span>จัดเก็บ</span>
                            </div>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="w-full"
                            onClick={() => handleBulkEdit(LessonStatus.IN_USE)}
                          >
                            <div className="flex w-full items-center justify-start gap-2">
                              <IconCornerUpLeft className="h-5 w-5" />
                              <span>เปิดใช้งาน</span>
                            </div>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="w-full"
                            onClick={() => {
                              modalConfirmLessonLevelBulkEdit.open();
                            }}
                          >
                            <div className="flex w-full items-center justify-start gap-2">
                              <IconCornerUpLeftAll className="h-5 w-5" />
                              <span>เปิดใช้งานด่านทั้งหมด</span>
                            </div>
                          </button>
                        </li>
                      </ul>
                    </Dropdown>
                  </div>

                  <Link
                    to={`/content-creator/lesson/create/$subjectID`}
                    params={{ subjectID: subjectID }}
                  >
                    <CWButton
                      variant="primary"
                      title="เพิ่มบทเรียนหลัก"
                      icon={<IconPlus />}
                    />
                  </Link>

                  <CWButton
                    variant="primary"
                    icon={<IconPlus />}
                    title="เรียงลำดับ"
                    onClick={() => {
                      setOpenSort(true);
                    }}
                  />
                  <ModalSortBy
                    open={openSort}
                    onClose={() => setOpenSort(false)}
                    onOk={submitSort}
                    data={levelsListState}
                    setData={setLevelsListState}
                    enbledAddQuestion={false}
                    prefix="บทที่ "
                    title="เรียงลำดับ"
                    swapIndex={swapIndex}
                  />
                  <span className="hidden h-full w-[2px] bg-neutral-300 xl:block" />
                  <CWInputSearch
                    onClick={fetchLessonList}
                    placeholder="ค้นหา"
                    value={filterSearch.search_text}
                    onChange={(e) =>
                      setFilterSearch((prev) => ({
                        ...prev,
                        search_text: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mt-3 flex justify-center gap-3 lg:mt-0">
                  <CWButton
                    title="Download"
                    variant="primary"
                    onClick={modalDownload.open}
                    icon={<IconDownload />}
                  />
                  <CWModalDownload
                    datetimeFormat={true}
                    startDate={startDate}
                    endDate={endDate}
                    onDownload={onConfirmDownload}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    open={modalDownload.isOpen}
                    onClose={modalDownload.close}
                  />
                  <CWButton
                    title="Upload"
                    variant="primary"
                    onClick={() => refUpload.current?.click()}
                    icon={<IconUpload />}
                  />

                  <input
                    ref={refUpload}
                    value={''}
                    accept=".csv"
                    onChange={(e) => {
                      API.Lesson.UploadCSV.Post(
                        e.target.files![0],
                        curriculumData.id,
                      ).then((res) => {
                        if (res.status_code === 200 || res.status_code === 201) {
                          showMessage('อัพโหลดสําเร็จ');
                          fetchLessonList();
                        } else {
                          showMessage(res.message, 'error');
                        }
                      });
                    }}
                    className="hidden"
                    type="file"
                  />
                </div>
              </div>

              <div className="mt-5 w-full">
                <div className="flex w-full border-b-[1px]">
                  <Tabs
                    currentTab={filterSearch.status}
                    setCurrentTab={(value) => {
                      setFilterSearch((prev) => ({
                        ...prev,
                        status: value as LessonStatus | undefined,
                      }));
                    }}
                    tabs={[
                      { label: 'ทั้งหมด', value: undefined },
                      { label: 'แบบร่าง', value: LessonStatus.DRAFT },
                      { label: 'ใช้งาน', value: LessonStatus.IN_USE },
                      { label: 'ไม่ใช้งาน', value: LessonStatus.NOT_IN_USE },
                    ]}
                  />
                </div>
                <div className="mt-5 w-full">
                  <div className="datatables">
                    <DataTable
                      idAccessor={'id'}
                      fetching={fetching}
                      className="table-hover whitespace-nowrap"
                      records={dataList}
                      columns={rowColumns}
                      selectedRecords={selectedRecords}
                      onSelectedRecordsChange={setSelectedRecords}
                      highlightOnHover
                      withTableBorder
                      withColumnBorders
                      height={'calc(100vh - 300px)'}
                      noRecordsText="ไม่พบข้อมูล"
                      totalRecords={pagination.total_count}
                      recordsPerPage={pagination.limit}
                      page={pagination.page}
                      onPageChange={(page) => {
                        setPagination((prev) => ({
                          ...prev,
                          page,
                        }));
                      }}
                      onRecordsPerPageChange={(limit: number) => {
                        setPagination((prev) => ({
                          ...prev,
                          limit,
                          page: 1,
                        }));
                      }}
                      recordsPerPageOptions={pageSizeOptions}
                      paginationText={({ from, to, totalRecords }) =>
                        `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[200px] w-full items-center justify-center">
              {/* <h1 className="text-xl font-bold">กรุณาเลือกวิชา</h1> */}
              <CWButton
                icon={<IconPlus />}
                title="เลือกวิชา"
                onClick={() => {
                  setShowModalSelectSubject(true);
                  setSelectSubjectInModal(undefined);
                }}
              />
            </div>
          )}
        </CWWhiteBox>
      </div>

      <CWModalArchive
        open={modalArchive.isOpen}
        onOk={confirmArchive}
        onClose={() => {
          modalArchive.close();
        }}
      />
      <CWModalCallback
        open={modalCallback.isOpen}
        onOk={confirmArchive}
        onClose={() => {
          modalCallback.close();
        }}
      />

      <ModalConfirmLessonBulkEdit
        isOpen={modalConfirmLessonLevelBulkEdit.isOpen}
        onOk={(password) => {
          handleLessonBulkEdit(
            password,
            selectedRecords.map((record) => Number(record.id)),
            LessonStatus.USE_ALL,
          );
          modalConfirmLessonLevelBulkEdit.close();
        }}
        onClose={() => {
          setSelectedRecords([]);
          modalConfirmLessonLevelBulkEdit.close();
        }}
        selectedRecord={selectedRecords.length}
      />
    </div>
  );
};

export default DomainJSX;
