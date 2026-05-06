import { useShallow as S } from "zustand/react/shallow";
const s = (t, r, o) => {
  if (o == null && (o = !0), t.length == 0) {
    console.log("not have store element");
    return;
  }
  if (t.length == 1) {
    const e = r((n) => {
      if (t[0] in n)
        return n[t[0]];
      console.log("Not Have Store :", t[0]);
    });
    return { [t[0]]: e };
  }
  return r(
    (o ? S : (e) => e)((e) => {
      const n = {};
      for (const l in t)
        if (t[l] in e) {
          const a = { [t[l]]: e[t[l]] };
          Object.assign(n, a);
        } else
          console.log("Not Have Store :", t[l]);
      return n;
    })
  );
}, i = (t, r) => ({
  StateGet: (o, e) => s(o, t, e),
  StateSet: (o) => t.setState(o),
  StateGetAllWithUnsubscribe: () => t.getState(),
  MethodGet: () => r,
  StoreGet: () => t
}), g = {
  StateMapping: s,
  StoreExport: i
};
export {
  g as default
};
