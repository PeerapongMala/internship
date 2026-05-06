'use strict';
const r = require('@tanstack/react-router'),
  u = require('react/jsx-runtime'),
  c = require('@tanstack/router-devtools');
var R = Object.defineProperty,
  h = (o, e, t) =>
    e in o
      ? R(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (o[e] = t),
  n = (o, e, t) => h(o, typeof e != 'symbol' ? e + '' : e, t);
const l = (o) => (e) => (t) =>
    r.createRoute({
      getParentRoute: () => t,
      path: e || '' + o.routePathSub || '',
      component: o.JSX,
    }),
  p = { Mapping: l };
class m {
  constructor(e) {
    n(this, 'routeRoot', r.createRootRoute({ component: () => u.jsx(u.Fragment, {}) })),
      n(this, 'RouteRoot', {
        Get: () => this.routeRoot,
        Create: (t) => {
          this.routeRoot = r.createRootRoute({
            component: () =>
              u.jsx(d, {
                template: t.template,
                tanStackRouterDevtoolsIs: t.tanStackRouterDevtoolsIs,
              }),
          });
          const s = [];
          if ((t.routeFuncList && s.push(...t.routeFuncList), t.templateNotFound)) {
            const i = (a) =>
              r.createRoute({
                getParentRoute: () => a,
                path: '*',
                component: t.templateNotFound,
              });
            s.push(i);
          }
          return (
            s.length > 0 &&
              this.Route.Bind({ routeTree: this.routeRoot, routeFuncList: s }),
            this.Router.Set(r.createRouter({ routeTree: this.routeRoot })),
            this.routeRoot
          );
        },
        Bind: (t) =>
          this.Route.Bind({ routeTree: this.routeRoot, routeFuncList: t.routeFuncList }),
      }),
      n(this, 'Route', {
        Create: (t) =>
          r.createRoute({
            getParentRoute: () => t.routeParent || this.routeRoot,
            path: t.path,
            component: t.component,
          }),
        Bind: (t) => {
          const s = [];
          return (
            t.routeFuncList.forEach((i) => {
              s.push(i(t.routeTree));
            }),
            t.routeTree.addChildren(s),
            t.routeTree
          );
        },
      }),
      n(this, 'router', r.createRouter({})),
      n(this, 'Router', {
        Get: () => this.router,
        Set: (t) => {
          this.router = t;
        },
        RouteTree: {
          Set: (t) => {
            this.router = r.createRouter({ routeTree: t(this.router.routeTree) });
          },
          Bind: (t) => {
            this.router = r.createRouter({
              routeTree: this.RouteRoot.Bind({ routeFuncList: t.routeFuncList }),
            });
          },
        },
        ProviderJSX: () => u.jsx(r.RouterProvider, { router: this.router }),
      }),
      this.RouteRoot.Create(e);
  }
}
const d = (o) => {
    let e = u.jsx(r.Outlet, {});
    return (
      o.template && (e = u.jsx(o.template, { children: u.jsx(r.Outlet, {}) })),
      u.jsxs(u.Fragment, {
        children: [e, o.tanStackRouterDevtoolsIs && u.jsx(c.TanStackRouterDevtools, {})],
      })
    );
  },
  F = { JSX: p, HelperTanStackRouterClass: m };
module.exports = F;
