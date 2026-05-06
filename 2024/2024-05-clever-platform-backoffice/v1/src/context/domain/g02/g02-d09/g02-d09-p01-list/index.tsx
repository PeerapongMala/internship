import { useEffect, useState } from 'react';
import StoreGlobal from '@store/global';
import PanelSelectSubject from './components/web/organism/cw-o-panel-select-subject';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleGroup from '@component/web/cw-title-group';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import StoreGlobalPersist from '@store/global/persist';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import CWWhiteBox from '@component/web/cw-white-box';
import TableSubjectTemplate from './components/web/organism/cw-o-table-subject-template';
import { TSubjectTemplate } from '@domain/g06/local/types/subject-template';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);

  const [templates, setTemplates] = useState<TSubjectTemplate[]>([]);
  const { pagination, setPagination } = usePagination();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <CWBreadcrumbs
        links={[{ label: 'เกี่ยวกับหลักสูตร' }, { label: 'จัดการเกณฑ์ใบตัดเกรด' }]}
      />

      <div className="relative">
        <div className="absolute right-0 top-0">
          <PanelSelectSubject />
        </div>

        <div className="flex flex-col">
          <span className="text-2xl font-bold">จัดการ Template ใบตัดเกรด</span>
          <span>{pagination.total_count} รายการ</span>
        </div>
      </div>

      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData?.name} (${curriculumData?.short_name})`,
          ...(subjectData?.id
            ? [
                subjectData?.seed_year_short_name,
                subjectData?.seed_subject_group_name,
                `${subjectData?.name}`,
              ]
            : [curriculumData?.short_name]),
        ]}
        className="mt-5"
      />

      {subjectData ? (
        <CWWhiteBox>
          <TableSubjectTemplate
            subjectTemplate={templates}
            pagination={pagination}
            onSubjectTemplateChange={(template) => setTemplates(template)}
            setPagination={setPagination}
          />
        </CWWhiteBox>
      ) : (
        <CWWhiteBox className="flex h-[200px] w-full items-center justify-center">
          <PanelSelectSubject />
        </CWWhiteBox>
      )}
    </div>
  );
};

export default DomainJSX;
