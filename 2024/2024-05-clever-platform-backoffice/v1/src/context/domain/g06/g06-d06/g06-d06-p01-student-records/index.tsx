import { useEffect, useState } from 'react';
import StudentTable from './component/web/organism/StudentTable';
import Breadcrumb from './component/web/organism/Breadcrumb';
import { api } from '../local/api';
import { Pagination, StudentDto } from '../local/type';
import { usePagination as useMantinePagination } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import ModalCreateForm from '../local/component/web/shared/ModalCreateForm';
import { useParams } from '@tanstack/react-router';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import LayoutEvaluationForm from '@domain/g06/local/components/web/template/cw-t-layout-evaluation';
import API from '@domain/g06/g06-d02/local/api';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const form = useForm<{ search: string }>();
  const [modal, setModal] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<StudentDto[]>([]);
  const { pagination, setPagination } = usePagination();
  const params = useParams({
    strict: false,
  });
  const evaluationFormID = Number(params.evaluationFormId);
  const controlledPagination = useMantinePagination({
    total: pagination.total_count,
    page: pagination.page,
    onChange: (page) => setPagination({ ...pagination, page }),
  });

  const [evaluationForm, setEvaluationForm] = useState<TEvaluationForm>();

  useEffect(() => {
    fetchEvaluationForm(evaluationFormID);
  }, []);

  const fetchEvaluationForm = async (evaluationFormID: number) => {
    const response = await API.Grade.GetEvaluationFormByID(evaluationFormID);

    setEvaluationForm(response.data.data);
  };

  const refetchStudentList = ({ searchText }: { searchText?: string } = {}) => {
    const extendParams = searchText ? { search_text: searchText } : {};
    api.student
      .GetStudentList(params.evaluationFormId, {
        page: controlledPagination.active,
        limit: pagination.limit,
        sort_order: 'ASC',
        ...extendParams,
      })
      .then(({ students, pagination }) => {
        setStudents(students);
        setPagination(pagination);
      });
  };

  const onSubmit = form.handleSubmit((formValues) => {
    refetchStudentList({
      searchText: formValues.search,
    });
  });

  const triggerModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    refetchStudentList();
  }, [controlledPagination.active, pagination.limit]);

  return (
    <>
      <LayoutEvaluationForm
        subPageTitle={`ใบเกรด ${[evaluationForm?.year, evaluationForm?.academic_year, `${evaluationForm?.year}/${evaluationForm?.school_room}`].join(' / ')}`}
        breadCrumbs={[{ label: 'สมุดบันทึกการพัฒนาคุณภาพผู้เรียนรายบุคคล (ปพ.6)' }]}
      >
        <Breadcrumb evaluationFormID={evaluationFormID} evaluationForm={evaluationForm} />

        <ModalCreateForm
          open={modal}
          onClose={triggerModal}
          onCompleted={refetchStudentList}
        />
        <StudentTable
          form={form}
          state={evaluationForm}
          onSubmit={onSubmit}
          data={students}
          seletedData={selectedRecords}
          onSelect={setSelectedRecords}
          onCreate={triggerModal}
          pagination={{
            ...controlledPagination,
            totalRecords: pagination.total_count,
            recordsPerPage: pagination.limit,
            onPageChange(page) {
              controlledPagination.setPage(page);
              setPagination({ ...pagination, page });
            },
            onRecordsPerPageChange(records) {
              setPagination({ ...pagination, page: 1, limit: records });
            },
          }}
        />
      </LayoutEvaluationForm>
    </>
  );
};

export default DomainJSX;
