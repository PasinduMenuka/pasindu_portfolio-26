import React from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ArrowIcon } from "./arrow-button";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="e-btn e-btn--blue disabled:opacity-60 disabled:cursor-not-allowed" disabled={pending}>
      {pending ? (
        <>
          Sending
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </>
      ) : (
        <>
          <span>Send message</span>
          <ArrowIcon />
        </>
      )}
    </button>
  );
}
