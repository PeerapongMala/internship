import { RepositoryPatternInterface } from '../../../repository-pattern';

import LessonCreate from './lesson-create';
import LessonUpdate from './lesson-update';
import LessonList from './lesson-list';
import LessonGetById from './lesson-get-by-id';
import BulkEdit from './lesson-bulk-edit';
import DownloadCsv from './lesson-download-csv';
import CsvUpload from './lesson-upload-csv';
import LessonSort from './lesson-sort';
import SubjectList from './subject-list';
import MonsterList from './monster-list';
import LessonGetBy from './lesson-get-by';
import DeleteMonster from './monster-delete';
import { CreateMonster } from './monster-create';
import PlatformList from './platform-list';
import { LessonLevelBulkEdit } from './lesson-level-bulk-edit';

const Lesson: RepositoryPatternInterface['Lesson'] = {
  LessonCreate: { Post: LessonCreate },
  LessonUpdate: { Patch: LessonUpdate },
  LessonList: { Get: LessonList },
  LessonGetById: { Get: LessonGetById },
  LessonGetBy: { Get: LessonGetBy },
  BulkEdit: { Post: BulkEdit },
  LessonLevelBulkEdit: { Post: LessonLevelBulkEdit },
  DownloadCSV: { Get: DownloadCsv },
  UploadCSV: { Post: CsvUpload },
  SortLesson: { Patch: LessonSort },
  SubjectList: { Get: SubjectList },
  MonsterList: { Get: MonsterList },
  MonsterDelete: { Delete: DeleteMonster },
  MonsterCreate: { Post: CreateMonster },
  PlatformList: { Get: PlatformList },
};

export default Lesson;
