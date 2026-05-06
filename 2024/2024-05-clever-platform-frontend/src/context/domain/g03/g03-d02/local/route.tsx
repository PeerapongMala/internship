import DomainG03D02P01TutorialInputRoute from '../g03-d02-p01-tutorial-input/route';
import DomainG03D02P01TutorialRoute from '../g03-d02-p01-tutorial/route';
import DomainG03D02P01TutorialInputTextRoute from '../g03-d02-p02-tutorial-input-text/route';
import DomainG03D02P01TutorialInputVoiceRoute from '../g03-d02-p02-tutorial-input-voice/route';
import DomainG03D02P02TutorialMultichoiceRoute from '../g03-d02-p02-tutorial-multichoice/route';
import DomainG03D02P01TutorialSortFillGroupRoute from '../g03-d02-p02-tutorial-sort-fill-group/route';
import DomainG03D02P01TutorialSortGroupRoute from '../g03-d02-p02-tutorial-sort-group/route';
import DomainG03D02P02TutorialSortRoute from '../g03-d02-p02-tutorial-sort/route';

import I18NInit from './i18n';

const domainList = (routePath: string) => [
  {
    domain: DomainG03D02P01TutorialRoute,
    routePath: routePath + 'main-menu/tutorial',
  },
  {
    domain: DomainG03D02P01TutorialInputRoute,
    routePath: routePath + 'main-menu/tutorial/input',
  },
  {
    domain: DomainG03D02P02TutorialMultichoiceRoute,
    routePath: routePath + 'main-menu/tutorial/multiple-choices',
  },
  {
    domain: DomainG03D02P02TutorialSortRoute,
    routePath: routePath + 'main-menu/tutorial/sort',
  },
  {
    domain: DomainG03D02P01TutorialSortGroupRoute,
    routePath: routePath + 'main-menu/tutorial/sort-group',
  },
  {
    domain: DomainG03D02P01TutorialSortFillGroupRoute,
    routePath: routePath + 'main-menu/tutorial/sort-fill-group',
  },
  {
    domain: DomainG03D02P01TutorialInputTextRoute,
    routePath: routePath + 'main-menu/tutorial/input/text',
  },
  {
    domain: DomainG03D02P01TutorialInputVoiceRoute,
    routePath: routePath + 'main-menu/tutorial/input/voice',
  },
];

const DomainG03D03 = { domainList: domainList, i18NInit: I18NInit };
export default DomainG03D03;
