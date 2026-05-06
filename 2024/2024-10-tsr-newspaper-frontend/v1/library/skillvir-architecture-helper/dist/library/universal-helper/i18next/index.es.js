import c from "i18next";
import { initReactI18next as r } from "react-i18next";
const p = async ({ debug: t = !0, fallbackLng: e = "en" }, n) => {
  const o = {};
  for (const a in n)
    if (n[a].name !== "")
      for (const i in n[a].locate)
        o.hasOwnProperty(i) || (o[i] = {}), o[i] = {
          ...o[i],
          [n[a].name]: n[a].locate[i]
        };
  return c.use(r).init({
    debug: t,
    fallbackLng: e,
    interpolation: {
      escapeValue: !1
      // not needed for react as it escapes by default
    },
    resources: o
  }), c;
}, s = {
  Init: p
}, f = (t, e) => t ? typeof t == "string" || t instanceof String ? e(t) || "" : (typeof t == "object" || t instanceof Object) && "key" in t ? e(t.key, "option" in t ? t.option : void 0) : (console.log("cant mapping type of ", typeof t), "") : "", m = {
  Middleware: s,
  MappingObject: f
};
export {
  m as default
};
