"use client";

import React from "react";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { aiWorkflow, type FrontendBuild as FrontendBuildData } from "@/lib/frontend-builds";

const TOKEN = /("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|\/\/.*$|\b(?:const|export|function|return|import|from|new|type|typeof|interface|prev)\b)/gm;

/** Tiny highlighter: strings, comments and a few keywords. */
function highlight(code: string) {
  return code.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('"') || part.startsWith("`")) return <span key={i} className="fe-code__str">{part}</span>;
    if (part.startsWith("//")) return <span key={i} className="fe-code__cmt">{part}</span>;
    if (i % 2 === 1) return <span key={i} className="fe-code__kw">{part}</span>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function FrontendBuild({ data, index = "Front-end development" }: { data: FrontendBuildData; index?: string }) {
  const lines = data.snippet.code.split("\n").length;

  return (
    <section data-ground="ink" className="fe e-section" style={{ ["--fe-accent" as any]: data.accent }}>
      <div className="e-container">
        <Reveal>
          <p className="e-mono fe-eyebrow">{index}</p>
        </Reveal>
        <SplitHeading className="fe-title" lines={[{ text: "From Figma", block: true }, { text: "to production code", className: "is-soft", block: true }]} />
        <Reveal delay={1} as="p" className="e-lead fe-lead">
          {data.intro}
        </Reveal>

        <div className="fe-stack">
          {data.stack.map((g, gi) => (
            <Reveal key={g.group} delay={Math.min(gi, 3) as 0 | 1 | 2 | 3} className="fe-stack__group">
              <p className="e-mono">{g.group}</p>
              <ul>
                {g.items.map((t) => (
                  <li key={t.name}>
                    <strong>{t.name}</strong>
                    <span>{t.use}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="fe-ai">
          <div className="fe-ai__head">
            <div>
              <p className="e-mono">AI-assisted workflow</p>
              <h3>Figma to code with Claude Code & Figma MCP</h3>
              <p className="fe-ai__note">{data.aiNote}</p>
            </div>
            {data.prototypeUrl && (
              <a className="fe-ai__cta" href={data.prototypeUrl} target="_blank" rel="noopener noreferrer">
                View advanced prototype
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <ul className="fe-ai__tools">
            {aiWorkflow.tools.map((t) => (
              <li key={t.name}>
                <strong>{t.name}</strong>
                <span>{t.use}</span>
              </li>
            ))}
          </ul>
          <ol className="fe-ai__steps">
            {aiWorkflow.steps.map((s, i) => (
              <li key={s.title}>
                <span className="fe-ai__n">{i + 1}</span>
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="fe-build">
          <div className="fe-arch">
            {data.architecture.map((a, i) => (
              <Reveal key={a.title} delay={Math.min(i, 3) as 0 | 1 | 2 | 3} className="fe-arch__item">
                <span className="fe-arch__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={1} as="figure" className="fe-code">
            <div className="fe-code__bar">
              <span />
              <span />
              <span />
              <em>{data.snippet.file}</em>
            </div>
            <pre tabIndex={0} aria-label={`Code sample: ${data.snippet.file}`}>
              <span className="fe-code__gutter" aria-hidden="true">
                {Array.from({ length: lines }, (_, i) => i + 1).join("\n")}
              </span>
              <code>{highlight(data.snippet.code)}</code>
            </pre>
            <figcaption>{data.snippet.caption}</figcaption>
          </Reveal>
        </div>

        <Reveal delay={1} as="ul" className="fe-practices">
          {data.practices.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
