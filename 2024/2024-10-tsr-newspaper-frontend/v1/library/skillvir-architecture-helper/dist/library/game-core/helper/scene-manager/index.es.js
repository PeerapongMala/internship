var n = Object.defineProperty, a = (i, t, e) => t in i ? n(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, s = (i, t, e) => a(i, typeof t != "symbol" ? t + "" : t, e);
class c {
  constructor(t) {
    s(this, "SM", null), s(this, "_isActive", !1), s(this, "_isStart", !1), s(this, "_sceneName", ""), s(this, "Check", (e) => {
      const h = this._sceneName === e;
      this._isActive !== h && (this._isActive = h, this._isStart = !1, h ? this.Awake() : this.Unload());
    }), s(this, "Initial", () => {
    }), s(this, "Awake", () => {
    }), s(this, "Start", (e) => {
    }), s(this, "Unload", () => {
    }), s(this, "Update", (e) => {
    }), s(this, "_Update", (e) => {
      this._isActive && (this._isStart || (this.Start(e), this._isStart = !0), this.Update(e));
    }), s(this, "GetName", () => this._sceneName), this._isActive = !1, this._sceneName = t, this.Initial();
  }
}
class o {
  constructor() {
    s(this, "Initial", () => {
    }), s(this, "Start", (t) => {
    }), s(this, "Update", (t) => {
    }), s(this, "ComponentAdd", (t) => {
    }), s(this, "ComponentRemove", (t) => {
    }), this.Initial();
  }
}
class r {
  constructor() {
    s(this, "Initial", () => {
    }), s(this, "Start", (t, e) => {
    }), s(this, "Update", (t, e) => {
    }), this.Initial();
  }
}
class _ {
  constructor() {
    s(this, "_sceneList", {}), s(this, "_sceneNow", ""), s(this, "payload", {}), s(this, "Add", (t) => {
      t instanceof c ? (this._sceneList[t.GetName()] = t, this._sceneList[t.GetName()].SM = this) : console.error("Error : Scene Add only add SceneState");
    }), s(this, "AddList", (t) => {
      for (let e = 0; e < t.length; e++)
        this.Add(t[e]);
    }), s(this, "Clear", () => {
      this._sceneList = {};
    }), s(this, "Set", (t) => {
      if (!this._sceneList.hasOwnProperty(t)) {
        console.error("Error : Set Scene Not Found", t);
        return;
      }
      if (this._sceneNow !== t) {
        this._sceneNow = t;
        for (let e in this._sceneList)
          e.toString() !== t.toString() && this._sceneList[e].Check(t);
        this._sceneList[t] && this._sceneList[t].Check(t);
      }
    }), s(this, "Get", (t) => (t || (t = this._sceneNow), this._sceneList[t] || null)), s(this, "Update", (t) => {
      this._sceneNow && this._sceneList[this._sceneNow]._Update(t);
    }), s(this, "GetSceneNow", () => this._sceneNow), s(this, "SetProp", (t) => {
      typeof t == "object" && (this.payload = { ...this.payload, ...t });
    }), this._sceneList = {}, this._sceneNow = "";
  }
}
export {
  r as CanvasComponent,
  o as GameComponent,
  _ as SceneManager,
  c as SceneState
};
