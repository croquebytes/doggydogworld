/* Sprite helper for Dog Treat Tycoon
   Handles simple sprite-sheet animations without external deps.
*/
(function (global) {
  class Sprite {
    constructor(options) {
      this.frameWidth = options.frameWidth;
      this.frameHeight = options.frameHeight;
      this.scale = options.scale || 1;
      this.states = options.states || {};
      this.current = options.initialState || Object.keys(this.states)[0] || null;
      this.loop = true;
      this.frame = 0;
      this.accumulator = 0;
      this.onComplete = null;
      this.ready = false;

      if (options.image instanceof Image) {
        this.image = options.image;
        this.ready = options.image.complete && options.image.naturalWidth > 0;
        if (!this.ready) {
          this.image.onload = () => {
            this.ready = true;
            if (typeof options.onReady === "function") options.onReady();
          };
        } else if (typeof options.onReady === "function") {
          options.onReady();
        }
      } else {
        this.image = new Image();
        if (options.src) {
          this.image.onload = () => {
            this.ready = true;
            if (typeof options.onReady === "function") options.onReady();
          };
          this.image.src = options.src;
        }
      }
    }

    play(state, opts = {}) {
      if (!this.states[state]) return;
      if (this.current !== state || opts.reset) {
        this.current = state;
        this.frame = 0;
        this.accumulator = 0;
      }
      const cfg = this.states[state];
      let loopSetting = true;
      if (typeof opts.loop !== "undefined") {
        loopSetting = opts.loop;
      } else if (cfg && typeof cfg.loop !== "undefined") {
        loopSetting = cfg.loop;
      }
      this.loop = loopSetting;
      this.onComplete = typeof opts.onComplete === "function" ? opts.onComplete : null;
      if (cfg.once) this.loop = false;
    }

    update(dt) {
      if (!this.current) return;
      const cfg = this.states[this.current];
      if (!cfg || cfg.frames <= 0) return;

      const fps = cfg.fps || 6;
      const frameStep = 1 / fps;
      this.accumulator += dt;

      while (this.accumulator >= frameStep) {
        this.accumulator -= frameStep;
        this.frame++;
        if (this.frame >= cfg.frames) {
          if (this.loop) {
            this.frame = cfg.frames > 0 ? this.frame % cfg.frames : 0;
          } else {
            this.frame = cfg.frames - 1;
            if (typeof this.onComplete === "function") this.onComplete();
            const next = cfg.next || "idle";
            if (next && this.states[next]) {
              this.play(next, { reset: true });
            }
            break;
          }
        }
      }
    }

    draw(ctx, x = 0, y = 0, scale = this.scale) {
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      const fw = this.frameWidth;
      const fh = this.frameHeight;
      const cfg = this.states[this.current];

      ctx.clearRect(x, y, fw * scale, fh * scale);

      if (!cfg || !this.ready || this.image.width === 0) {
        this.drawPlaceholder(ctx, x, y, scale);
        return;
      }

      const frameIdx = Math.min(this.frame, cfg.frames - 1);
      const sx = frameIdx * fw;
      const sy = (cfg.row || 0) * fh;

      if (sx + fw > this.image.width || sy + fh > this.image.height) {
        this.drawPlaceholder(ctx, x, y, scale);
        return;
      }

      ctx.drawImage(
        this.image,
        sx,
        sy,
        fw,
        fh,
        x,
        y,
        fw * scale,
        fh * scale
      );
    }

    drawPlaceholder(ctx, x, y, scale) {
      const fw = this.frameWidth * scale;
      const fh = this.frameHeight * scale;
      ctx.fillStyle = "#1f1f27";
      ctx.fillRect(x, y, fw, fh);
      ctx.strokeStyle = "#5ec8f8";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, fw - 2, fh - 2);
      ctx.fillStyle = "#ffb74d";
      ctx.fillRect(x + fw * 0.35, y + fh * 0.25, fw * 0.3, fh * 0.3);
    }
  }

  global.Sprite = Sprite;
})(window);
