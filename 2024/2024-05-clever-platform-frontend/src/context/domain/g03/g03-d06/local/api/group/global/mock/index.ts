import { RepositoryPatternInterface } from '../../../repository-pattern';
import Acivities from './activity';
import Gifts from './gift';
import Mailboxes from './mailbox';
import Notification from './notification';

const Global: RepositoryPatternInterface['Global'] = {
  Acivities,
  Mailboxes,
  Gifts,
  Notification,
};

export default Global;
