var r = Object.defineProperty, m = (n, h, i) => h in n ? r(n, h, { enumerable: !0, configurable: !0, writable: !0, value: i }) : n[h] = i, s = (n, h, i) => m(n, typeof h != "symbol" ? h + "" : h, i);
class c {
  constructor(h) {
    s(this, "context2d"), s(this, "canvas", null), s(this, "scenarioSize", {
      width: 1440,
      height: 810
    }), s(this, "rect", {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      normalize: { x: 0, y: 0, width: 0, height: 0 }
    }), s(this, "initial", (i) => {
      i || (i = {}), this.canvas = i.canvas, this.context2d = i.context2d, i.scenarioSize && (this.scenarioSize = {
        width: i.scenarioSize.width || 0,
        height: i.scenarioSize.height || 0
      });
    }), s(this, "calculate", () => {
      if (this.rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        normalize: { x: 0, y: 0, width: 0, height: 0 }
      }, !this.canvas)
        return {
          rect: this.rect,
          ...this.mapping
        };
      const i = this.scenarioSize.width / this.scenarioSize.height;
      let t, e;
      this.canvas.width / this.canvas.height > i ? (e = this.canvas.height, t = e * i) : (t = this.canvas.width, e = t / i);
      const a = (this.canvas.width - t) / 2, g = (this.canvas.height - e) / 2, l = t / this.scenarioSize.width, p = e / this.scenarioSize.height;
      return this.rect = {
        x: a,
        y: g,
        width: l,
        height: p,
        normalize: {
          x: a,
          y: g,
          width: t,
          height: e
        }
      }, {
        rect: this.rect,
        ...this.mapping
      };
    }), s(this, "mapping", {
      xCal: (i) => i * this.rect.width,
      yCal: (i) => i * this.rect.height,
      safeZoneXCal: (i) => this.rect.x + i * this.rect.width,
      safeZoneYCal: (i) => this.rect.y + i * this.rect.height,
      widthCal: (i) => i * this.rect.width,
      heightCal: (i) => i * this.rect.height,
      //
      translate: (i, t = !0) => [
        t ? this.mapping.safeZoneXCal(i.x) : this.mapping.xCal(i.x),
        t ? this.mapping.safeZoneYCal(i.y) : this.mapping.yCal(i.y)
      ],
      fillRect: (i, t = !0) => [
        t ? this.mapping.safeZoneXCal(i.x) : this.mapping.xCal(i.x),
        t ? this.mapping.safeZoneYCal(i.y) : this.mapping.yCal(i.y),
        this.mapping.widthCal(i.width),
        this.mapping.heightCal(i.height)
      ],
      arc: (i, t = !0) => {
        const { context2d: e } = this;
        e && e.arc(
          t ? this.mapping.safeZoneXCal(i.x) : this.mapping.xCal(i.x),
          t ? this.mapping.safeZoneYCal(i.y) : this.mapping.yCal(i.y),
          this.mapping.widthCal(i.radius),
          i.startAngle,
          i.endAngle,
          i.anticlockwise || !1
        );
      },
      drawImage1: (i, t = !0) => [
        i.image,
        t ? this.mapping.safeZoneXCal(i.x || 0) : this.mapping.xCal(i.x || 0),
        t ? this.mapping.safeZoneYCal(i.y || 0) : this.mapping.yCal(i.y || 0)
      ],
      drawImage2: (i, t = !0) => [
        i.image,
        t ? this.mapping.safeZoneXCal(i.x || 0) : this.mapping.xCal(i.x || 0),
        t ? this.mapping.safeZoneYCal(i.y || 0) : this.mapping.yCal(i.y || 0),
        this.mapping.widthCal(i.width || 0),
        this.mapping.heightCal(i.height || 0)
      ],
      drawImage3: (i, t = !0) => [
        i.image,
        i.sprite.x || 0,
        i.sprite.y || 0,
        i.sprite.width,
        i.sprite.height,
        t ? this.mapping.safeZoneXCal(i.x || 0) : this.mapping.xCal(i.x || 0),
        t ? this.mapping.safeZoneYCal(i.y || 0) : this.mapping.yCal(i.y || 0),
        this.mapping.widthCal(i.width || 0),
        this.mapping.heightCal(i.height || 0)
      ]
    }), s(this, "draw", {
      translate: (i, t = !0) => {
        const { context2d: e } = this;
        e && e.translate(...this.mapping.translate(i, t));
      },
      fillRect: (i, t = !0) => {
        const { context2d: e } = this;
        e && e.fillRect(...this.mapping.fillRect(i, t));
      },
      arc: (i, t = !0) => {
        const { context2d: e } = this;
        e && e.arc(
          t ? this.mapping.safeZoneXCal(i.x) : this.mapping.xCal(i.x),
          t ? this.mapping.safeZoneYCal(i.y) : this.mapping.yCal(i.y),
          this.mapping.widthCal(i.radius),
          i.startAngle,
          i.endAngle,
          i.anticlockwise || !1
        );
      },
      drawImage: (i, t = !0) => {
        const { context2d: e } = this;
        e && (i.image && i.sprite != null && i.x != null && i.y != null && i.width != null && i.height != null ? e.drawImage(
          ...this.mapping.drawImage3(
            {
              image: i.image,
              sprite: i.sprite,
              x: i.x,
              y: i.y,
              width: i.width,
              height: i.height
            },
            t
          )
        ) : i.image && i.x != null && i.y != null && i.width != null && i.height != null ? e.drawImage(
          ...this.mapping.drawImage2(
            {
              image: i.image,
              x: i.x,
              y: i.y,
              width: i.width,
              height: i.height
            },
            t
          )
        ) : i.image && i.x != null && i.y != null && e.drawImage(
          ...this.mapping.drawImage1(
            {
              image: i.image,
              x: i.x,
              y: i.y
            },
            t
          )
        ));
      }
    }), this.initial(h);
  }
}
export {
  c as CanvasScaler
};
