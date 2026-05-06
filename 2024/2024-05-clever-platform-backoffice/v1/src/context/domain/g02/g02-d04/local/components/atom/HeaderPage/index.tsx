import StoreGlobalPersist from '@store/global/persist';
import Topbox from '../Topbox';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import CWTitleGroup from '@component/web/cw-title-group';
import { ISubject } from '@domain/g02/g02-d02/local/type';

const HeaderPage = () => {
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  return (
    <div>
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
          `${subjectData.seed_year_short_name}`,
          `${subjectData.seed_subject_group_name}`,
          `${subjectData.name}`,
        ]}
        className="mt-5"
      />
    </div>
  );
};

export default HeaderPage;
