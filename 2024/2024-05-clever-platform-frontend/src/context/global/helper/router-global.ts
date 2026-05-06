import { helperTanStackRouterClass } from '@global/route';
import {
  AnyRoute,
  Router,
  RouterHistory,
  TrailingSlashOption,
} from '@tanstack/react-router';

const router: Router<
  AnyRoute,
  TrailingSlashOption,
  boolean,
  RouterHistory,
  Record<string, any>
> = helperTanStackRouterClass.Router.Get();

export default router;
