const e = (a) => {
  const n = [], o = [], s = [];
  return a.forEach((t) => {
    o.push(t.domain.I18N), t.domain.GameInitial && n.push(new t.domain.GameInitial()), s.push(t.domain.Route(t.routePath));
  }), {
    i18nList: o,
    sceneStateList: n,
    routeFuncList: s
  };
}, i = (a) => {
  const { i18nList: n, sceneStateList: o, routeFuncList: s } = e([
    ...a.map(
      (t) => t.group.domainList(t.routePath).map((u) => u)
    ).flat()
  ]);
  return n.push(...a.map((t) => t.group.i18NInit)), { i18nList: n, sceneStateList: o, routeFuncList: s };
}, r = {
  Manager: e,
  GroupManager: i
}, c = {
  Route: r
};
export {
  c as default
};
