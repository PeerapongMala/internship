import { Dispatch, SetStateAction } from 'react';
import { navCover } from '../cover';
import { CoverNewspaper } from '@domain/g03/g03-d04/local/api/restapi/cover-newspaper';
import DateRangePickerContainer from '../date-range-picker-container';
import PageContent from '../page-content';
import PageHeader from '../page-header';
import TempleListing from '../template-list';

interface HomeSectionProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  isEndDateOpen: boolean;
  setIsEndDateOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  coverList: CoverNewspaper[];
  setCurrentPage: (value: SetStateAction<navCover>) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({
  startDate,
  endDate,
  isEndDateOpen,
  setStartDate,
  setEndDate,
  setIsEndDateOpen,
  isLoading,
  coverList,
  setCurrentPage,
}) => {
  const isDateRangeSelected = startDate && endDate;

  return (
    <PageContent>
      <PageHeader title="ปกหนังสือพิมพ์" mode='none' />
      <div className="space-y-6">
        <div className="flex flex-col gap-y-[21px] w-fit mb-[54px] md:mb-12">
          <div className="space-y-6">
            <DateRangePickerContainer
              startDate={startDate}
              endDate={endDate}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
              isEndDateOpen={isEndDateOpen}
              setIsEndDateOpen={setIsEndDateOpen}
            />
          </div>
          <TempleListing
            setCurrentPage={setCurrentPage}
            coverList={coverList}
            isLoading={isLoading}
            isDateRangeSelected={isDateRangeSelected}
          />
        </div>
      </div>
    </PageContent>
  );
};

export default HomeSection;
