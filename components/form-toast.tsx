import React from "react";
import toast from "react-hot-toast";

type ToastTone = "error" | "success";

// Toasts for the contact form, styled with the Ency form card (see .e-toast in ency.css).
// Rendered with toast.custom so the global Toaster styling for other pages stays untouched.
export function showFormToast(tone: ToastTone, title: string, message: string) {
  return toast.custom(
    (t) => (
      <div
        className={`e-toast e-toast--${tone}`}
        data-visible={t.visible ? "true" : "false"}
        {...t.ariaProps}
      >
        <span className="e-toast__dot" aria-hidden="true" />
        <div className="e-toast__body">
          <p className="e-mono e-toast__title">{title}</p>
          <p className="e-toast__text">{message}</p>
        </div>
        <button type="button" className="e-toast__close" aria-label="Dismiss" onClick={() => toast.dismiss(t.id)}>
          ×
        </button>
      </div>
    ),
    { id: "contact-form", position: "bottom-right", duration: tone === "error" ? 4500 : 5000 }
  );
}
