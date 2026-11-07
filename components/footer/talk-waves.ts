// @ts-nocheck — imperative WebGL scene, kept untyped like hero-scene.ts.
/**
 * "Let's talk" footer background: silk-like liquid waves, light trails gliding along their crests,
 * and a particle mesh riding the same swell. All motion is GLSL vertex displacement driven by one
 * shared wave field; GSAP owns the clock (ticker), pointer smoothing and the intro fade.
 *
 * Colours are read from the site's CSS tokens at runtime, so the scene never carries its own palette:
 * --e-blue, --e-blue-deep, --e-blue-light, --e-ink, --e-on-blue-soft (+ white, the type colour).
 * The section's own blue gradient stays the ground; the canvas is transparent over it.
 */
import * as THREE from "three";
import { gsap } from "gsap";

const readColor = (el, token, fallback) => {
  const v = getComputedStyle(el).getPropertyValue(token).trim();
  return new THREE.Color(v || fallback);
};

/* One wave field shared by every layer, so ribbons, trails and particles move as one body of water.
   p.x runs across the screen, `lane` picks a ribbon's baseline/slope, uMouse adds a soft swell. */
const WAVE_GLSL = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;      // pointer, in scene units
  uniform float uMouseAmp;  // 0..1, eased by GSAP
  uniform float uAspect;

  float swell(float x, float t, float seed) {
    return 0.20 * sin(x * 1.15 + t * 0.32 + seed)
         + 0.11 * sin(x * 2.35 - t * 0.46 + seed * 1.7)
         + 0.05 * sin(x * 4.10 + t * 0.71 + seed * 2.9);
  }

  // Centre line of a ribbon: a diagonal baseline plus the swell, nudged by the pointer.
  float centreY(float x, float t, vec3 lane) {
    float y = lane.x + lane.y * x + swell(x, t, lane.z);
    float d = distance(vec2(x, y), uMouse);
    y += uMouseAmp * 0.16 * exp(-d * d / 0.18) * sign(y - uMouse.y + 0.0001);
    return y;
  }
`;

/* ---------- silk ribbons: many fine lines twisting around a centre line ---------- */
const silkVertex = /* glsl */ `
  ${WAVE_GLSL}
  uniform vec3 uLane;       // baseline, slope, phase seed
  uniform float uWidth;     // ribbon thickness
  attribute vec2 aUV;       // u across the screen 0..1, v across the ribbon 0..1
  varying float vEdge;
  varying float vU;
  varying float vFacing;
  void main() {
    float x = mix(-uAspect - 0.4, uAspect + 0.4, aUV.x);
    float t = uTime;
    float v = aUV.y - 0.5;
    float twist = x * 1.6 + t * 0.38 + uLane.z + v * 1.4;
    float thick = uWidth * (0.55 + 0.45 * sin(x * 0.9 - t * 0.21 + uLane.z));
    float y = centreY(x, t, uLane) + v * thick * cos(twist);
    float z = v * thick * sin(twist);
    vEdge = 1.0 - abs(v) * 2.0;
    vU = aUV.x;
    vFacing = 0.5 + 0.5 * sin(twist);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
  }
`;
const silkFragment = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uLight;
  uniform vec3 uSoft;
  uniform float uAlpha;
  uniform float uFade;
  varying float vEdge;
  varying float vU;
  varying float vFacing;
  void main() {
    // Folds that face the light read as the pale blue; the rest sink toward the deep blue.
    vec3 c = mix(uDeep, uLight, vFacing);
    c = mix(c, uSoft, pow(vFacing, 4.0) * 0.8);
    float ends = smoothstep(0.0, 0.12, vU) * smoothstep(1.0, 0.88, vU);
    float a = uAlpha * (0.35 + 0.65 * vEdge) * (0.4 + 0.6 * vFacing) * ends * uFade;
    gl_FragColor = vec4(c, a);
  }
`;

/* ---------- light trails: a glowing strip on a ribbon's crest with pulses travelling along it ---------- */
const trailVertex = /* glsl */ `
  ${WAVE_GLSL}
  uniform vec3 uLane;
  uniform float uOffset;    // sits the trail on the ribbon's upper fold
  uniform float uGlowW;
  attribute vec2 aUV;       // u along, v = -1..1 across the strip
  varying vec2 vUV;
  void main() {
    float x = mix(-uAspect - 0.4, uAspect + 0.4, aUV.x);
    float y = centreY(x, uTime, uLane) + uOffset;
    // Offset across using the curve's normal so the glow keeps its width on steep slopes.
    float dx = 0.01;
    float dy = centreY(x + dx, uTime, uLane) - centreY(x - dx, uTime, uLane);
    vec2 n = normalize(vec2(-dy, 2.0 * dx));
    vec2 p = vec2(x, y) + n * aUV.y * uGlowW;
    vUV = aUV;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.02, 1.0);
  }
`;
const trailFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSeed;
  uniform vec3 uSoft;
  uniform float uFade;
  uniform float uIntensity;
  varying vec2 vUV;
  void main() {
    float across = abs(vUV.y);
    float core = exp(-across * across * 60.0);
    float halo = exp(-across * across * 6.0) * 0.35;
    // Two light pulses travel the path; a faint base keeps the curve visible between them.
    float h1 = fract(uTime * uSpeed + uSeed);
    float h2 = fract(uTime * uSpeed * 0.63 + uSeed + 0.47);
    float d1 = vUV.x - h1, d2 = vUV.x - h2;
    float pulse = exp(-d1 * d1 / 0.004) * step(d1, 0.0) * 1.0 + exp(-d1 * d1 / 0.0004)
                + 0.6 * (exp(-d2 * d2 / 0.003) * step(d2, 0.0) + exp(-d2 * d2 / 0.0003));
    float base = 0.18;
    float ends = smoothstep(0.0, 0.1, vUV.x) * smoothstep(1.0, 0.9, vUV.x);
    vec3 c = mix(uSoft, vec3(1.0), core * min(1.0, pulse));
    float a = (core + halo) * (base + pulse) * ends * uFade * uIntensity;
    gl_FragColor = vec4(c, clamp(a, 0.0, 0.85));
  }
`;

/* ---------- particle wave mesh: a grid of dots riding a broad swell ---------- */
const dotsVertex = /* glsl */ `
  ${WAVE_GLSL}
  uniform vec3 uLane;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec2 aUV;
  varying float vLight;
  varying float vEnds;
  void main() {
    float x = mix(-uAspect * 0.15, uAspect + 0.3, aUV.x);
    float depth = aUV.y;                       // 0 = near edge, 1 = far
    float t = uTime;
    float y = centreY(x, t, uLane) - depth * 0.55 + 0.06 * sin(x * 6.0 + depth * 9.0 - t * 1.1);
    float z = -depth * 0.8;
    float d = distance(vec2(x, y), uMouse);
    y += uMouseAmp * 0.08 * exp(-d * d / 0.05);
    vLight = 0.45 + 0.55 * sin(x * 3.0 + depth * 6.0 - t * 0.9) * 0.5 + 0.275;
    vEnds = smoothstep(0.0, 0.25, aUV.x) * smoothstep(1.0, 0.8, aUV.x) * (1.0 - depth * 0.7);
    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 - depth * 0.45);
  }
`;
const dotsFragment = /* glsl */ `
  uniform vec3 uSoft;
  uniform float uFade;
  varying float vLight;
  varying float vEnds;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, r) * vLight * vEnds * 0.75 * uFade;
    gl_FragColor = vec4(mix(uSoft, vec3(1.0), vLight * 0.5), a);
  }
`;

/* ---------- depth vignette: the ink token pooled in the corners, behind everything ---------- */
const vignetteFragment = /* glsl */ `
  uniform vec3 uInk;
  uniform float uFade;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float v = smoothstep(0.3, 0.9, length(p * vec2(1.0, 1.1)));
    gl_FragColor = vec4(uInk, v * 0.3 * uFade);
  }
`;

function stripGeometry(segU, segV, vRange) {
  const verts = (segU + 1) * (segV + 1);
  const uv = new Float32Array(verts * 2);
  const idx = [];
  for (let j = 0; j <= segV; j++)
    for (let i = 0; i <= segU; i++) {
      const k = j * (segU + 1) + i;
      uv[k * 2] = i / segU;
      uv[k * 2 + 1] = vRange[0] + (vRange[1] - vRange[0]) * (j / segV);
    }
  for (let j = 0; j < segV; j++)
    for (let i = 0; i < segU; i++) {
      const a = j * (segU + 1) + i, b = a + 1, c = a + segU + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("aUV", new THREE.BufferAttribute(uv, 2));
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts * 3), 3)); // placeholder for three's bookkeeping
  g.setIndex(idx);
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
  return g;
}

/** Silk = many separate polylines across a ribbon (drawn as GL lines). */
function silkGeometry(lines, samples) {
  const uv = new Float32Array(lines * samples * 2);
  const idx = [];
  for (let l = 0; l < lines; l++)
    for (let s = 0; s < samples; s++) {
      const k = l * samples + s;
      uv[k * 2] = s / (samples - 1);
      uv[k * 2 + 1] = l / (lines - 1);
      if (s < samples - 1) idx.push(k, k + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("aUV", new THREE.BufferAttribute(uv, 2));
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines * samples * 3), 3));
  g.setIndex(idx);
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
  return g;
}

function gridPoints(nx, ny) {
  const uv = new Float32Array(nx * ny * 2);
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      uv[k * 2] = i / (nx - 1);
      uv[k * 2 + 1] = j / (ny - 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("aUV", new THREE.BufferAttribute(uv, 2));
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nx * ny * 3), 3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
  return g;
}

export class TalkWaves {
  constructor(host, tokenRoot = document.documentElement) {
    this.host = host;
    const mobile = innerWidth < 768;
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const C = {
      blue: readColor(tokenRoot, "--e-blue", "#0000ff"),
      deep: readColor(tokenRoot, "--e-blue-deep", "#0000c4"),
      light: readColor(tokenRoot, "--e-blue-light", "#4b4bff"),
      ink: readColor(tokenRoot, "--e-ink", "#16105f"),
      soft: readColor(tokenRoot, "--e-on-blue-soft", "#cfd0ff"),
    };

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: "low-power" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    this.group = new THREE.Group(); // parallax target
    this.scene.add(this.group);

    // Shared uniforms: every material points at the same objects, so one update moves them all.
    this.u = {
      uTime: { value: this.reduced ? 18 : 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseAmp: { value: 0 },
      uAspect: { value: 1 },
      uFade: { value: 0 },
      uDeep: { value: C.deep },
      uLight: { value: C.light },
      uSoft: { value: C.soft },
      uInk: { value: C.ink },
      uPixelRatio: { value: this.renderer.getPixelRatio() },
    };
    const shared = (extra) => ({ ...this.u, ...extra });

    // Vignette (screen space, behind).
    const vig = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shared({}),
        transparent: true,
        depthWrite: false,
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: vignetteFragment,
      })
    );
    vig.frustumCulled = false;
    vig.renderOrder = -1;
    this.scene.add(vig);

    // Ribbons: [baseline, slope, seed], width, opacity. Waves live along the bottom of the section
    // only: a main ribbon rising left to right and a fainter one beneath it for depth.
    const lanes = [
      { lane: [-0.62, 0.12, 2.1], width: 0.5, alpha: 0.34 },
      { lane: [-0.78, 0.06, 4.2], width: 0.32, alpha: 0.16 },
    ];
    const lines = mobile ? 34 : 64;
    const samples = mobile ? 140 : 260;
    this.lanes = lanes;
    for (const L of lanes) {
      const m = new THREE.LineSegments(
        silkGeometry(lines, samples),
        new THREE.ShaderMaterial({
          uniforms: shared({ uLane: { value: new THREE.Vector3(...L.lane) }, uWidth: { value: L.width }, uAlpha: { value: L.alpha } }),
          vertexShader: silkVertex,
          fragmentShader: silkFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      m.frustumCulled = false;
      this.group.add(m);
    }

    // Light trails on the bottom ribbons' folds.
    const trails = [
      { lane: lanes[0].lane, offset: 0.12, speed: 0.04, seed: 0.3, intensity: 0.85 },
      { lane: lanes[0].lane, offset: -0.12, speed: 0.032, seed: 0.55, intensity: 0.5 },
      { lane: lanes[1].lane, offset: 0.0, speed: 0.028, seed: 0.8, intensity: 0.4 },
    ];
    for (const T of trails) {
      const m = new THREE.Mesh(
        stripGeometry(mobile ? 160 : 320, 1, [-1, 1]),
        new THREE.ShaderMaterial({
          uniforms: shared({
            uLane: { value: new THREE.Vector3(...T.lane) },
            uOffset: { value: T.offset },
            uGlowW: { value: mobile ? 0.05 : 0.04 },
            uSpeed: { value: T.speed },
            uSeed: { value: T.seed },
            uIntensity: { value: T.intensity },
          }),
          vertexShader: trailVertex,
          fragmentShader: trailFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      m.frustumCulled = false;
      this.group.add(m);
    }

    // Particle mesh along the lower right, as in the brief.
    this.dots = new THREE.Points(
      gridPoints(mobile ? 90 : 170, mobile ? 16 : 26),
      new THREE.ShaderMaterial({
        uniforms: shared({ uLane: { value: new THREE.Vector3(-0.42, 0.1, 1.3) }, uSize: { value: mobile ? 2.2 : 2.6 } }),
        vertexShader: dotsVertex,
        fragmentShader: dotsFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    this.dots.frustumCulled = false;
    this.group.add(this.dots);

    /* ---------- GSAP: pointer smoothing, parallax, intro, clock ---------- */
    this.mouseX = gsap.quickTo(this.u.uMouse.value, "x", { duration: 1.1, ease: "power3.out" });
    this.mouseY = gsap.quickTo(this.u.uMouse.value, "y", { duration: 1.1, ease: "power3.out" });
    this.parX = gsap.quickTo(this.group.position, "x", { duration: 1.6, ease: "power2.out" });
    this.parY = gsap.quickTo(this.group.position, "y", { duration: 1.6, ease: "power2.out" });

    this.onPointer = (e) => {
      const r = host.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return this.release();
      const x = (nx * 2 - 1) * this.u.uAspect.value, y = 1 - ny * 2;
      if (this.u.uMouse.value.x > 50) this.u.uMouse.value.set(x, y); // first touch: no sweep in from off-screen
      this.mouseX(x);
      this.mouseY(y);
      this.parX(-(nx - 0.5) * 0.06);
      this.parY((ny - 0.5) * 0.04);
      gsap.to(this.u.uMouseAmp, { value: 1, duration: 0.8, ease: "power2.out", overwrite: true });
    };
    this.release = () => {
      gsap.to(this.u.uMouseAmp, { value: 0, duration: 1.4, ease: "power2.out", overwrite: true });
      this.parX(0);
      this.parY(0);
    };
    if (!this.reduced) {
      addEventListener("pointermove", this.onPointer, { passive: true });
      host.parentElement?.addEventListener("pointerleave", this.release);
      addEventListener("touchend", this.release, { passive: true });
    }

    this.tick = (time) => {
      this.u.uTime.value = time;
      this.renderer.render(this.scene, this.camera);
    };

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.io = new IntersectionObserver(([e]) => this.setActive(e.isIntersecting), { rootMargin: "100px" });
    this.io.observe(host);
    this.resize();
  }

  setActive(on) {
    if (this.disposed) return;
    if (on && !this.revealed) {
      this.revealed = true;
      gsap.to(this.u.uFade, { value: 1, duration: this.reduced ? 0 : 1.8, ease: "power2.out", onUpdate: () => this.reduced && this.render() });
    }
    if (this.reduced) return this.render();
    if (on && !this.active) gsap.ticker.add(this.tick);
    if (!on && this.active) gsap.ticker.remove(this.tick);
    this.active = on;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.u.uAspect.value = aspect;
    Object.assign(this.camera, { left: -aspect, right: aspect, top: 1, bottom: -1 });
    this.camera.updateProjectionMatrix();
    this.render();
  }

  dispose() {
    this.disposed = true;
    gsap.ticker.remove(this.tick);
    gsap.killTweensOf([this.u.uFade, this.u.uMouseAmp, this.u.uMouse.value, this.group.position]);
    removeEventListener("pointermove", this.onPointer);
    removeEventListener("touchend", this.release);
    this.host.parentElement?.removeEventListener("pointerleave", this.release);
    this.ro.disconnect();
    this.io.disconnect();
    this.scene.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
