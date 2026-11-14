// Endless runner engine (canvas 2D). Original pixel character, Chrome-dino-style mechanics.
const SPR = {
  stand: ['....##....', '....##....', '.########.', '##########', '##.####.##', '##########', '.########.', '..######..', '.########.', '#.######.#', '..######..'],
  legA: ['..##..##..', '..##......'],
  legB: ['..##..##..', '......##..'],
  legJ: ['..##..##..', '..##..##..'],
  duck: ['....##......', '.##########.', '############', '##.######.##', '############', '.##########.'],
  dlegA: ['..##....##..', '..##........'],
  dlegB: ['..##....##..', '........##..'],
  bug: ['#..##..#', '.#.##.#.', '..####..', '.######.', '########', '.######.', '..#..#..', '..#..#..'],
  flyA: ['#........#', '##......##', '.##.##.##.', '..######..', '...####...'],
  flyB: ['...####...', '..######..', '.##.##.##.', '##......##', '#........#'],
};

type Obstacle = { t: 'b' | 'f'; x: number; y: number; w: number; h: number; s?: number; n?: number };
type Star = { x: number; y: number; s: number };

export type RunnerHooks = {
  onScore: (score: number) => void;
  onOver: (score: number) => void;
};

const PX = 60; // player x
const SCALE = 4;

export class RunnerGame {
  private cx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private gnd = 0;
  private running = false;
  private visible = true;
  private last = 0;
  private raf = 0;
  private y = 0;
  private vy = 0;
  private speed = 320;
  private dist = 0;
  private gap = 380;
  private duckKey = false;
  private obstacles: Obstacle[] = [];
  private stars: Star[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private arena: HTMLElement,
    private hooks: RunnerHooks,
  ) {
    this.cx = canvas.getContext('2d')!;
    this.reset();
    this.draw();
  }

  get isRunning() {
    return this.running;
  }

  setVisible(v: boolean) {
    this.visible = v;
  }

  setDuck(d: boolean) {
    this.duckKey = d;
  }

  resize() {
    const dp = Math.min(window.devicePixelRatio || 1, 2);
    this.W = this.arena.clientWidth;
    this.H = this.arena.clientHeight;
    this.canvas.width = this.W * dp;
    this.canvas.height = this.H * dp;
    this.cx.setTransform(dp, 0, 0, dp, 0, 0);
    this.gnd = this.H - 58;
    if (!this.running) {
      this.y = this.gnd;
      this.draw();
    }
  }

  reset() {
    this.resize();
    this.y = this.gnd;
    this.vy = 0;
    this.speed = 320;
    this.dist = 0;
    this.gap = 380;
    this.duckKey = false;
    this.obstacles = [];
    this.stars = Array.from({ length: 18 }, () => ({
      x: Math.random() * this.W,
      y: Math.random() * (this.gnd - 30),
      s: Math.random() * 1.6 + 0.4,
    }));
  }

  start() {
    this.reset();
    this.hooks.onScore(0);
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  jump() {
    if (this.running && this.y >= this.gnd - 1) this.vy = -760;
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private ducking() {
    return this.duckKey && this.y >= this.gnd;
  }

  private box() {
    const d = this.ducking();
    const w = d ? 48 : 40;
    const h = d ? 24 : 52;
    return { x1: PX + 5, x2: PX + w - 5, y1: this.y - h + 5, y2: this.y - 3 };
  }

  private loop = (n: number) => {
    if (!this.running) return;
    const dt = Math.min((n - this.last) / 1000, 0.04);
    this.last = n;
    if (this.visible) this.step(dt);
    if (this.running) {
      this.draw();
      this.raf = requestAnimationFrame(this.loop);
    }
  };

  private step(dt: number) {
    const { W, gnd } = this;
    this.speed = Math.min(720, this.speed + 12 * dt);
    this.dist += this.speed * dt;
    this.vy += (this.duckKey && this.y < gnd ? 5200 : 2200) * dt;
    this.y += this.vy * dt;
    if (this.y > gnd) {
      this.y = gnd;
      this.vy = 0;
    }
    for (const s of this.stars) {
      s.x -= this.speed * dt * s.s * 0.12;
      if (s.x < 0) {
        s.x = W;
        s.y = Math.random() * (gnd - 30);
      }
    }
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i];
      o.x -= this.speed * dt + (o.t === 'f' ? 70 * dt : 0);
      if (o.x + o.w < -10) this.obstacles.splice(i, 1);
    }
    const l = this.obstacles[this.obstacles.length - 1];
    if (!l || l.x < W - this.gap) {
      if (this.dist > 3000 && Math.random() < 0.28) {
        const hi = Math.random() < 0.5;
        this.obstacles.push({ t: 'f', x: W + 20, w: 40, h: 20, y: hi ? gnd - 52 : gnd - 22 });
      } else {
        const s = Math.random() < 0.5 ? 4 : 5;
        const n = 1 + Math.floor(Math.random() * (this.dist > 1500 ? 3 : 2));
        const w = n * (8 * s + 4) - 4;
        this.obstacles.push({ t: 'b', x: W + 20, w, h: 8 * s, y: gnd - 8 * s, s, n });
      }
      this.gap = 330 + Math.random() * 320 + this.speed * 0.3;
    }
    const b = this.box();
    for (const o of this.obstacles) {
      if (b.x2 > o.x + 3 && b.x1 < o.x + o.w - 3 && b.y2 > o.y + 3 && b.y1 < o.y + o.h - 3) {
        this.over();
        return;
      }
    }
    this.hooks.onScore(Math.floor(this.dist / 10));
  }

  private over() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.draw();
    this.hooks.onOver(Math.floor(this.dist / 10));
  }

  private spr(rows: string[], x: number, y: number, s: number) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) if (row[c] === '#') this.cx.fillRect(x + c * s, y + r * s, s, s);
    }
  }

  private draw() {
    const { cx, W, H, gnd } = this;
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = '#a09a8f';
    for (const s of this.stars) {
      cx.globalAlpha = 0.2 + s.s * 0.2;
      cx.fillRect(s.x, s.y, s.s, s.s);
    }
    cx.globalAlpha = 1;
    cx.strokeStyle = '#6f6a62';
    cx.lineWidth = 1;
    cx.beginPath();
    cx.moveTo(0, gnd + 0.5);
    cx.lineTo(W, gnd + 0.5);
    cx.stroke();
    cx.fillStyle = '#403c37';
    const off = this.dist % 48;
    for (let x = -off; x < W; x += 48) {
      cx.fillRect(x, gnd + 9, 18, 1.5);
      cx.fillRect(x + 26, gnd + 18, 8, 1.5);
    }
    const fr = Math.floor(this.dist / 36) % 2;
    cx.fillStyle = '#e0865a';
    for (const o of this.obstacles) {
      if (o.t === 'b') for (let k = 0; k < o.n!; k++) this.spr(SPR.bug, o.x + k * (8 * o.s! + 4), o.y, o.s!);
      else this.spr(fr ? SPR.flyA : SPR.flyB, o.x, o.y, 4);
    }
    cx.fillStyle = '#ebe6dc';
    const air = this.y < gnd - 1;
    if (this.ducking()) this.spr(SPR.duck.concat(fr ? SPR.dlegA : SPR.dlegB), PX, this.y - 32, SCALE);
    else this.spr(SPR.stand.concat(air ? SPR.legJ : this.running ? (fr ? SPR.legA : SPR.legB) : SPR.legJ), PX, this.y - 52, SCALE);
  }
}
