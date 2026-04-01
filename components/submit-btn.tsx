import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex items-center justify-center gap-2 h-12 px-8 rounded-full font-semibold text-sm text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      style={{
        background: pending ? 'rgba(0,212,255,0.5)' : 'linear-gradient(135deg, #00D4FF 0%, #4A90E2 100%)',
        boxShadow: pending ? 'none' : '0 4px 20px rgba(0,212,255,0.35)',
      }}
      onMouseEnter={e => {
        if (!pending) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.03)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,212,255,0.5)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,212,255,0.35)';
      }}
      disabled={pending}
    >
      {pending ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <>
          Send message
          <FaPaperPlane className="text-xs opacity-80 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </>
      )}
    </button>
  );
}
