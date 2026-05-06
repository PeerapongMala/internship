import Lesson from '../group/lesson/restapi';
import Subject from '../group/subject/restapi';
import Sublesson from '../group/sublesson/restapi';

import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = { Lesson, Subject, Sublesson };

export default RestAPI;
