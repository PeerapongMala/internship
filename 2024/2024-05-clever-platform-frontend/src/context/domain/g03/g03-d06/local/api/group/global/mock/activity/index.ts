import { pagination, responseOk } from '@core/helper/api-mock';
import { RepositoryPatternInterface } from '../../../../repository-pattern';
import MockJson from './index.json';

export const ActivityGet: RepositoryPatternInterface['Global']['Acivities']['Get'] = (
  subjectId: string,
) => {
  return Promise.resolve(
    pagination({
      data: MockJson,
      page: 1,
      limit: -1,
    }),
  );
};

export const ActivityRead: RepositoryPatternInterface['Global']['Acivities']['Read'] = (
  announcementId: string,
) => {
  return Promise.resolve(
    responseOk({
      data: undefined,
      message: `Announcement Id ${announcementId} has read`,
    }),
  );
};

export const ActivityReadAll: RepositoryPatternInterface['Global']['Acivities']['ReadAll'] =
  (subjectId: string) => {
    return Promise.resolve(
      responseOk({ data: undefined, message: 'Announcements Read' }),
    );
  };

const Activities: RepositoryPatternInterface['Global']['Acivities'] = {
  Get: ActivityGet,
  Read: ActivityRead,
  ReadAll: ActivityReadAll,
};

export default Activities;
