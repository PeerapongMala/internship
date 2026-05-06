import { useCallback, useEffect, useState } from 'react';
import { DataTableColumn, DataTable } from 'mantine-datatable';
import { useParams } from '@tanstack/react-router';

import API from '@domain/g03/g03-d03/local/api';
import showMessage from '@global/utils/showMessage';
import CWInputSearch from '@component/web/cw-input-search';
import {
  StudentGroupResearchQueryParams,
  DDRScoreResultResponse,
  LessonResponse,
  SubLessonResponse,
  LevelResponse,
  DDRSummaryResultResponse,
} from '@domain/g03/g03-d03/local/api/group/student-group-research/type';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWButton from '@component/web/cw-button';
import downloadCSV from '@global/utils/downloadCSV';
import CWSelect from '@component/web/cw-select';
import CWMTabs from '@component/web/molecule/cw-n-tabs';

const CwDifficulty = () => {
  const { studentGroupId } = useParams({ strict: false });
  const [filters, setFilters] = useState<Partial<StudentGroupResearchQueryParams>>({
    search: undefined,
    lesson_id: undefined,
    sub_lesson_id: undefined,
    level_id: undefined,
  });
  const [open, setOpen] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recordsSubTab1, setRecordsSubTab1] = useState<DDRScoreResultResponse[]>([]);
  const [recordsSubTab2, setRecordsSubTab2] = useState<DDRSummaryResultResponse[]>([]);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [lessonDropdown, setLessonDropdown] = useState<LessonResponse[]>([]);
  const [subLessonDropdown, setSubLessonDropdown] = useState<SubLessonResponse[]>([]);
  const [levelDropdown, setLevelDropdown] = useState<LevelResponse[]>([]);
  const [subTabResearch, setSubTabResearch] = useState<string>('0');

  const tabsList = [
    {
      key: '0',
      label: 'ตารางคะแนน',
    },
    {
      key: '1',
      label: 'ตารางสรุป',
    },
  ];

  useEffect(() => {
    API.studentGroupResearch.GetLessonParams(+studentGroupId).then((res) => {
      if (res.status_code == 200) {
        let data: LessonResponse[] = res.data;
        setLessonDropdown(data);
      }
    });
  }, []);

  useEffect(() => {
    if (filters?.lesson_id) {
      API.studentGroupResearch
        .GetSubLessonParams(+studentGroupId, filters?.lesson_id)
        .then((res) => {
          if (res.status_code == 200) {
            let data: SubLessonResponse[] = res.data;
            setSubLessonDropdown(data);
          }
        });
    }
  }, [filters?.lesson_id, studentGroupId]);

  useEffect(() => {
    if (filters?.lesson_id && filters.sub_lesson_id) {
      API.studentGroupResearch
        .GetLevelParams(+studentGroupId, filters.sub_lesson_id)
        .then((res) => {
          if (res.status_code == 200) {
            let data: LevelResponse[] = res.data;
            setLevelDropdown(data);
          }
        });
    }
  }, [filters?.lesson_id, filters.sub_lesson_id, studentGroupId]);

  const fetchRecords = () => {
    setFetching(true);
    if (subTabResearch === '0') {
      API.studentGroupResearch
        .GetDDRScoreResult(+studentGroupId, {
          search: filters.search,
          level_id: filters.level_id,
        })
        .then((res) => {
          if (res.status_code === 200) {
            setRecordsSubTab1(res.data);
          }
        })
        .finally(() => {
          setTimeout(() => {
            setFetching(false);
          }, 200);
        });
    } else {
      API.studentGroupResearch
        .GetDDRSummaryResult(+studentGroupId, {
          level_id: filters.level_id,
        })
        .then((res) => {
          if (res.status_code === 200) {
            const data = res.data;

            if (data) {
              const dataArray = Array.isArray(data) ? data : [data];
              setRecordsSubTab2(dataArray);
            } else {
              setRecordsSubTab2([]);
            }
          }
        })
        .finally(() => {
          setTimeout(() => {
            setFetching(false);
          }, 200);
        });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filters, studentGroupId, subTabResearch]);

  const onClickSearch = useCallback(() => {
    fetchRecords();
  }, [filters, studentGroupId, subTabResearch]);

  // Modal Download
  const onClose = () => {
    setOpen('');
  };

  const handleDownload = () => {
    if (subTabResearch === '0') {
      API.studentGroupResearch
        .GetDDRScoreResultCsv(+studentGroupId, {
          search: filters.search,
          level_id: filters.level_id,
        })
        .then((res) => {
          if (res instanceof Blob) {
            downloadCSV(res, 'student-group-research-score-result.csv');
          } else {
            showMessage(res.message, 'error');
          }
          setOpen('');
        });
    } else {
      API.studentGroupResearch
        .GetDDRSummaryResultCsv(+studentGroupId, { level_id: filters.level_id })
        .then((res) => {
          if (res instanceof Blob) {
            downloadCSV(res, 'student-group-research-summary-result.csv');
          } else {
            showMessage(res.message, 'error');
          }
          setOpen('');
        });
    }
  };

  const getUniqueQuestionIndices = (data: DDRScoreResultResponse[]): number[] => {
    if (!data || data.length === 0 || !data[0].question_data) {
      return [];
    }

    // รวม question_index จากทุกนักเรียน
    const allQuestionIndices: number[] = [];
    data.forEach((student) => {
      if (student.question_data) {
        student.question_data.forEach((q) => {
          allQuestionIndices.push(q.question_index);
        });
      }
    });

    // ใช้ Set เพื่อกรองเฉพาะค่าที่ไม่ซ้ำกัน
    return Array.from(new Set(allQuestionIndices)).sort((a, b) => a - b);
  };

  const rowColumnsSubTab0: DataTableColumn<DDRScoreResultResponse>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_: DDRScoreResultResponse, index: number) => index + 1,
    },
    {
      title: 'รหัสนักเรียน',
      accessor: 'student_id',
      width: 200,
      render: (item: DDRScoreResultResponse) => {
        return item.student_id || '-';
      },
    },
    {
      title: 'คำนำหน้า',
      accessor: 'prefix',
      render: (item: DDRScoreResultResponse) => {
        return item.student_title || '-';
      },
    },
    {
      title: 'ชื่อ',
      accessor: 'firstname',
      width: 200,
      render: (item: DDRScoreResultResponse) => {
        return item.student_first_name || '-';
      },
    },
    {
      title: 'นามสกุล',
      accessor: 'lastname',
      width: 200,
      render: (item: DDRScoreResultResponse) => {
        return item.student_last_name || '-';
      },
    },

    // สร้าง columns สำหรับแต่ละ question ที่พบในข้อมูล
    ...getUniqueQuestionIndices(recordsSubTab1).map((questionIndex) => ({
      title: `${questionIndex}`,
      accessor: `q${questionIndex}` as keyof DDRScoreResultResponse,
      render: (item: DDRScoreResultResponse) => {
        // หา score ของ question ที่มี question_index ตรงกับ questionIndex
        const questionData = item.question_data?.find(
          (q) => q.question_index === questionIndex,
        );
        return questionData?.score !== undefined ? questionData.score.toString() : '-';
      },
    })),
    {
      title: 'sum',
      accessor: '', //'sum' as keyof DifficultyDiscriminationReliabilityResponse,
      render: (item: DDRScoreResultResponse, index: number) => {
        return item.score_sum.toString() ? item.score_sum.toString() : '-';
      },
    },
  ];

  // ฟังก์ชันสำหรับแปลผลค่าความยาก (p) เป็นข้อความ
  const getDifficultyInterpretation = (score: number): string => {
    if (score >= 0 && score <= 0.19) return 'ข้อสอบข้อนั้นยากเกินไป 0.00 - 0.19';
    if (score >= 0.2 && score <= 0.39) return 'ข้อสอบข้อนั้นค่อนข้างยาก 0.20 - 0.39';
    if (score >= 0.4 && score <= 0.59) return 'ข้อสอบข้อนั้นยากง่ายปานกลาง 0.40 - 0.59';
    if (score >= 0.6 && score <= 0.79) return 'ข้อสอบข้อนั้นค่อนข้างง่าย 0.60 - 0.79';
    if (score >= 0.8 && score <= 1.0) return 'ข้อสอบข้อนั้นง่ายเกินไป 0.80 - 1.00';
    return 'ไม่สามารถแปลผลได้';
  };

  const getUniqueQuestionIndicesSummary = (
    data: DDRSummaryResultResponse[],
  ): number[] => {
    if (
      !data ||
      data.length === 0 ||
      !data[0] ||
      !data[0].sum_stat ||
      !data[0].sum_stat.question_data
    ) {
      return []; // ส่งคืนอาร์เรย์ว่างถ้าไม่มีข้อมูล
    }

    // ใช้ sum_stat.question_data เพื่อดึง question_index
    return Array.from(
      new Set(data[0].sum_stat.question_data.map((q) => q.question_index)),
    ).sort((a, b) => a - b);
  };

  // 3. สร้าง rowColumnsSubTab1 ใหม่
  const rowColumnsSubTab1: DataTableColumn<DDRSummaryResultResponse>[] = [
    {
      title: '',
      accessor: 'index',
      width: 200,
      render: (_item: DDRSummaryResultResponse, index: number) => {
        switch (index) {
          case 0:
            return 'ผลรวมคำตอบ (∑)';
          case 1:
            return 'กลุ่มเก่งตอบถูก (H)';
          case 2:
            return 'กลุ่มอ่อนตอบถูก (L)';
          case 3:
            return 'ค่าความยาก (P)';
          case 4:
            return '';
          case 5:
            return 'ค่าอำนาจจำแนก (B-index)';
          default:
            return '';
        }
      },
    },
    ...(recordsSubTab2.length > 0
      ? getUniqueQuestionIndicesSummary(recordsSubTab2).map((questionIndex) => ({
          title: `${questionIndex}`,
          accessor: `q${questionIndex}` as keyof DDRSummaryResultResponse,
          render: (item: DDRSummaryResultResponse, rowIndex: number) => {
            if (!item) return '-'; // ป้องกันกรณี item เป็น undefined

            switch (rowIndex) {
              case 0: // ผลรวมคำตอบ
                const sumScore = item.sum_stat?.question_data?.find(
                  (q) => q.question_index === questionIndex,
                )?.score;
                return sumScore !== undefined ? sumScore.toString() : '-';

              case 1: // กลุ่มเก่งตอบถูก
                const hiScore = item.hi_rank_correct_answer?.find(
                  (q) => q.question_index === questionIndex,
                )?.score;
                return hiScore !== undefined ? hiScore.toString() : '-';

              case 2: // กลุ่มอ่อนตอบถูก
                const lowScore = item.low_rank_correct_answer?.find(
                  (q) => q.question_index === questionIndex,
                )?.score;
                return lowScore !== undefined ? lowScore.toString() : '-';

              case 3: // ค่าความยาก (P)
                const difficultyScore = item.difficulty?.find(
                  (q) => q.question_index === questionIndex,
                )?.score;
                return difficultyScore !== undefined ? difficultyScore.toString() : 'NaN';

              case 4: // การแปลความหมายค่าความยาก
                const pValue = item.difficulty?.find(
                  (q) => q.question_index === questionIndex,
                )?.score;

                if (pValue !== undefined) {
                  return getDifficultyInterpretation(pValue);
                }
                return '-';

              case 5: // ค่าอำนาจจำแนก (B-index)
                const bIndexScore = item.b_index?.find(
                  (q) => q.question_index === questionIndex,
                )?.score;
                return bIndexScore !== undefined ? bIndexScore.toString() : 'NaN';

              default:
                return '-';
            }
          },
        }))
      : []),
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-[10px] rounded-[10px] p-[10px]">
        <div className="mb-3 flex justify-between">
          <div className="w-fit">
            <CWInputSearch
              placeholder="ค้นหา"
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, search: e.target.value }));
              }}
              value={filters.search}
              onClick={() => {
                onClickSearch();
              }}
            />
          </div>
          <div className="flex">
            <CWButton
              title="Download"
              icon={<IconDownload />}
              onClick={() => setOpen('download')}
            />
          </div>
        </div>
        <div className="mb-3 flex gap-2">
          <CWSelect
            title={'บทเรียน'}
            options={lessonDropdown.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            value={filters.lesson_id}
            className={`min-w-48`}
            onChange={(e) => {
              setFilters({ ...filters, lesson_id: e.target.value });
            }}
          />
          <CWSelect
            title={'บทเรียนย่อย'}
            options={subLessonDropdown.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            value={filters.sub_lesson_id}
            className={`min-w-48`}
            onChange={(e) => {
              setFilters({ ...filters, sub_lesson_id: e.target.value });
            }}
          />
          <CWSelect
            title={'ด่าน'}
            options={levelDropdown.map((item) => ({
              label: item.level_type,
              value: item.id,
            }))}
            value={filters.level_id}
            className={`min-w-48`}
            onChange={(e) => {
              setFilters({ ...filters, level_id: e.target.value });
            }}
          />
        </div>
        <CWMTabs
          items={tabsList.map((t) => t.label)}
          currentIndex={tabsList.findIndex((tab) => tab.key === subTabResearch)}
          onClick={(index) => {
            setSubTabResearch(tabsList[index].key);
            setFetching(true);
            setTimeout(() => {
              setFetching(false);
            }, 200);
          }}
        />
        <div className="datatables">
          {!filters.level_id ? (
            <div className="flex h-[200px] w-full items-center justify-center text-center font-semibold text-red-500">
              กรุณาเลือกด่าน
            </div>
          ) : subTabResearch === '0' ? (
            <DataTable
              className="z-0"
              columns={rowColumnsSubTab0}
              records={recordsSubTab1}
              styles={{
                root: { minHeight: '300px' },
              }}
              fetching={isFetching}
              highlightOnHover
              withTableBorder
              withColumnBorders
              loaderType="oval"
              loaderBackgroundBlur={4}
            />
          ) : (
            <DataTable
              className="z-0"
              columns={rowColumnsSubTab1}
              records={recordsSubTab2.length > 0 ? Array(6).fill(recordsSubTab2[0]) : []}
              styles={{
                root: { minHeight: '300px' },
              }}
              fetching={isFetching}
              highlightOnHover
              withTableBorder
              withColumnBorders
              loaderType="oval"
              loaderBackgroundBlur={4}
            />
          )}
        </div>
      </div>
      <CWModalDownload
        open={open === 'download'}
        onClose={onClose}
        onDownload={handleDownload}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </div>
  );
};

export default CwDifficulty;
