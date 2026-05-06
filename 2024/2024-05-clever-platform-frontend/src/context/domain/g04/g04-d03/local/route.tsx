import DomainG04D03P01GameplayQuizRoute from '../g04-d03-p01-gameplay-quiz/route';
import DomainG04D03P01GameplayQuizRoute2 from '../g04-d03-p01-gameplay-quiz/route-2';
import DomainG04D03P02AnswerRoute from '../g04-d03-p02-answer/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG04D03P01GameplayQuizRoute2, routePath: routePath + 'quiz/$levelId' },
  { domain: DomainG04D03P01GameplayQuizRoute, routePath: routePath + 'quiz/quiz-demo' }, // custom route inside
  { domain: DomainG04D03P02AnswerRoute, routePath: routePath + 'answer' },
];

const DomainG04D03 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG04D03;
