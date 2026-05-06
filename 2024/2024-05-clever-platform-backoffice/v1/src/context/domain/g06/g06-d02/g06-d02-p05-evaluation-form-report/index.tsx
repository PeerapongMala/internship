import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import LayoutEvaluationForm from '../../local/components/web/template/cw-t-layout-evaluation';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  TEvaluationForm,
  TEvaluationFormFilledFilter,
  TEvaluationSheet,
} from '../local/types/grade';
import API from '../local/api';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import showMessage from '@global/utils/showMessage';
import CWWhiteBox from '@component/web/cw-white-box';
import FilledEvaluationFormTable from './components/web/organism/cw-o-table-filled-evaluation-form';
import { EEvaluationSheetStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import CWSelect from '@component/web/cw-select';
import { EGradeTemplateType } from '@domain/g06/local/enums/evaluation';
import { TGetListEvaluationSheetReq } from '../local/api/helper/grade';
import { TBaseErrorResponse, TBasePaginationResponse } from '../local/types';
import G06D06Breadcrum from '@domain/g06/g06-d06/g06-d06-p01-student-records/component/web/organism/Breadcrumb';
import { getUserData } from '@global/utils/store/getUserData';
import config from '@core/config';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const navigate = useNavigate();
  const params = useParams({
    from: '/grade-system/evaluation/report/$evaluation_form_id',
  });
  const evaluationFormID = Number(params.evaluation_form_id);

  const userData = getUserData();

  const [evaluationSheets, setEvaluationSheets] = useState<TEvaluationSheet[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);

    fetchEvaluationForm(evaluationFormID);
  }, []);

  const [evaluationForm, setEvaluationForm] = useState<TEvaluationForm>();

  const fetchEvaluationForm = async (evaluationFormID: number) => {
    const response = await API.Grade.GetEvaluationFormByID(
      evaluationFormID,
      onFetchEvaluationFormError,
    );

    setEvaluationForm(response.data.data);
  };
  const onFetchEvaluationFormError = (err: AxiosError) => {
    if (err.response?.status === 404) {
      navigate({ to: '../..' });
      showMessage('ไม่พบใบประเมิน', 'warning');
      return;
    }
    showMessage('พบปัญหาในการเรียกข้อมูลกับเซิร์ฟเวอร์', 'error');
  };

  const [searchFilter, setSearchFilter] = useState<TEvaluationFormFilledFilter>({
    filterSearchSelect: undefined,
    pagination: {
      page: 1,
      limit: config.pagination.itemsPerPage,
      total_count: 0,
    },
    status: undefined
  });
  const handleChangeStatus = (status?: EEvaluationSheetStatus) => {
    setSearchFilter((prev) => ({
      ...prev, status: status,
      pagination: { ...prev.pagination, page: 1 }
    }));
  };
  useEffect(() => {
    const apiParams: TGetListEvaluationSheetReq = {
      form_id: evaluationFormID,
      page: searchFilter.pagination?.page,
      limit: searchFilter.pagination?.limit,
      status: searchFilter.status,
      school_id: Number(userData.school_id),
    };

    if (searchFilter.filterSearchSelect?.type === 'only_subject') {
      apiParams.only_subject = true;
    } else if (searchFilter.filterSearchSelect?.type === 'general_type') {
      apiParams.general_type = searchFilter.filterSearchSelect.value;
    }

    fetchEvaluationSheets(apiParams);
  }, [
    evaluationFormID,
    searchFilter.status,
    searchFilter.pagination?.limit,
    searchFilter.pagination?.page,
    searchFilter.filterSearchSelect
  ]);

  const fetchEvaluationSheets = async (req: TGetListEvaluationSheetReq) => {
    let response: AxiosResponse<TBasePaginationResponse<TEvaluationSheet>>;
    setFetching(true);
    try {
      response = await API.Grade.GetListEvaluationSheet(req);
    } catch (error) {
      onErrorFetchEvaluationSheets(error);
      throw error;
    } finally {
      setFetching(false);
    }
    setEvaluationSheets(response.data.data);
    setSearchFilter((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        total_count: response.data._pagination.total_count,
      },
    }));
  };
  const onErrorFetchEvaluationSheets = (error: unknown) => {
    if (!isAxiosError(error)) {
      showMessage((error as Error).message, 'error');
      throw error;
    }
    const err = error as AxiosError<TBaseErrorResponse>;
    if (err.response?.status && err.response.status >= 400 && err.response.status < 500) {
      showMessage(err.response.data.message, 'warning');
      throw error;
    }

    showMessage(err.message, 'error');
  };

  return (
    <LayoutEvaluationForm
      subPageTitle={`ใบเกรด ${[evaluationForm?.year, evaluationForm?.academic_year, `${evaluationForm?.year}/${evaluationForm?.school_room}`].join(' / ')}`}
      breadCrumbs={[{ label: 'รายงานใบประเมิน' }]}
    >
      <G06D06Breadcrum
        evaluationFormID={evaluationFormID}
        evaluationForm={evaluationForm}
      />

      <CWWhiteBox className="flex flex-col gap-5">
        <CWSelect
          className="w-full max-w-[250px]"
          title='หัวข้อใบประเมินทั้งหมด'
          value={
            searchFilter.filterSearchSelect?.type === 'general_type'
              ? searchFilter.filterSearchSelect.value
              : searchFilter.filterSearchSelect?.type === 'only_subject'
                ? 'only_subject'
                : ''
          }
          options={[
            { label: 'คะแนนรายวิชา', value: 'only_subject' },
            { label: 'เวลาเรียน', value: EGradeTemplateType.STUDY_TIME },
            { label: 'คุณลักษณะอันพึงประสงค์', value: EGradeTemplateType.DESIRED_TRAITS },
            { label: 'สมรรถนะ', value: EGradeTemplateType.COMPETENCY },
            {
              label: 'กิจกรรมพัฒนาผู้เรียน',
              value: EGradeTemplateType.STUDENT_DEVELOPMENT,
            },
            { label: 'ภาวะโภชนาการ', value: EGradeTemplateType.NUTRITIONAL_STATUS },
          ]}
          onChange={(e) => {
            const selectedValue = e.target.value;
            let newFilter: TEvaluationFormFilledFilter['filterSearchSelect'];

            if (selectedValue === 'only_subject') {
              newFilter = { type: 'only_subject' };
            } else if (selectedValue) {
              newFilter = {
                type: 'general_type',
                value: selectedValue as EGradeTemplateType
              };
            } else {
              newFilter = undefined;
            }

            setSearchFilter(prev => ({
              ...prev,
              filterSearchSelect: newFilter,
              pagination: { ...prev.pagination, page: 1 }
            }));
          }}
        />

        <CWSwitchTabs
          tabs={[
            { id: '1', label: 'ทั้งหมด', onClick: () => handleChangeStatus() },
            {
              id: '2',
              label: 'แบบร่าง',
              onClick: () => handleChangeStatus(EEvaluationSheetStatus.DRAFT),
            },
            {
              id: '3',
              label: 'ใช้งาน',
              onClick: () => handleChangeStatus(EEvaluationSheetStatus.ENABLED),
            },
            {
              id: '4',
              label: 'ไม่ใช้งาน',
              onClick: () => handleChangeStatus(EEvaluationSheetStatus.DISABLED),
            },
            {
              id: '5',
              label: 'ส่งข้อมูลแล้ว',
              onClick: () => handleChangeStatus(EEvaluationSheetStatus.SENT),
            },
            {
              id: '6',
              label: 'ออกรายงานแล้ว',
              onClick: () => handleChangeStatus(EEvaluationSheetStatus.APPROVE),
            },
          ]}
        />
        <FilledEvaluationFormTable
          fetching={fetching}
          evaluationSheets={evaluationSheets}
          pagination={searchFilter.pagination}
          searchFilter={searchFilter}
          evaluationFormID={evaluationFormID}
          onPaginationChange={(pagination) =>
            setSearchFilter((prev) => ({
              ...prev,
              pagination: pagination,
            }))
          }
          handleRefetch={() =>
            fetchEvaluationSheets({
              form_id: evaluationFormID,
              page: searchFilter.pagination?.page,
              limit: searchFilter.pagination?.limit,
              status: searchFilter.status,
              school_id: Number(userData.school_id),
            })
          }
        />
      </CWWhiteBox>
    </LayoutEvaluationForm>
  );
};

export default DomainJSX;
