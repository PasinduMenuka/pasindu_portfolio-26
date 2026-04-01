"use client";

import React, { useState } from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-btn";
import toast from "react-hot-toast";
import { BsEnvelopeFill } from "react-icons/bs";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Contact() {
  const { ref } = useSectionInView("Contact");
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [msgFocused, setMsgFocused] = useState(false);
  const [msgValue, setMsgValue] = useState("");

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-full max-w-[42rem] text-center scroll-mt-28 px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <SectionHeading subtitle="Let's collaborate and build something amazing together">
        Contact me
      </SectionHeading>

      {/* Contact info row */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <a
          href="mailto:sannasuriyapm@gmail.com"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(0,212,255,0.2)',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.5)';
            (e.currentTarget as HTMLElement).style.color = '#00D4FF';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)';
            (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <BsEnvelopeFill className="text-[#00D4FF]" />
          sannasuriyapm@gmail.com
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(0,212,255,0.2)',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.5)';
            (e.currentTarget as HTMLElement).style.color = '#00D4FF';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)';
            (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <FaLinkedin className="text-[#00D4FF]" />
          LinkedIn
        </a>
        <a
          href="https://github.com"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(0,212,255,0.2)',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.5)';
            (e.currentTarget as HTMLElement).style.color = '#00D4FF';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)';
            (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <FaGithub className="text-[#00D4FF]" />
          GitHub
        </a>
      </div>

      {/* Form card */}
      <motion.div
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
        whileHover={{
          borderColor: 'rgba(0,212,255,0.15)',
        }}
      >
        {/* Gradient top border */}
        <div
          className="absolute top-0 left-0 w-full h-0.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, #00D4FF, #4A90E2, transparent)' }}
        />

        <form
          className="flex flex-col gap-4 text-left"
          action={async (formData) => {
            const { data, error } = await sendEmail(formData);
            if (error) {
              toast.error(error);
              return;
            }
            toast.success("Email sent successfully! I'll get back to you soon.");
            setEmailValue("");
            setMsgValue("");
          }}
        >
          {/* Email Input */}
          <div className="relative">
            <input
              className="w-full h-14 px-4 pt-5 pb-2 rounded-xl text-sm outline-none transition-all duration-300"
              style={{
                background: 'var(--color-bg-secondary)',
                border: `1.5px solid ${emailFocused ? '#00D4FF' : 'var(--color-border)'}`,
                boxShadow: emailFocused ? '0 0 0 3px rgba(0,212,255,0.12), 0 0 20px rgba(0,212,255,0.08)' : 'none',
                color: 'var(--color-text-primary)',
              }}
              name="senderEmail"
              type="email"
              required
              maxLength={500}
              value={emailValue}
              placeholder=" "
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={e => setEmailValue(e.target.value)}
            />
            <label
              className="absolute left-4 transition-all duration-200 pointer-events-none text-sm"
              style={{
                top: emailFocused || emailValue ? '0.45rem' : '50%',
                transform: emailFocused || emailValue ? 'translateY(0) scale(0.8)' : 'translateY(-50%) scale(1)',
                transformOrigin: 'left',
                color: emailFocused ? '#00D4FF' : 'var(--color-text-muted)',
                fontWeight: emailFocused ? '600' : '400',
              }}
            >
              Your email address
            </label>
          </div>

          {/* Message Textarea */}
          <div className="relative">
            <textarea
              className="w-full h-44 px-4 pt-7 pb-3 rounded-xl text-sm outline-none resize-none transition-all duration-300"
              style={{
                background: 'var(--color-bg-secondary)',
                border: `1.5px solid ${msgFocused ? '#00D4FF' : 'var(--color-border)'}`,
                boxShadow: msgFocused ? '0 0 0 3px rgba(0,212,255,0.12), 0 0 20px rgba(0,212,255,0.08)' : 'none',
                color: 'var(--color-text-primary)',
              }}
              name="message"
              placeholder=" "
              required
              maxLength={5000}
              value={msgValue}
              onFocus={() => setMsgFocused(true)}
              onBlur={() => setMsgFocused(false)}
              onChange={e => setMsgValue(e.target.value)}
            />
            <label
              className="absolute left-4 transition-all duration-200 pointer-events-none text-sm"
              style={{
                top: msgFocused || msgValue ? '0.45rem' : '1.25rem',
                transform: msgFocused || msgValue ? 'scale(0.8)' : 'scale(1)',
                transformOrigin: 'left',
                color: msgFocused ? '#00D4FF' : 'var(--color-text-muted)',
                fontWeight: msgFocused ? '600' : '400',
              }}
            >
              Your message
            </label>
          </div>

          <div className="flex justify-end">
            <SubmitBtn />
          </div>
        </form>
      </motion.div>
    </motion.section>
  );
}
