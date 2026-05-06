import Lesson from '../group/lesson/mock';
import Level from '../group/level/restapi';
import Sublesson from '../group/sublesson/mock';
import { RepositoryPatternInterface } from '../repository-pattern';

const Mock: RepositoryPatternInterface = { Lesson, Sublesson, Level };

export default Mock;
