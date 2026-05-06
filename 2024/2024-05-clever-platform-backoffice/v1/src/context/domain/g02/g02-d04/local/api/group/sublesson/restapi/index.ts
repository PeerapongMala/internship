import { RepositoryPatternInterface } from '../../../repository-pattern';
// import SublessonAllGet from './sublesson-all-get';

import SubLessonList from './sub-lesson-list';
import SubLessonCreate from './sub-lesson-create';
import SubLessonUpdate from './sub-lesson-update';
import BulkEdit from './sub-lesson-bulk-edit';
import DownloadCSV from './sub-lesson-download-csv';
import UploadCSV from './sub-lesson-upload-csv';
import { Indicators } from './indicators';
import SubLessonGet from './sub-lesson-get';
import SubLessonSoft from './sub-lesson-soft';
import { SubLessonFileUpdate } from './sub-lesson-file-update';

const Sublesson: RepositoryPatternInterface['Sublesson'] = {
  SubLessonList: { Get: SubLessonList },
  SubLessonGet: { Get: SubLessonGet },
  SubLessonCreate: { Post: SubLessonCreate },
  SubLessonUpdate: { Patch: SubLessonUpdate },
  SubLessonFileUpdate: { Post: SubLessonFileUpdate },
  BulkEdit: { Post: BulkEdit },
  DownloadCSV: { Get: DownloadCSV },
  UploadCSV: { Post: UploadCSV },
  Indicator: { List: Indicators },
  SubLessonSoft: { Patch: SubLessonSoft },
};

export default Sublesson;
