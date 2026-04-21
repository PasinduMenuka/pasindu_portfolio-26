"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// ── Types ─────────────────────────────────────────────────────────────────────
interface V2      { x: number; y: number }
interface Beam    { pos: V2; trail: V2[]; lag: number; oa: number; orb: number; col: string }
interface Ripple  { x: number; y: number; r: number; a: number }
interface Ambient { x: number; y: number; vx: number; vy: number; trail: V2[]; col: string; w: number }
interface Spark   { x: number; y: number; ph: number; spd: number }

// ── Constants ─────────────────────────────────────────────────────────────────
const COLS: readonly string[] = ["#38bdf8", "#818cf8", "#a78bfa", "#22d3ee", "#c084fc"];
const TLEN      = 80;
const N_BEAM    = 7;
const N_AMB     = 10;
const N_SPARK   = 50;
const RIPPLE_MS = 120;

// ── Pure helpers (defined outside component — stable, no captures) ────────────
function pickCol(i: number): string { return COLS[i % COLS.length] as string; }

function hexRgb(hex: string): string {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].join(",");
}

function mkBeam(i: number): Beam {
  return {
    pos:   { x: -999, y: -999 },
    trail: [],
    lag:   0.06 + i * 0.018,
    oa:    (Math.PI * 2 / N_BEAM) * i,
    orb:   8 + i * 4,
    col:   pickCol(i),
  };
}

function mkAmbient(w: number, h: number): Ambient {
  const edge = Math.floor(Math.random() * 4);
  const spd  = 0.8 + Math.random() * 1.5;
  const ang  = Math.random() * Math.PI * 2;
  let x = 0, y = 0;
  switch (edge) {
    case 0:  x = Math.random() * w; y = -20;    break;
    case 1:  x = Math.random() * w; y = h + 20; break;
    case 2:  x = -20;    y = Math.random() * h;  break;
    default: x = w + 20; y = Math.random() * h;
  }
  return {
    x, y,
    vx:    Math.cos(ang) * spd,
    vy:    Math.sin(ang) * spd,
    trail: [],
    col:   pickCol(Math.floor(Math.random() * COLS.length)),
    w:     0.5 + Math.random() * 1.5,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LaserBg() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Runtime state kept in refs (no re-renders needed)
  const mouse      = useRef<V2>({ x: -999, y: -999 });
  const cursorPos  = useRef<V2>({ x: -999, y: -999 });
  const beams      = useRef<Beam[]>([]);
  const ripples    = useRef<Ripple[]>([]);
  const ambients   = useRef<Ambient[]>([]);
  const sparks     = useRef<Spark[]>([]);
  const lastRipple = useRef<number>(0);

  useGSAP(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!wrap || !canvas || !cursor) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Canvas resize ──────────────────────────────────────────────────────────
    function resize(): void {
      if (!canvas || !wrap) return;
      canvas.width  = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
    }
    resize();

    // ── Seed data arrays ───────────────────────────────────────────────────────
    beams.current    = Array.from({ length: N_BEAM },  (_, i) => mkBeam(i));
    ambients.current = Array.from({ length: N_AMB  },  ()     => mkAmbient(canvas.width, canvas.height));
    sparks.current   = Array.from({ length: N_SPARK }, ()     => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      ph:  Math.random() * Math.PI * 2,
      spd: 0.01 + Math.random() * 0.03,
    }));
    ripples.current  = [];

    // ── Mouse tracking (window-level so pointer-events:none canvas still works) ─
    const onMouseMove = (e: MouseEvent): void => {
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.current = { x, y };
        const now = performance.now();
        if (now - lastRipple.current > RIPPLE_MS) {
          ripples.current.push({ x, y, r: 0, a: 0.7 });
          lastRipple.current = now;
        }
      } else {
        mouse.current = { x: -999, y: -999 };
        beams.current.forEach(b => { b.trail = []; });
      }
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Draw helpers ───────────────────────────────────────────────────────────
    function drawTrail(
      trail: V2[], color: string, lw: number, alphaMax: number,
    ): void {
      if (trail.length < 2) return;
      const start = Math.floor(trail.length * 0.4);
      const rgb   = hexRgb(color);
      for (let i = start + 1; i < trail.length; i++) {
        const t = (i - start) / (trail.length - start);
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x,     trail[i].y);
        ctx.strokeStyle = `rgba(${rgb},${(t * alphaMax).toFixed(3)})`;
        ctx.lineWidth   = lw;
        ctx.lineCap     = "round";
        ctx.stroke();
      }
    }

    // ── Main render tick (driven by GSAP ticker) ───────────────────────────────
    function tick(time: number): void {
      if (!canvas || !ctx) return;
      const W  = canvas.width;
      const H  = canvas.height;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const active = mx > -100;

      // Cursor lerp
      cursorPos.current.x += (mx - cursorPos.current.x) * 0.18;
      cursorPos.current.y += (my - cursorPos.current.y) * 0.18;
      if (cursor) {
        gsap.set(cursor, {
          x:       cursorPos.current.x - 16,
          y:       cursorPos.current.y - 16,
          opacity: active ? 1 : 0,
        });
      }

      ctx.clearRect(0, 0, W, H);

      // ── System 3: radial glow centred at cursor ──────────────────────────────
      if (active) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        grd.addColorStop(0, "rgba(56,189,248,0.12)");
        grd.addColorStop(1, "rgba(56,189,248,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // ── System 1: 7 mouse beams with lagged orbital trails ──────────────────
      if (active) {
        beams.current.forEach(b => {
          const tx = mx + Math.cos(time * 0.5 + b.oa) * b.orb;
          const ty = my + Math.sin(time * 0.5 + b.oa) * b.orb;
          b.pos.x += (tx - b.pos.x) * b.lag;
          b.pos.y += (ty - b.pos.y) * b.lag;
          b.trail.push({ x: b.pos.x, y: b.pos.y });
          if (b.trail.length > TLEN) b.trail.shift();

          // Layer 1 — wide blurred outer glow
          ctx.shadowBlur  = 18;
          ctx.shadowColor = b.col;
          drawTrail(b.trail, b.col, 6, 0.08);

          // Layer 2 — coloured mid stroke
          ctx.shadowBlur = 8;
          drawTrail(b.trail, b.col, 2, 0.55);

          // Layer 3 — thin white inner highlight
          ctx.shadowBlur = 4;
          drawTrail(b.trail, "#ffffff", 0.8, 0.35);

          ctx.shadowBlur = 0;
        });
      }

      // ── System 2: ripple rings ────────────────────────────────────────────────
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const rp = ripples.current[i];
        rp.r += 2.5;
        rp.a *= 0.94;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56,189,248,${rp.a.toFixed(3)})`;
        ctx.lineWidth   = 1.5;
        ctx.stroke();
        if (rp.a < 0.01) ripples.current.splice(i, 1);
      }

      // ── System 4: 10 ambient floating beams ──────────────────────────────────
      ambients.current.forEach((ab, idx) => {
        ab.x += ab.vx;
        ab.y += ab.vy;
        ab.trail.push({ x: ab.x, y: ab.y });
        if (ab.trail.length > 40) ab.trail.shift();

        if (ab.x < -100 || ab.x > W + 100 || ab.y < -100 || ab.y > H + 100) {
          ambients.current[idx] = mkAmbient(W, H);
        } else if (ab.trail.length > 1) {
          const rgb = hexRgb(ab.col);
          for (let j = 1; j < ab.trail.length; j++) {
            const t = j / ab.trail.length;
            ctx.beginPath();
            ctx.moveTo(ab.trail[j - 1].x, ab.trail[j - 1].y);
            ctx.lineTo(ab.trail[j].x,     ab.trail[j].y);
            ctx.strokeStyle = `rgba(${rgb},${(t * 0.25).toFixed(3)})`;
            ctx.lineWidth   = ab.w;
            ctx.lineCap     = "round";
            ctx.stroke();
          }
        }
      });

      // ── 50 pulsing spark particles ────────────────────────────────────────────
      sparks.current.forEach(sp => {
        sp.ph += sp.spd;
        const a = ((Math.sin(sp.ph) * 0.5 + 0.5) * 0.35).toFixed(3);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${a})`;
        ctx.fill();
      });
    }

    gsap.ticker.add(tick);

    // ── ResizeObserver ────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      resize();
      if (!canvas) return;
      sparks.current.forEach(sp => {
        sp.x = Math.random() * canvas.width;
        sp.y = Math.random() * canvas.height;
      });
    });
    ro.observe(wrap);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
      beams.current    = [];
      ripples.current  = [];
      ambients.current = [];
      sparks.current   = [];
    };
  }, { scope: wrapRef });

  return (
    <>
      {/* Canvas — z-1, pointer-events:none so hero content stays interactive */}
      <div
        ref={wrapRef}
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* Custom crosshair cursor — fixed, always on top */}
      <div
        ref={cursorRef}
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         32,
          height:        32,
          pointerEvents: "none",
          zIndex:        9999,
          opacity:       0,
        }}
      >
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="5.5" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="16" y1="0"  x2="16" y2="9"  stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="16" y1="23" x2="16" y2="32" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="0"  y1="16" x2="9"  y2="16" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="23" y1="16" x2="32" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      </div>
    </>
  );
}
