"use client";

import React, { useRef } from "react";
import toast from "react-hot-toast";
import { BsEnvelopeFill } from "react-icons/bs";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-btn";
import { HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";

const contactLinks = [
  { label: "sannasuriyapm@gmail.com", href: "mailto:sannasuriyapm@gmail.com", icon: BsEnvelopeFill },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
  { label: "GitHub", href: "https://github.com", icon: FaGithub },
];

export default function Contact() {
  const { ref } = useSectionInView("Contact", 0.5);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section id="contact" ref={ref} data-ground="ink" className="e-section g-ink">
      <div className="e-container e-contact__grid">
        <div>
          <Reveal>
            <HandTag>got a project?</HandTag>
          </Reveal>
          <SplitHeading
            lines={[
              { text: "Let's build", block: true },
              { text: "something", block: true },
              { text: "better", className: "is-yellow", block: true },
            ]}
          />
          <Reveal delay={1} as="p" className="e-lead mt-7">
            Whether it&apos;s a full product redesign, a design system, or a dashboard that needs to make sense of a lot
            of data, tell me about it. You&apos;ll hear back from me, not a ticket queue.
          </Reveal>
          <Reveal delay={2} className="e-contact__links">
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} className="e-contact__link" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                <Icon />
                {label}
              </a>
            ))}
          </Reveal>
        </div>

        <Reveal delay={2}>
          <form
            ref={formRef}
            className="e-form"
            action={async (formData) => {
              const { error } = await sendEmail(formData);
              if (error) {
                toast.error(error);
                return;
              }
              toast.success("Email sent successfully! I'll get back to you soon.");
              formRef.current?.reset();
            }}
          >
            <p className="e-form__title">Send a message</p>
            <label className="e-field">
              <span className="e-mono">Your email</span>
              <input name="senderEmail" type="email" required maxLength={500} placeholder="you@company.com" />
            </label>
            <label className="e-field">
              <span className="e-mono">Your message</span>
              <textarea name="message" required maxLength={5000} placeholder="Tell me about your product, timeline and goals" />
            </label>
            <div className="e-form__foot">
              <span className="e-form__note e-hand" aria-hidden="true">
                I reply fast
              </span>
              <SubmitBtn />
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
