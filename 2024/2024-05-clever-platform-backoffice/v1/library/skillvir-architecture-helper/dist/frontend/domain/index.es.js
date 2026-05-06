import { jsx as a } from "react/jsx-runtime";
import { createRoute as l, Outlet as m } from "@tanstack/react-router";
const i = (o) => {
  const n = [], e = [], s = [];
  return o.forEach((t) => {
    e.push(t.domain.I18N), t.domain.GameInitial && n.push(new t.domain.GameInitial()), s.push(t.domain.Route(t.routePath));
  }), {
    i18nList: e,
    sceneStateList: n,
    routeFuncList: s
  };
}, L = (o) => {
  const { i18nList: n, sceneStateList: e, routeFuncList: s } = i([
    ...o.map(
      (t) => t.group.domainList(t.routePath).map((r) => r)
    ).flat()
  ]);
  return n.push(...o.map((t) => t.group.i18NInit)), { i18nList: n, sceneStateList: e, routeFuncList: s };
}, h = (o, n) => {
  const { i18nList: e, sceneStateList: s, routeFuncList: t } = n;
  return { i18nList: e, sceneStateList: s, routeFuncList: [
    (p) => {
      const u = l({
        id: o.id,
        getParentRoute: () => p,
        component: () => /* @__PURE__ */ a(o.componentWithChildren, { children: /* @__PURE__ */ a(m, {}) })
      }), c = [];
      return t.forEach((d) => {
        c.push(d(u));
      }), u.addChildren(c), u;
    }
  ] };
}, F = (o, n) => h(o, L(n)), R = (o) => {
  const n = [], e = [], s = [];
  return o.forEach((t) => {
    n.push(...t.i18nList), e.push(...t.sceneStateList), s.push(...t.routeFuncList);
  }), {
    i18nList: n,
    sceneStateList: e,
    routeFuncList: s
  };
}, f = {
  Manager: i,
  GroupManager: L,
  LayoutManager: h,
  LayoutManagerWithGroup: F,
  MergeRawList: R
}, w = {
  Route: f
};
export {
  w as default
};
