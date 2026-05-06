import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import {
  ISubject,
  IManageYear,
  IPlatform,
  ISubjectGroup,
} from '@domain/g02/g02-d02/local/type';
import ModalSelectSubject from '@domain/g02/g02-d03/local/components/modal/ModalSelectSubject';
import useModal from '@global/utils/useModal';
import StoreGlobalPersist from '@store/global/persist';
import { useState, useEffect } from 'react';
import API from '@domain/g02/g02-d03/local/api';
import APIG02D02 from '@domain/g02/g02-d02/local/api';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import usePagination from '@global/hooks/usePagination';

const PanelSelectSubject = () => {
  const modal = useModal();
  const [selectSubjectInModal, setSelectSubjectInModal] = useState<ISubject>();
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);

  const [platformList, setPlatformList] = useState<IPlatform[]>([]);
  const [selectPlatform, setSelectPlatform] = useState<IPlatform | null>(null);
  const [yearList, setYearList] = useState<IManageYear[]>([]);
  const [selectYear, setSelectYear] = useState<IManageYear>();
  const [selectSubjectGroup, setSelectSubjectGroup] = useState<ISubjectGroup>();
  const [subjectGroupList, setSubjectGroupList] = useState<ISubjectGroup[]>([]);
  const [subjectList, setSubjectList] = useState<ISubject[]>([]);

  const { pagination: paginationSubject, setPagination: setPaginationSubject } =
    usePagination();

  useEffect(() => {
    fetchPlatformList();
  }, []);

  useEffect(() => {
    if (selectPlatform?.id) {
      fetchYearList();
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
      }
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

  const handlePageChange = (newPage: number) => {
    setPaginationSubject((prev) => ({ ...prev, page: newPage }));
  };
  const handlePageSizeChange = (newSize: number) => {
    setPaginationSubject((prev) => ({ ...prev, limit: newSize, page: 1 }));
  };

  return (
    <>
      <CWButton
        icon={<IconPlus />}
        title="เลือกวิชา"
        onClick={() => {
          modal.open();
          setSelectSubjectInModal(undefined);
        }}
      />
      <ModalSelectSubject
        title="เลือกวิชา"
        onOk={() => {
          modal.close();
          StoreGlobalPersist.MethodGet().setSubjectData(selectSubjectInModal);
        }}
        size="large"
        buttonName="เลือก"
        disableOk={!selectSubjectInModal?.id}
        cancelButtonName="ย้อนกลับ"
        onClose={() => {
          modal.close();
          setSelectPlatform(null);
          setSelectYear(undefined);
          setSelectSubjectGroup(undefined);
        }}
        open={modal.isOpen}
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
    </>
  );
};

export default PanelSelectSubject;
