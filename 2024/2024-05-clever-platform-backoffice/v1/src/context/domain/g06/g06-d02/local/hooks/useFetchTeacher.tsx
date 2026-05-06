import usePagination from '@global/hooks/usePagination';
import { TPagination } from '@global/types/api';
import { useEffect, useState } from 'react';
import API from '@domain/g06/g06-d02/local/api';
import { getUserData } from '@global/utils/store/getUserData';
import showMessage from '@global/utils/showMessage';
import { AxiosError, AxiosResponse, isAxiosError, isCancel } from 'axios';
import { TTeacherUser } from '../types/admin';
import { TBasePaginationResponse } from '../types';

type useFetchTeacherParams = {
  gradeSubjectID?: number;
};

export default function useFetchTeacher({ gradeSubjectID }: useFetchTeacherParams) {
  const userData = getUserData();

  const [teachers, setTeachers] = useState<TTeacherUser[]>([]);

  const { pagination, setPagination } = usePagination({ isModal: true });
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();
    fetchTeacherList(pagination, searchText, controller);

    return () => {
      controller.abort();
    };
  }, [pagination.page, pagination.limit, searchText]);

  const fetchTeacherList = async (
    pagination: TPagination,
    searchText: string,
    controller: AbortController,
  ) => {
    let response: AxiosResponse<TBasePaginationResponse<TTeacherUser>, any>;

    setFetching(true);
    try {
      response = await API.Admin.GetTeacherList(
        {
          page: pagination.page,
          limit: pagination.limit,
          schoolID: userData.school_id,
          search: searchText,
          grade_subject_id: gradeSubjectID,
          // * for only teacher that have data-entry's access
          teacher_access: 3,
        },
        onErrorFetchTeacherList,
        controller,
      );
    } catch (error) {
      if (isCancel(error)) {
        return;
      }

      if (isAxiosError(error)) {
        onErrorFetchTeacherList(error);
        return;
      }

      throw error;
    } finally {
      setFetching(false);
    }

    setTeachers(response.data.data);
    setPagination((prev) => ({
      ...prev,
      total_count: response.data._pagination.total_count,
    }));
  };
  const onErrorFetchTeacherList = (error: AxiosError) => {
    showMessage('พบปัญหาในการเรียกรายการครูจากเซิร์ฟเวอร์', 'error');
  };

  return { teachers, fetching, pagination, setPagination, searchText, setSearchText };
}
