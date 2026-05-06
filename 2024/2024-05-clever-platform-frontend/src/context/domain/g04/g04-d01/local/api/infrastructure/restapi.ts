import Lesson from '../group/lesson/restapi';
import Level from '../group/level/restapi';
import Sublesson from '../group/sublesson/restapi';
import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = { Lesson, Sublesson, Level };

export default RestAPI;
