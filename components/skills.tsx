"use client";

import React, { useEffect, useRef } from "react";
import type * as MatterTypes from "matter-js";
import { skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { HandTag, Reveal, SplitHeading, useInViewOnce } from "@/components/motion/reveal";

const pills = [
  ...skillsData,
  "Figma",
  "Design Systems",
  "Wireframing",
  "Tailwind CSS",
  "TypeScript",
  "Dashboard Design",
  "Accessibility",
];

/** Drops the pills into a Matter.js world drawn on a canvas; they can be grabbed and thrown. */
function usePillPhysics(hostRef: React.RefObject<HTMLDivElement>, labels: readonly string[]) {
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ok =
      window.matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 768px)").matches &&
      "IntersectionObserver" in window &&
      "roundRect" in CanvasRenderingContext2D.prototype;
    if (!ok) return;

    let cleanup = () => {};
    let disposed = false;

    import("matter-js").then((mod) => {
      if (disposed) return;
      const Matter: typeof MatterTypes = (mod as any).default ?? mod;
      const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Sleeping } = Matter;
      const canvas = document.createElement("canvas");
      host.prepend(canvas);
      const ctx = canvas.getContext("2d")!;
      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1.1;

      const font = getComputedStyle(document.body).fontFamily;
      const sample = host.querySelector<HTMLElement>(".e-pill");
      let fontSize = sample ? parseFloat(getComputedStyle(sample).fontSize) : 16;
      let w = 0;
      let h = 0;
      let bodies: { body: MatterTypes.Body; label: string; w: number; h: number }[] = [];
      let timers: number[] = [];
      let raf = 0;
      let last = 0;
      let visible = false;
      let started = false;

      const resize = () => {
        const r = host.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = r.width;
        h = r.height;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        fontSize = sample ? parseFloat(getComputedStyle(sample).fontSize) : 16;
        if (mouse) (mouse as any).pixelRatio = dpr;
      };

      let mouse: MatterTypes.Mouse | null = null;
      let grab: MatterTypes.MouseConstraint | null = null;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        mouse = Mouse.create(canvas);
        const m = mouse as any;
        // Let the page keep scrolling over the canvas.
        canvas.removeEventListener("wheel", m.mousewheel);
        canvas.removeEventListener("mousewheel", m.mousewheel);
        canvas.removeEventListener("DOMMouseScroll", m.mousewheel);
        canvas.removeEventListener("touchstart", m.mousedown);
        canvas.removeEventListener("touchmove", m.mousemove);
        canvas.removeEventListener("touchend", m.mouseup);
        grab = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1 } as any });
        host.setAttribute("data-grab", "");
        canvas.addEventListener("mousedown", () => {
          host.setAttribute("data-grabbing", "");
          wake();
        });
        canvas.addEventListener("mousemove", () => grab?.body && wake());
      }
      const onUp = () => host.removeAttribute("data-grabbing");
      window.addEventListener("mouseup", onUp);

      const build = () => {
        timers.splice(0).forEach((t) => clearTimeout(t));
        Composite.clear(engine.world, false);
        bodies = [];
        resize();
        const wall = 200;
        Composite.add(engine.world, [
          Bodies.rectangle(w / 2, h + wall / 2, w * 3, wall, { isStatic: true }),
          Bodies.rectangle(-wall / 2, h / 2 - h, wall, h * 4, { isStatic: true }),
          Bodies.rectangle(w + wall / 2, h / 2 - h, wall, h * 4, { isStatic: true }),
        ]);
        ctx.font = `400 ${fontSize}px ${font}`;
        const ph = fontSize * 3.1;
        labels.forEach((label, i) => {
          const pw = Math.min(ctx.measureText(label).width + fontSize * 3.2, w * 0.9);
          const x = w * (0.15 + 0.7 * ((i * 0.37) % 1));
          const body = Bodies.rectangle(x, -ph * 1.5, pw, ph, {
            chamfer: { radius: ph / 2 - 1 },
            restitution: 0.35,
            friction: 0.4,
            frictionAir: 0.012,
            density: 0.0018,
            angle: ((((i * 53) % 40) - 20) * Math.PI) / 180,
          });
          bodies.push({ body, label, w: pw, h: ph });
          timers.push(
            window.setTimeout(() => {
              Composite.add(engine.world, body);
              Body.setAngularVelocity(body, (((i * 31) % 10) - 5) * 0.012);
              wake();
            }, 120 * i)
          );
        });
        if (grab) Composite.add(engine.world, grab);
      };

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.font = `400 ${fontSize}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const { body, label, w: bw, h: bh } of bodies) {
          if (!Composite.get(engine.world, body.id, "body")) continue;
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          ctx.beginPath();
          ctx.roundRect(-bw / 2, -bh / 2, bw, bh, bh / 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.fillStyle = "#0000ff";
          const a = ((body.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          if (a > Math.PI / 2 && a < (Math.PI * 3) / 2) ctx.rotate(Math.PI); // keep text upright-ish
          ctx.fillText(label, 0, fontSize * 0.04);
          ctx.restore();
        }
      };

      const step = (now: number) => {
        raf = 0;
        if (!visible) return;
        const dt = Math.min(now - (last || now), 32) || 16.6;
        last = now;
        Engine.update(engine, dt);
        draw();
        const settled = bodies.every(({ body }) => body.isSleeping && Composite.get(engine.world, body.id, "body"));
        if (!settled || grab?.body || timers.length) raf = requestAnimationFrame(step);
      };

      function wake() {
        bodies.forEach(({ body }) => Sleeping.set(body, false));
        if (!raf && visible) {
          last = 0;
          raf = requestAnimationFrame(step);
        }
      }

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            visible = e.isIntersecting;
            if (visible && !started && e.intersectionRatio >= 0.35) {
              started = true;
              host.setAttribute("data-live", "");
              build();
              window.setTimeout(() => timers.splice(0), 120 * labels.length + 60);
            }
            if (visible && started) wake();
          }
        },
        { threshold: [0, 0.35] }
      );
      io.observe(host);

      let lastW = window.innerWidth;
      let rt = 0;
      const onResize = () => {
        if (!started || window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        clearTimeout(rt);
        rt = window.setTimeout(() => {
          build();
          window.setTimeout(() => timers.splice(0), 120 * labels.length + 60);
          wake();
        }, 250);
      };
      window.addEventListener("resize", onResize, { passive: true });

      cleanup = () => {
        io.disconnect();
        cancelAnimationFrame(raf);
        timers.forEach((t) => clearTimeout(t));
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mouseup", onUp);
        if (mouse) (Mouse as any).clearSourceEvents?.(mouse);
        Engine.clear(engine);
        canvas.remove();
        host.removeAttribute("data-live");
        host.removeAttribute("data-grab");
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [hostRef, labels]);
}

export default function Skills() {
  const { ref } = useSectionInView("Skills");
  const pillsRef = useRef<HTMLDivElement>(null);
  const list = useInViewOnce<HTMLUListElement>(0.2);
  usePillPhysics(pillsRef, pills);

  return (
    <section id="skills" ref={ref} data-ground="blue" className="e-section g-blue-diag e-skills">
      <div className="e-container">
        <Reveal>
          <HandTag tilt={3}>the whole toolkit</HandTag>
        </Reveal>
        <SplitHeading
          lines={[
            { text: "Everything a product", block: true },
            { text: "needs,", className: "is-white" },
            { text: "end to end" },
          ]}
        />
        <Reveal delay={1} as="p" className="e-lead">
          Research, strategy, interaction design and front-end engineering. Whatever the project needs, it&apos;s all
          covered by the same pair of hands, so ideas survive the trip from whiteboard to production.
        </Reveal>

        <div ref={pillsRef} className="e-pills">
          <span className="e-pills__hint e-hand" aria-hidden="true">
            go on, throw one
          </span>
          <ul ref={list.ref} className={`e-pills__list ${list.inView ? "is-in" : ""}`}>
            {pills.map((p, i) => (
              <li
                key={p}
                className="e-pill"
                style={{
                  ["--drop-d" as any]: `${i * 0.05}s`,
                  ["--bob-d" as any]: `${1.2 + ((i * 0.37) % 1.5)}s`,
                  ["--bob-r" as any]: `${((i * 7) % 5) - 2}deg`,
                }}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
