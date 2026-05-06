import { createRootRoute as h, createRouter as s, createRoute as a, RouterProvider as l, Outlet as c } from "@tanstack/react-router";
import { jsx as u, Fragment as R, jsxs as m } from "react/jsx-runtime";
import { TanStackRouterDevtools as d } from "@tanstack/router-devtools";
var F = Object.defineProperty, S = (o, e, t) => e in o ? F(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, n = (o, e, t) => S(o, typeof e != "symbol" ? e + "" : e, t);
const T = (o) => (e) => (t) => a({
  getParentRoute: () => t,
  path: e || "" + o.routePathSub || "",
  component: o.JSX
}), f = {
  Mapping: T
};
class v {
  constructor(e) {
    n(this, "routeRoot", h({
      component: () => /* @__PURE__ */ u(R, {})
    })), n(this, "RouteRoot", {
      Get: () => this.routeRoot,
      Create: (t) => {
        this.routeRoot = h({
          component: () => /* @__PURE__ */ u(
            L,
            {
              template: t.template,
              tanStackRouterDevtoolsIs: t.tanStackRouterDevtoolsIs
            }
          )
        });
        const r = [];
        if (t.routeFuncList && r.push(...t.routeFuncList), t.templateNotFound) {
          const i = (p) => a({
            getParentRoute: () => p,
            path: "*",
            component: t.templateNotFound
          });
          r.push(i);
        }
        return r.length > 0 && this.Route.Bind({
          routeTree: this.routeRoot,
          routeFuncList: r
        }), this.Router.Set(s({ routeTree: this.routeRoot })), this.routeRoot;
      },
      Bind: (t) => this.Route.Bind({
        routeTree: this.routeRoot,
        routeFuncList: t.routeFuncList
      })
    }), n(this, "Route", {
      Create: (t) => a({
        getParentRoute: () => t.routeParent || this.routeRoot,
        path: t.path,
        component: t.component
      }),
      Bind: (t) => {
        const r = [];
        return t.routeFuncList.forEach((i) => {
          r.push(i(t.routeTree));
        }), t.routeTree.addChildren(r), t.routeTree;
      }
    }), n(this, "router", s({})), n(this, "Router", {
      Get: () => this.router,
      Set: (t) => {
        this.router = t;
      },
      RouteTree: {
        Set: (t) => {
          this.router = s({
            routeTree: t(this.router.routeTree)
          });
        },
        Bind: (t) => {
          this.router = s({
            routeTree: this.RouteRoot.Bind({
              routeFuncList: t.routeFuncList
            })
          });
        }
      },
      ProviderJSX: () => /* @__PURE__ */ u(l, { router: this.router })
    }), this.RouteRoot.Create(e);
  }
}
const L = (o) => {
  let e = /* @__PURE__ */ u(c, {});
  return o.template && (e = /* @__PURE__ */ u(o.template, { children: /* @__PURE__ */ u(c, {}) })), /* @__PURE__ */ m(R, { children: [
    e,
    o.tanStackRouterDevtoolsIs && /* @__PURE__ */ u(d, {})
  ] });
}, B = {
  JSX: f,
  HelperTanStackRouterClass: v
};
export {
  B as default
};
