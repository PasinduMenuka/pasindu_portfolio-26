// @ts-nocheck — ported from a standalone plain-JS prototype of this scene; left untyped rather than annotating ~550 lines of shader plumbing.
/**
 * The home hero's WebGL scene: animated contour backdrop plus the portrait, which arrives as a
 * cyan blueprint of itself, burns away crown-to-chin, and afterwards shows the blueprint only
 * along the cursor's recent path. Written against three r152 (encodings_fragment, sync compile).
 */
import * as THREE from "three";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CAP_60 = 1000 / 60 - 2;
const getSceneTier = () => {
  const coarse = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const width = innerWidth;
  const name = width < 768 || (coarse && width < 1024) ? "mobile" : coarse || width < 1280 ? "tablet" : "desktop";
  const mobile = name === "mobile";
  const nav = navigator;
  const saver = Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 8) <= 2;
  return {
    name, mobile, coarsePointer: coarse, reducedMotion: reduced(),
    maxDpr: mobile ? 1 : name === "tablet" ? 1.25 : 1.5,
    frameInterval: name === "desktop" ? 0 : CAP_60,
    pointerEnabled: !coarse && !reduced(),
    antialias: name === "desktop",
    trailSamples: mobile ? 28 : name === "tablet" ? 44 : 72,
    outline: !mobile, reveal: !mobile,
    freeze: reduced() || (mobile && saver),
  };
};

/* =========================================================
   The scene: contour backdrop + the portrait.
   The portrait arrives as a cyan blueprint of itself, burns away
   crown-to-chin, and after that the blueprint exists only along the
   cursor's recent path.
   ========================================================= */
const readToken = (root, token) => {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  root.appendChild(probe);
  const v = getComputedStyle(probe).color; probe.remove(); return v;
};

const DEFAULT_PARAMS = {
  subjectParallax: 0.02, riseDistance: 200, riseDuration: 2,
  headParallax: 0.012, headRelight: 0.32,
  trailRadius: 0.46, trailIdleScale: 0.28, trailTaper: 1.9, trailTaperIdle: 1.6, trailTaperFast: 1.25,
  trailLength: 0.64, revealThreshold: 0.08, revealEdge: 0.005, revealWarp: 1.29, revealWarpScale: 2.9,
  revealSpeed: 1.25, pointerLerp: 0.17, pacePeak: 0.029, paceAttack: 0.09, paceRelease: 0.205,
  paceThreshold: 0.06, paceRamp: 0.15,
  outlinePeriod: 3.1, outlineStagger: 1.2, outlineOpacity: 0.09, outlineWidth: 0.15, outlineLightness: 0.64,
  sweepWarp: 0.86, sweepLength: 0.67, sweepRadius: 0.33,
  bgLineScale: 3.8, bgLineCount: 2.5, bgLineThickness: 1.4, bgLineOpacity: 0.85, bgWaveAmount: 0.37, bgWaveSpeed: 1.66,
  bgRevealLightness: 0.62, bgRevealLightnessAlt: 0.44, bgRevealOpacity: 1,
  introDuration: 4, burnStart: 0.14, burnSoftness: 0.02, burnGlow: 4,
  autoSweepAmount: 0, autoSweepPeriod: 5, autoSweepStroke: 0.45, autoSweepHold: 0,
};
const STATIC_POSE = { x: 0.3, y: 0.1 };
const CAMERA_FOV = 35, CAMERA_Z = 6.5;
const EXTEND = 0.06; // plane grown below the portrait so the suit runs off the frame
const AUTO_SWEEP_PATH = [{ x: -0.85, y: -0.62 }, { x: 0.78, y: -0.2 }, { x: -0.7, y: 0.2 }, { x: 0.82, y: 0.6 }];

const revealTrailFunction = (name, trail, bMin, bMax, pace, warp, length, radius, samples) => `
  float ${name}(vec2 ndc) {
    float gate = smoothstep(uGateStart, uGateStart + uGateWidth, ${pace});
    if (gate <= 0.0) return 0.0;
    vec2 bounded = vec2(ndc.x * uAspect, ndc.y);
    if (any(lessThan(bounded, ${bMin})) || any(greaterThan(bounded, ${bMax}))) return 0.0;
    vec2 point = bounded;
    if (${warp} > 0.001) {
      vec2 noiseUv = ndc * 0.5 + 0.5;
      float nx = texture2D(uNoiseTex, noiseUv * uWarpScale + vec2(uTime * 0.07, uTime * 0.05)).r;
      float ny = texture2D(uNoiseTex, noiseUv * uWarpScale * 1.4 - vec2(uTime * 0.06, uTime * 0.09)).r;
      point += (vec2(nx, ny) - 0.5) * ${warp} * 0.22;
    }
    float radius = ${radius} * mix(uIdleScale, 1.0, ${pace});
    float taper = uTaper * mix(uTaperIdle, uTaperFast, ${pace});
    float span = max(${length} * float(${samples} - 1), 1.0);
    float ceiling = uThreshold + uEdge;
    float acc = 0.0;
    for (int i = 0; i < ${samples} - 1; i++) {
      if (float(i) >= span) break;
      float weight = pow(1.0 - float(i) / span, taper);
      if (weight <= acc) break;
      vec2 a = vec2(${trail}[i].x * uAspect, ${trail}[i].y);
      vec2 b = vec2(${trail}[i + 1].x * uAspect, ${trail}[i + 1].y);
      float r = radius * weight;
      acc = max(acc, weight * smoothstep(r, r * 0.35, revealSegment(point, a, b)));
      if (acc >= ceiling) break;
    }
    return smoothstep(uThreshold - uEdge, uThreshold + uEdge, acc) * gate;
  }
`;
const buildRevealDeclarations = (n) => `
  uniform vec2 uTrail[${n}]; uniform vec2 uTrailMin; uniform vec2 uTrailMax; uniform float uPace;
  uniform vec2 uSweep[${n}]; uniform vec2 uSweepMin; uniform vec2 uSweepMax; uniform float uSweepPace;
  uniform float uSweepWarp; uniform float uSweepLength; uniform float uSweepRadius;
  uniform float uAspect; uniform float uRadius; uniform float uIdleScale; uniform float uTaper;
  uniform float uTaperIdle; uniform float uTaperFast; uniform float uLength; uniform float uGateStart;
  uniform float uGateWidth; uniform float uWarpScale; uniform float uTime; uniform float uEdge;
  uniform float uThreshold; uniform float uWarp; uniform float uRevealMix; uniform sampler2D uNoiseTex;
  float revealSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a; vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
  }
  ${revealTrailFunction("revealCursorTrail", "uTrail", "uTrailMin", "uTrailMax", "uPace", "uWarp", "uLength", "uRadius", n)}
  ${revealTrailFunction("revealSweepTrail", "uSweep", "uSweepMin", "uSweepMax", "uSweepPace", "uSweepWarp", "uSweepLength", "uSweepRadius", n)}
  float revealTrail(vec2 ndc) {
    float cursor = revealCursorTrail(ndc);
    if (cursor >= 1.0) return 1.0;
    return max(cursor, revealSweepTrail(ndc));
  }
`;

const backdropVertex = `
  varying vec4 vClip;
  void main() { vClip = vec4(position.xy * 2.0, 0.0, 1.0); gl_Position = vClip; }
`;
const buildBackdropFragment = (n) => `
  varying vec4 vClip;
  uniform vec3 uBackground; uniform vec3 uLineColor; uniform vec3 uRevealColor; uniform vec3 uRevealColorAlt;
  uniform float uLineScale; uniform float uLineCount; uniform float uLineThickness; uniform float uLineOpacity;
  uniform float uWaveAmount; uniform float uWaveSpeed; uniform float uRevealOpacity; uniform float uClock;
  ${buildRevealDeclarations(n)}
  float backdropField(vec2 p, float t) {
    float f = sin(p.x * 1.00 + t * 0.60) * 0.50;
    f += sin(p.y * 0.85 - t * 0.45) * 0.45;
    f += sin((p.x + p.y) * 0.65 + t * 0.35) * 0.35;
    f += sin((p.x - p.y) * 0.95 - t * 0.55) * 0.25;
    return f * 0.5 + 0.5;
  }
  void main() {
    vec2 ndc = vClip.xy / vClip.w;
    vec2 p = vec2(ndc.x * uAspect, ndc.y) * uLineScale;
    float t = uClock * uWaveSpeed;
    vec2 q = p;
    q.x += sin(p.y * 0.8 + t * 0.7) * uWaveAmount;
    q.y += cos(p.x * 0.7 - t * 0.6) * uWaveAmount;
    float scaled = backdropField(q, t) * uLineCount;
    float w = max(fwidth(scaled) * uLineThickness, 1e-5);
    float line = 1.0 - smoothstep(0.0, w, abs(fract(scaled) - 0.5));
    vec3 color = mix(uBackground, uLineColor, line * uLineOpacity * uRevealMix);
    float parity = mod(floor(scaled + 0.5), 2.0);
    vec3 revealShade = mix(uRevealColor, uRevealColorAlt, parity);
    if (uRevealOpacity > 0.001) color = mix(color, revealShade, revealTrail(ndc) * uRevealMix * uRevealOpacity);
    gl_FragColor = vec4(color, 1.0);
    #include <encodings_fragment>
  }
`;

const portraitVertex = `
  uniform float uExtend;
  varying vec2 vUv; varying vec4 vClip;
  void main() {
    vUv = vec2(uv.x, 1.0 - (1.0 - uv.y) * (1.0 + uExtend));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vClip = gl_Position;
  }
`;
const buildPortraitFragment = (n) => `
  varying vec2 vUv; varying vec4 vClip;
  uniform sampler2D uDiffuse; uniform sampler2D uDepth; uniform sampler2D uNormal;
  uniform vec2 uParallax; uniform vec2 uTexel; uniform float uImageAspect;
  uniform float uReveal; uniform float uDepthScale; uniform float uRelight;
  uniform vec3 uInk; uniform vec3 uAccent; uniform vec3 uForeground;
  uniform float uIntro; uniform float uBurnStart; uniform float uBurnSoft; uniform float uBurnGlow;
  uniform float uClock; uniform float uPeriod; uniform float uStagger; uniform float uWaveOpacity;
  uniform float uWaveWidth; uniform float uWaveLightness; uniform float uOutlineMix;
  ${buildRevealDeclarations(n)}

  float ink(vec2 uv) { vec4 c = texture2D(uDiffuse, uv); return dot(c.rgb, vec3(0.299, 0.587, 0.114)) * c.a + (1.0 - c.a) * 0.6; }

  // Gaussian wave train, crown to chin — the scan that discloses the drawing.
  float scanWave(float height) {
    float width = max(uWaveWidth, 0.0001);
    float start = 1.0 + width * 3.0;
    float travel = 1.0 + width * 6.0;
    float wave = 0.0;
    for (int i = 0; i < 8; i++) {
      float age = mod(uClock, uStagger) + float(i) * uStagger;
      if (age > uPeriod) break;
      float d = (height - (start - (age / uPeriod) * travel)) / width;
      wave = max(wave, exp(-d * d));
    }
    return wave;
  }

  void main() {
    float depth = texture2D(uDepth, vUv).r;
    vec2 uv = vUv + uParallax * (depth - 0.5) * uDepthScale;
    vec4 photo = texture2D(uDiffuse, uv);
    float alpha = photo.a;

    vec3 normal = normalize(texture2D(uNormal, uv).rgb * 2.0 - 1.0);
    vec3 lightDir = normalize(vec3(uParallax * 1.6, 1.0));
    float lambert = max(dot(normal, lightDir), 0.0) - 0.72;
    vec3 lit = clamp(photo.rgb * (1.0 + lambert * uRelight), 0.0, 1.0);

    // Sobel over luminance: the drawing the portrait was made from.
    vec2 o = uTexel * 1.4;
    float tl = ink(uv + vec2(-o.x, o.y)), tc = ink(uv + vec2(0.0, o.y)), tr = ink(uv + o);
    float ml = ink(uv - vec2(o.x, 0.0)), mr = ink(uv + vec2(o.x, 0.0));
    float bl = ink(uv - o), bc = ink(uv - vec2(0.0, o.y)), br = ink(uv + vec2(o.x, -o.y));
    float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
    float gy = (tl + 2.0 * tc + tr) - (bl + 2.0 * bc + br);
    float edge = smoothstep(0.08, 0.42, length(vec2(gx, gy)));

    vec2 gp = vec2(uv.x * uImageAspect, uv.y) * 34.0;
    vec2 gd = abs(fract(gp) - 0.5) / max(fwidth(gp), vec2(1e-4));
    float grid = 1.0 - smoothstep(0.0, 1.0, min(gd.x, gd.y));

    float wave = scanWave(uv.y);
    float tone = dot(photo.rgb, vec3(0.299, 0.587, 0.114));
    vec3 blueprint = mix(uInk, uAccent, 0.04 + tone * 0.22);
    blueprint += uAccent * grid * 0.1;
    blueprint = mix(blueprint, mix(uAccent, vec3(1.0), 0.35 + wave * 0.5), edge);

    vec2 ndc = vClip.xy / vClip.w;
    float burnFront = smoothstep(uBurnStart, 1.0, uIntro);
    float burnNoise = texture2D(uNoiseTex, ndc * 0.5 + 0.5).r;
    float burnHeight = 1.0 - (ndc.y * 0.5 + 0.5);
    float burnAt = mix(burnHeight, burnNoise, 0.45);
    float intact = smoothstep(burnFront - uBurnSoft, burnFront + uBurnSoft, burnAt);

    float mask = max(revealTrail(ndc), intact) * uRevealMix;
    vec3 color = mix(lit, blueprint, mask);
    color += uAccent * 4.0 * intact * (1.0 - intact) * uBurnGlow * uRevealMix;

    // Outside the blueprint, the scan still traces the drawing faintly over the photograph.
    vec3 stroke = mix(uForeground, vec3(1.0), uWaveLightness);
    color = mix(color, stroke, edge * wave * uWaveOpacity * uOutlineMix * (1.0 - mask));

    gl_FragColor = vec4(clamp(color, 0.0, 4.0), alpha * uReveal);
    #include <encodings_fragment>
  }
`;

/** Depth and normals from the cut-out's own alpha — a soft dome that reads as volume under the relight. */
const deriveMaps = (image) => {
  const w = 192, h = Math.round(192 * image.height / image.width);
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, w, h);
  const src = ctx.getImageData(0, 0, w, h).data;
  let d = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = src[i * 4 + 3] / 255;
    const l = (src[i * 4] * 0.299 + src[i * 4 + 1] * 0.587 + src[i * 4 + 2] * 0.114) / 255;
    d[i] = a * (0.85 + 0.15 * l);
  }
  const blur = (arr, r) => {
    const out = new Float32Array(arr.length), tmp = new Float32Array(arr.length);
    for (let y = 0; y < h; y++) { let acc = 0; for (let x = -r; x <= r; x++) acc += arr[y * w + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) { tmp[y * w + x] = acc / (2 * r + 1); acc += arr[y * w + Math.min(w - 1, x + r + 1)] - arr[y * w + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let acc = 0; for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) { out[y * w + x] = acc / (2 * r + 1); acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; } }
    return out;
  };
  for (let k = 0; k < 3; k++) d = blur(d, 6);
  const depthCanvas = document.createElement("canvas"); depthCanvas.width = w; depthCanvas.height = h;
  const normalCanvas = document.createElement("canvas"); normalCanvas.width = w; normalCanvas.height = h;
  const dImg = depthCanvas.getContext("2d").createImageData(w, h);
  const nImg = normalCanvas.getContext("2d").createImageData(w, h);
  const at = (x, y) => d[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  const strength = 6;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, v = at(x, y);
    dImg.data[i] = dImg.data[i + 1] = dImg.data[i + 2] = v * 255; dImg.data[i + 3] = 255;
    let nx = -(at(x + 1, y) - at(x - 1, y)) * strength;
    let ny = (at(x, y + 1) - at(x, y - 1)) * strength; // canvas y runs down; the texture flips it
    const len = Math.hypot(nx, ny, 1);
    nImg.data[i] = (nx / len * 0.5 + 0.5) * 255;
    nImg.data[i + 1] = (ny / len * 0.5 + 0.5) * 255;
    nImg.data[i + 2] = (1 / len * 0.5 + 0.5) * 255;
    nImg.data[i + 3] = 255;
  }
  depthCanvas.getContext("2d").putImageData(dImg, 0, 0);
  normalCanvas.getContext("2d").putImageData(nImg, 0, 0);
  return [new THREE.CanvasTexture(depthCanvas), new THREE.CanvasTexture(normalCanvas)];
};

/** Tiling value-noise, standing in for the burn/warp noise texture. */
const makeNoise = () => {
  const size = 256, c = document.createElement("canvas"); c.width = c.height = size;
  const ctx = c.getContext("2d"), img = ctx.createImageData(size, size);
  const hash = (x, y, p) => { let h = Math.imul(((x % p) + p) % p, 374761393) + Math.imul(((y % p) + p) % p, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const smooth = (t) => t * t * (3 - 2 * t);
  const vnoise = (x, y, p) => { const xi = Math.floor(x), yi = Math.floor(y), xf = smooth(x - xi), yf = smooth(y - yi);
    const a = hash(xi, yi, p), b = hash(xi + 1, yi, p), c2 = hash(xi, yi + 1, p), d = hash(xi + 1, yi + 1, p);
    return a + (b - a) * xf + (c2 - a) * yf + (a - b - c2 + d) * xf * yf; };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let v = 0, amp = 0.5, total = 0;
    for (let o = 0, p = 8; o < 4; o++, p *= 2) { v += vnoise(x / size * p, y / size * p, p) * amp; total += amp; amp *= 0.5; }
    const i = (y * size + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = (v / total) * 255; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
};

export class HeroScene {
  /** The device tier (see getSceneTier); re-read by retune(). */
  tier: ReturnType<typeof getSceneTier>;
  /** Fired once every texture is uploaded and every program compiled. */
  onReady: (() => void) | null;

  constructor(canvas: HTMLCanvasElement, root: HTMLElement, portrait: string) {
    this.root = root; this.portraitUrl = portrait;
    this.tier = getSceneTier();
    this.samples = this.tier.trailSamples;
    this.params = { ...DEFAULT_PARAMS };
    this.pointer = { x: 0, y: 0 }; this.smoothed = { x: 0, y: 0 }; this.lastSmoothed = { x: 0, y: 0 };
    this.pointerSeen = false; this.pace = 0;
    this.sweepPointer = { ...AUTO_SWEEP_PATH[0] }; this.sweepSmoothed = { ...this.sweepPointer };
    this.sweepLast = { ...this.sweepPointer }; this.sweepPace = 0; this.sweepCycle = 0;
    this.trail = Array.from({ length: this.samples }, () => new THREE.Vector2(STATIC_POSE.x, -STATIC_POSE.y));
    this.sweepTrail = Array.from({ length: this.samples }, () => new THREE.Vector2(AUTO_SWEEP_PATH[0].x, -AUTO_SWEEP_PATH[0].y));
    this.intro = 0; this.ready = false; this.readyAt = null;
    this.riseStarted = false; this.riseAt = null; this.startTime = null; this.settled = false;
    this.box = null; this.width = 1; this.height = 1; this.aspect = 1;
    this.onReady = null;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: this.tier.antialias, stencil: false,
      powerPreference: this.tier.mobile ? "default" : "high-performance" });
    this.renderer.setClearColor(new THREE.Color(readToken(root, "--background")));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.tier.maxDpr));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 50);
    this.camera.position.set(0, 0, CAMERA_Z);
    if (!this.tier.pointerEnabled) this.parkPointer();
  }

  parkPointer() {
    this.pointer = { ...STATIC_POSE }; this.smoothed = { ...STATIC_POSE }; this.lastSmoothed = { ...STATIC_POSE };
    this.pointerSeen = false;
  }
  retune() {
    const prev = this.tier;
    this.tier = { ...getSceneTier(), antialias: prev.antialias, trailSamples: prev.trailSamples };
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.tier.maxDpr));
    if (!this.tier.pointerEnabled) this.parkPointer(); else if (!prev.pointerEnabled) this.pointerSeen = false;
    if (!this.tier.freeze) this.settled = false;
    return this.tier;
  }
  beginRise() { this.riseStarted = true; }
  setPointer(x, y) {
    this.pointer.x = x; this.pointer.y = y;
    if (!this.pointerSeen) {
      this.pointerSeen = true;
      this.smoothed = { x, y }; this.lastSmoothed = { x, y };
    }
  }
  setParams(partial) { Object.assign(this.params, partial); this.settled = false; }
  /** The portrait's box in canvas pixels; null means "the whole canvas". */
  setBox(box) { this.box = box; this.settled = false; }
  resize(w, h) {
    this.renderer.setSize(w, h, false);
    this.width = Math.max(w, 1); this.height = Math.max(h, 1); this.aspect = this.width / this.height;
    this.camera.aspect = this.aspect; this.camera.updateProjectionMatrix();
    this.settled = false;
  }

  async load() {
    const image = await new Promise((resolve, reject) => {
      const img = new Image(); img.decoding = "async";
      img.onload = () => resolve(img); img.onerror = () => reject(new Error(`Failed to load ${this.portraitUrl}`));
      img.src = this.portraitUrl;
    });
    if (this.disposed) return;
    const diffuse = new THREE.Texture(image);
    diffuse.colorSpace = THREE.SRGBColorSpace; diffuse.needsUpdate = true;
    diffuse.minFilter = THREE.LinearMipmapLinearFilter; diffuse.generateMipmaps = true;
    diffuse.anisotropy = 4;
    const [depth, normal] = deriveMaps(image);
    const noise = makeNoise();
    this.imageAspect = image.width / image.height;

    const n = this.samples;
    this.ru = {
      uTrail: { value: this.trail }, uTrailMin: { value: new THREE.Vector2(-1e3, -1e3) }, uTrailMax: { value: new THREE.Vector2(1e3, 1e3) },
      uSweep: { value: this.sweepTrail }, uSweepMin: { value: new THREE.Vector2(-1e3, -1e3) }, uSweepMax: { value: new THREE.Vector2(1e3, 1e3) },
      uSweepPace: { value: 0 }, uSweepWarp: { value: 0 }, uSweepLength: { value: 0 }, uSweepRadius: { value: 0 },
      uAspect: { value: 1 }, uRadius: { value: 0 }, uIdleScale: { value: 0 }, uTaper: { value: 0 }, uTaperIdle: { value: 0 },
      uTaperFast: { value: 0 }, uLength: { value: 0 }, uPace: { value: 0 }, uGateStart: { value: 0 }, uGateWidth: { value: 0 },
      uWarpScale: { value: 0 }, uTime: { value: 0 }, uThreshold: { value: 0 }, uEdge: { value: 0 }, uWarp: { value: 0 },
      uRevealMix: { value: 1 }, uNoiseTex: { value: noise },
    };

    this.backdropMaterial = new THREE.ShaderMaterial({
      vertexShader: backdropVertex, fragmentShader: buildBackdropFragment(n), depthWrite: false, depthTest: false,
      uniforms: { ...this.ru,
        uBackground: { value: new THREE.Color(readToken(this.root, "--background")) },
        uLineColor: { value: new THREE.Color(readToken(this.root, "--surface-soft")) },
        uRevealColor: { value: new THREE.Color().setScalar(this.params.bgRevealLightness) },
        uRevealColorAlt: { value: new THREE.Color().setScalar(this.params.bgRevealLightnessAlt) },
        uLineScale: { value: 0 }, uLineCount: { value: 0 }, uLineThickness: { value: 0 }, uLineOpacity: { value: 0 },
        uWaveAmount: { value: 0 }, uWaveSpeed: { value: 0 }, uRevealOpacity: { value: 0 }, uClock: { value: 0 } },
    });
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.backdropMaterial);
    backdrop.frustumCulled = false; backdrop.renderOrder = -1;
    this.scene.add(backdrop);

    this.portraitMaterial = new THREE.ShaderMaterial({
      vertexShader: portraitVertex, fragmentShader: buildPortraitFragment(n), transparent: true, depthTest: false, depthWrite: false,
      uniforms: { ...this.ru,
        uDiffuse: { value: diffuse }, uDepth: { value: depth }, uNormal: { value: normal },
        uParallax: { value: new THREE.Vector2() }, uTexel: { value: new THREE.Vector2(1 / image.width, 1 / image.height) },
        uImageAspect: { value: this.imageAspect }, uReveal: { value: 1 }, uDepthScale: { value: 0 }, uRelight: { value: 0 },
        uExtend: { value: EXTEND },
        uInk: { value: new THREE.Color(readToken(this.root, "--surface-dark")) },
        uAccent: { value: new THREE.Color(readToken(this.root, "--accent")) },
        uForeground: { value: new THREE.Color(readToken(this.root, "--foreground")) },
        uIntro: { value: 0 }, uBurnStart: { value: 0 }, uBurnSoft: { value: 0 }, uBurnGlow: { value: 0 },
        uClock: { value: 0 }, uPeriod: { value: 1 }, uStagger: { value: 1 }, uWaveOpacity: { value: 0 },
        uWaveWidth: { value: 0.15 }, uWaveLightness: { value: 0 }, uOutlineMix: { value: 0 } },
    });
    this.portrait = new THREE.Mesh(new THREE.PlaneGeometry(this.imageAspect, 1 + EXTEND), this.portraitMaterial);
    this.portrait.renderOrder = 1;
    this.scene.add(this.portrait);

    for (const t of [diffuse, depth, normal, noise]) this.renderer.initTexture(t);
    this.renderer.compile(this.scene, this.camera);
    this.update(performance.now());
    if (this.disposed) return;
    this.ready = true;
    this.onReady?.();
  }

  dispose() {
    this.disposed = true;
    this.scene.traverse((object) => {
      object.geometry?.dispose();
      const material = object.material;
      if (!material) return;
      for (const uniform of Object.values(material.uniforms ?? {})) if (uniform.value?.isTexture) uniform.value.dispose();
      material.dispose();
    });
    this.renderer.dispose();
  }

  burnProgress() {
    const p = this.params, span = Math.max(1 - p.burnStart, 1e-4);
    const x = Math.min(1, Math.max(0, (this.intro - p.burnStart) / span));
    return x * x * (3 - 2 * x);
  }
  resetSweep() {
    const a = this.params.autoSweepAmount, x = AUTO_SWEEP_PATH[0].x * a, y = AUTO_SWEEP_PATH[0].y * a;
    this.sweepPointer = { x, y }; this.sweepSmoothed = { x, y }; this.sweepLast = { x, y }; this.sweepPace = 0;
    for (const s of this.sweepTrail) s.set(x, -y);
  }
  writeBounds(trail, length, warp, radius, min, max) {
    const active = Math.min(trail.length, Math.ceil(length * (this.samples - 1)) + 1);
    const margin = radius + warp * 0.22 + 0.05;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < active; i++) { const x = trail[i].x * this.aspect, y = trail[i].y;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    min.set(x0 - margin, y0 - margin); max.set(x1 + margin, y1 + margin);
  }

  update(time) {
    if (this.disposed || this.settled || !this.portrait) return;
    if (this.startTime === null) this.startTime = time;
    const t = (time - this.startTime) / 1000, p = this.params;
    if (this.tier.freeze && this.intro >= 1) this.settled = true;

    // Idle sweep — a second cursor, for screens with none.
    const autoEnabled = p.autoSweepAmount > 0 && !this.tier.freeze && this.intro >= 1;
    if (autoEnabled) {
      const cycle = t % Math.max(p.autoSweepPeriod, 0.001);
      if (cycle < this.sweepCycle) this.resetSweep();
      this.sweepCycle = cycle;
      const legs = AUTO_SWEEP_PATH.length - 1, stroke = Math.max(p.autoSweepStroke, 0.05);
      const slot = stroke + Math.max(p.autoSweepHold, 0), leg = Math.floor(cycle / slot);
      if (leg < legs) {
        const local = Math.min(1, (cycle - leg * slot) / stroke), eased = 1 - (1 - local) * (1 - local);
        const from = AUTO_SWEEP_PATH[leg], to = AUTO_SWEEP_PATH[leg + 1];
        this.sweepPointer.x = (from.x + (to.x - from.x) * eased) * p.autoSweepAmount;
        this.sweepPointer.y = (from.y + (to.y - from.y) * eased) * p.autoSweepAmount;
      }
    }
    this.sweepSmoothed.x += (this.sweepPointer.x - this.sweepSmoothed.x) * p.pointerLerp;
    this.sweepSmoothed.y += (this.sweepPointer.y - this.sweepSmoothed.y) * p.pointerLerp;
    const sweepStep = Math.hypot(this.sweepSmoothed.x - this.sweepLast.x, this.sweepSmoothed.y - this.sweepLast.y);
    const sweepTarget = autoEnabled ? Math.min(1, sweepStep / p.pacePeak) : 0;
    this.sweepPace += (sweepTarget - this.sweepPace) * (sweepTarget > this.sweepPace ? p.paceAttack : p.paceRelease);
    this.sweepLast = { ...this.sweepSmoothed };
    const os = this.sweepTrail.pop(); os.set(this.sweepSmoothed.x, -this.sweepSmoothed.y); this.sweepTrail.unshift(os);

    this.smoothed.x += (this.pointer.x - this.smoothed.x) * p.pointerLerp;
    this.smoothed.y += (this.pointer.y - this.smoothed.y) * p.pointerLerp;

    if (this.ready && this.riseStarted) {
      if (this.readyAt === null) this.readyAt = t;
      this.intro = Math.min(1, (t - this.readyAt) / p.introDuration);
      if (this.tier.freeze) this.intro = 1;
    }

    // Place the portrait in its box: pixels → world at the plane's depth.
    const worldPerPx = (2 * CAMERA_Z * Math.tan((CAMERA_FOV * Math.PI) / 360)) / this.height;
    // Full-bleed: centred, nudged 4% right so the surname clears the shoulder.
    const box = this.box ?? { left: this.width * 0.04, top: this.height * 0.07, width: this.width, height: this.height * 0.93 };
    const planeH = box.height * worldPerPx;
    const cx = (box.left + box.width / 2 - this.width / 2) * worldPerPx;
    const cy = (this.height / 2 - (box.top + box.height * (1 + EXTEND) / 2)) * worldPerPx;
    let remaining = 0;
    if (!this.tier.freeze) {
      remaining = 1;
      if (this.riseStarted) {
        if (this.riseAt === null) this.riseAt = t;
        const u = Math.min(1, (t - this.riseAt) / p.riseDuration);
        remaining = (1 - u) * (1 - u);
      }
    }
    this.portrait.scale.setScalar(planeH);
    this.portrait.position.set(
      cx + this.smoothed.x * p.subjectParallax,
      cy - this.smoothed.y * p.subjectParallax - remaining * p.riseDistance * worldPerPx, 0);

    // Pace — eased pointer speed; it gates the whole reveal.
    const step = Math.hypot(this.smoothed.x - this.lastSmoothed.x, this.smoothed.y - this.lastSmoothed.y);
    if (this.tier.pointerEnabled) {
      const target = Math.min(1, step / p.pacePeak);
      this.pace += (target - this.pace) * (target > this.pace ? p.paceAttack : p.paceRelease);
    } else if (!autoEnabled && this.intro >= 1 && this.tier.reveal) this.pace = 1;
    else if (!this.tier.reveal) this.pace = 0;
    this.lastSmoothed = { ...this.smoothed };
    const oldest = this.trail.pop(); oldest.set(this.smoothed.x, -this.smoothed.y); this.trail.unshift(oldest);

    const r = this.ru;
    r.uAspect.value = this.aspect; r.uRadius.value = p.trailRadius; r.uIdleScale.value = p.trailIdleScale;
    r.uTaper.value = p.trailTaper; r.uTaperIdle.value = p.trailTaperIdle; r.uTaperFast.value = p.trailTaperFast;
    r.uLength.value = p.trailLength; r.uPace.value = this.pace; r.uGateStart.value = p.paceThreshold;
    r.uGateWidth.value = p.paceRamp; r.uWarpScale.value = p.revealWarpScale; r.uTime.value = t * p.revealSpeed;
    r.uThreshold.value = p.revealThreshold; r.uEdge.value = p.revealEdge; r.uWarp.value = p.revealWarp;
    r.uSweepPace.value = this.sweepPace; r.uSweepWarp.value = p.sweepWarp; r.uSweepLength.value = p.sweepLength;
    r.uSweepRadius.value = p.sweepRadius;
    this.writeBounds(this.trail, p.trailLength, p.revealWarp, p.trailRadius, r.uTrailMin.value, r.uTrailMax.value);
    this.writeBounds(this.sweepTrail, p.sweepLength, p.sweepWarp, p.sweepRadius, r.uSweepMin.value, r.uSweepMax.value);

    const b = this.backdropMaterial.uniforms;
    b.uLineScale.value = p.bgLineScale; b.uLineCount.value = p.bgLineCount; b.uLineThickness.value = p.bgLineThickness;
    b.uLineOpacity.value = p.bgLineOpacity; b.uWaveAmount.value = p.bgWaveAmount; b.uWaveSpeed.value = p.bgWaveSpeed;
    b.uRevealOpacity.value = p.bgRevealOpacity; b.uClock.value = t;

    const u = this.portraitMaterial.uniforms;
    u.uParallax.value.set(this.smoothed.x, -this.smoothed.y);
    u.uDepthScale.value = p.headParallax; u.uRelight.value = p.headRelight;
    u.uIntro.value = this.intro; u.uBurnStart.value = p.burnStart; u.uBurnSoft.value = p.burnSoftness; u.uBurnGlow.value = p.burnGlow;
    u.uClock.value = t; u.uPeriod.value = p.outlinePeriod; u.uStagger.value = p.outlineStagger;
    u.uWaveOpacity.value = this.tier.outline ? p.outlineOpacity : 0; u.uWaveWidth.value = p.outlineWidth;
    u.uWaveLightness.value = p.outlineLightness; u.uOutlineMix.value = this.burnProgress();

    this.renderer.render(this.scene, this.camera);
  }
}


export { DEFAULT_PARAMS, getSceneTier };
