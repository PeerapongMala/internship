import { jsx as r, Fragment as W, jsxs as t } from "react/jsx-runtime";
import { useState as v, useRef as E, useEffect as R } from "react";
const m = { width: 1440, height: 810 }, y = (h) => {
  var p, a;
  const { className: g } = h;
  let { scenarioSize: e } = h;
  e || (e = {
    width: m.width,
    height: m.height
  });
  const [d, z] = v({
    width: e.width,
    height: e.height
  }), [u, b] = v(1), i = E(null);
  R(() => {
    const l = () => {
      if (!i.current) return;
      const f = i.current.offsetWidth, w = i.current.offsetHeight, s = f / w, H = e.width / e.height;
      let n, o, c;
      s > H ? (o = e.height, n = o * s, c = w / e.height) : (n = e.width, o = n / s, c = f / e.width), z({
        width: n,
        height: o
      }), b(c);
    };
    return l(), window.addEventListener("resize", l), () => window.removeEventListener("resize", l);
  }, []);
  const S = {
    width: `${d.width}px`,
    height: `${d.height}px`,
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -50%) scale(${u})`,
    transformOrigin: "center center"
    // backgroundColor: 'rgba(1, 1, 0, 0.3)',
  }, F = {
    top: "10px",
    right: "10px",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "12px",
    zIndex: 1e3
  }, x = "relative";
  return /* @__PURE__ */ r(W, { children: /* @__PURE__ */ r(
    "div",
    {
      className: g ? g + " " + x : x,
      ref: i,
      children: /* @__PURE__ */ t("div", { style: S, children: [
        h.deBugVisibleIs && /* @__PURE__ */ t("div", { style: F, children: [
          /* @__PURE__ */ r("p", { children: "RealSize:" }),
          /* @__PURE__ */ t("p", { children: [
            "Width: ",
            (p = i == null ? void 0 : i.current) == null ? void 0 : p.offsetWidth.toFixed(2),
            "px"
          ] }),
          /* @__PURE__ */ t("p", { children: [
            "Height: ",
            (a = i == null ? void 0 : i.current) == null ? void 0 : a.offsetHeight.toFixed(2),
            "px"
          ] }),
          /* @__PURE__ */ r("p", { children: "Rescaler:" }),
          /* @__PURE__ */ t("p", { children: [
            "Width: ",
            d.width.toFixed(2),
            "px"
          ] }),
          /* @__PURE__ */ t("p", { children: [
            "Height: ",
            d.height.toFixed(2),
            "px"
          ] }),
          /* @__PURE__ */ r("p", { children: "scenarioSize:" }),
          /* @__PURE__ */ t("p", { children: [
            "Width: ",
            e.width,
            "px"
          ] }),
          /* @__PURE__ */ t("p", { children: [
            "Height: ",
            e.height,
            "px"
          ] }),
          /* @__PURE__ */ t("p", { children: [
            "Scale: ",
            u.toFixed(3)
          ] })
        ] }),
        h.children
      ] })
    }
  ) });
};
export {
  y as default
};
