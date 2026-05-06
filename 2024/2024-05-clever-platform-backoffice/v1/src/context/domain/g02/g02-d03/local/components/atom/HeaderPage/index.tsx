import StoreGlobalPersist from '@store/global/persist';
import Topbox from '../Topbox';
import { Curriculum } from '@domain/g02/g02-d01/local/type';

const HeaderPage = () => {
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);

  return (
    <Topbox>
      <div className="flex py-1.5">
        <h1 className="text-[20px] font-bold underline">สังกัดของฉัน </h1>
        <div className="pl-2">
          <p className="text-[20px] font-bold">
            / ${curriculumData.name} (${curriculumData.short_name})
          </p>
        </div>
      </div>
    </Topbox>
  );
};

export default HeaderPage;
