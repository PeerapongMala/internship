import HelperI18Next, {
  HelperI18NextInterface,
} from 'skillvir-architecture-helper/library/universal-helper/i18next';

// import { middlewareFirebase, middlewareFirebaseInit } from './firebase';

export const MiddlewareInit = async ({
  i18nList = [],
}: {
  i18nList: HelperI18NextInterface['I18NDomainInterface'][];
}) => {
  console.log('Middleware Init');
  HelperI18Next.Middleware.Init(
    {
      debug: import.meta.env.VITE_DEBUG_MIDDLEWARE_I18NEXT == 'true',
      fallbackLng: 'th',
    },
    i18nList,
  );
  // await middlewareFirebaseInit();
  // middlewareChartJSInit
};
