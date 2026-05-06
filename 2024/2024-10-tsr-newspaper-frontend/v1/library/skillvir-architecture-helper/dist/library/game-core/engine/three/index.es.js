import * as s from "three";
import { jsx as T } from "react/jsx-runtime";
import G from "react";
var C = Object.defineProperty, P = (e, t, o) => t in e ? C(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, a = (e, t, o) => P(e, typeof t != "symbol" ? t + "" : t, o);
class A extends G.Component {
  constructor() {
    super(...arguments), a(this, "domRoot", null), a(this, "render", () => /* @__PURE__ */ T(
      "div",
      {
        id: "game-root",
        className: this.props.className,
        ref: (t) => {
          this.domRoot = t;
        }
      }
    ));
  }
  //   gameThree: GameThree | null = null;
  componentDidMount() {
    var t, o;
    (t = this.props.engineThree) == null || t.Dom.Mount(this.domRoot), (o = this.props.engineThree) == null || o.GameLoop.SetEnable(!0);
  }
  componentWillUnmount() {
    var t, o;
    (t = this.props.engineThree) == null || t.Dom.Unmount(this.domRoot), (o = this.props.engineThree) == null || o.GameLoop.SetEnable(!1);
  }
}
const h = (e) => ({
  width: e ? e.clientWidth : window.innerWidth,
  height: e ? e.clientHeight : window.innerHeight
}), E = ({
  cameraConfig: e = {},
  domParent: t
}) => {
  const { width: o, height: i } = h(t);
  e.fov = e.fov || 75, e.aspect = e.aspect || o / i, e.near = e.near || 1e-3, e.far = e.far || 1e4;
  const m = new s.PerspectiveCamera(
    e.fov,
    e.aspect,
    e.near,
    e.far
  ), l = new s.OrthographicCamera(
    o / -2,
    o / 2,
    i / 2,
    i / -2,
    e.near,
    e.far
  );
  return {
    isMainCameraIsOrtho: e.isMainCameraIsOrtho || !1,
    main: e.isMainCameraIsOrtho ? l : m,
    persp: m,
    ortho: l
  };
}, M = (e, t = !1) => {
  if (t)
    return null;
  !e.scene || e.camera.main;
}, O = (e) => {
  !e.scene || !e.camera.main || e.renderer.render(e.scene, e.camera.main);
}, c = {
  Init: M,
  Render: O
}, I = (e, t) => {
  const { width: o, height: i } = h(t);
  e.renderer.xr.isPresenting || y(
    e,
    // domRoot,
    o,
    i
  );
}, y = (e, t, o) => {
  var i;
  e.camera.main instanceof s.PerspectiveCamera && (e.camera.main.aspect = t / o), (i = e.camera.main) == null || i.updateProjectionMatrix(), e.renderer.setPixelRatio(1 / window.devicePixelRatio), e.renderer.setSize(
    t,
    // width * window.devicePixelRatio,
    o,
    // height * window.devicePixelRatio,
    !0
  ), e.renderer.setSize(
    t * window.devicePixelRatio,
    o * window.devicePixelRatio,
    !1
  ), e.camera.main instanceof s.PerspectiveCamera && (e.camera.main.aspect = t / o), c.Render(e);
};
class W {
  //   assetManager: AssetManager | null = null;
  //   sceneManager: SceneManager | null = null;
  //   isMainCameraIsOrtho: boolean = false;
  //   isGameLoopEnable: boolean = false;
  constructor(t) {
    a(this, "context"), a(this, "gameLoop", null), a(this, "GameLoop", {
      SetEnable: (n) => {
        var r;
        this.context.gameloop.enableIs = n, this.context.gameloop.enableIs || (this.GameLoop.fTimeStampLast = 0), (r = this.context.renderer) == null || r.setAnimationLoop(
          this.context.gameloop.enableIs ? this.GameLoop.GameRender : null
        );
      },
      fTimeStampStart: 0,
      fTimeStampLast: 0,
      GameRender: (n, r) => {
        this.GameLoop.fTimeStampStart === 0 && (this.GameLoop.fTimeStampStart = n), this.GameLoop.fTimeStampLast === 0 && (this.GameLoop.fTimeStampLast = n);
        const d = (n - this.GameLoop.fTimeStampLast) / 1e3 || 0;
        this.GameLoop.fTimeStampLast = n, this.gameLoop && this.gameLoop({
          context: this.context,
          deltaTime: d,
          timeStamp: n,
          frame: r
        }), c.Render(this.context);
      }
      // addEffectPass = (pass: any) => {
      //   GameRenderer.addEffectPass(this.context, pass);
      // };
      // removeEffectPass = (pass: any) => {
      //   GameRenderer.removeEffectPass(this.context, pass);
      // };
    }), a(this, "Dom", {
      Mount: (n) => {
        var r, d, w;
        if (!n)
          return;
        this.context.dom.parent = n;
        const { width: b, height: R } = h(this.context.dom.parent);
        (r = this.context.dom.root) == null || r.setAttribute("style", "width:" + b + "px"), (d = this.context.dom.root) == null || d.setAttribute("style", "height:" + R + "px"), this.context.dom.root && ((w = this.context.dom.parent) == null || w.appendChild(this.context.dom.root)), this.Dom.OnResize();
      },
      Unmount: (n) => {
        var r;
        n && (this.context.dom.parent = n), this.context.dom.root && ((r = this.context.dom.parent) == null || r.removeChild(this.context.dom.root)), this.context.dom.parent = null;
      },
      OnResize: () => {
        I(this.context, this.context.dom.parent);
      }
    });
    var o, i, m, l, p, u, x, v, g, f, L, S;
    if (!t.gameLoop) {
      console.error("Error : gameLoop Not Found."), this.context = {};
      return;
    }
    this.gameLoop = t.gameLoop, this.context = {
      payload: {},
      scene: new s.Scene(),
      camera: E({
        cameraConfig: (o = t == null ? void 0 : t.context) == null ? void 0 : o.camera,
        domParent: null
        // this.dom.parent || null,
      }),
      renderer: new s.WebGLRenderer(((i = t == null ? void 0 : t.context) == null ? void 0 : i.renderer) || {}),
      gameloop: {
        enableIs: ((l = (m = t.context) == null ? void 0 : m.gameloop) == null ? void 0 : l.isAutoStart) || !1
      },
      dom: {
        parent: ((u = (p = t.context) == null ? void 0 : p.dom) == null ? void 0 : u.parent) || document.body,
        root: document.createElement("div")
      }
    }, this.context.dom.root.setAttribute("id", "dom-root"), this.context.dom.root.appendChild(this.context.renderer.domElement), (v = (x = t.context) == null ? void 0 : x.dom) != null && v.parent && this.Dom.Mount((f = (g = t.context) == null ? void 0 : g.dom) == null ? void 0 : f.parent), window.addEventListener("resize", this.Dom.OnResize, !1), c.Render(this.context), this.GameLoop.SetEnable(((S = (L = t.context) == null ? void 0 : L.gameloop) == null ? void 0 : S.isAutoStart) || !0);
  }
}
export {
  W as EngineThree,
  A as JSXEngineThree
};
