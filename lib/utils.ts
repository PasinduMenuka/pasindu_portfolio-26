export const validateString = (
  value: unknown,
  maxLength: number
): value is string => {
  if (!value || typeof value !== "string" || value.length > maxLength) {
    return false;
  }

  return true;
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }

  return message;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// digits with optional leading +, spaces, dashes, dots or brackets, e.g. +94 77 621 7729
const PHONE_PATTERN = /^\+?[\d\s\-().]+$/;

export type ContactField = "senderEmail" | "contactNumber" | "message";

// Shared by the contact form (client) and the sendEmail action (server).
// Returns the first problem found, or null when the form is good to send.
export const validateContactForm = (
  senderEmail: unknown,
  contactNumber: unknown,
  message: unknown
): { field: ContactField; error: string } | null => {
  const email = typeof senderEmail === "string" ? senderEmail.trim() : "";
  const phone = typeof contactNumber === "string" ? contactNumber.trim() : "";
  const phoneDigits = phone.replace(/\D/g, "").length;
  const body = typeof message === "string" ? message.trim() : "";

  if (!email) {
    return { field: "senderEmail", error: "Please enter your email address." };
  }
  if (email.length > 500 || !EMAIL_PATTERN.test(email)) {
    return { field: "senderEmail", error: "That email address doesn't look right." };
  }
  if (!phone) {
    return { field: "contactNumber", error: "Please enter your contact number." };
  }
  if (!PHONE_PATTERN.test(phone) || phoneDigits < 7 || phoneDigits > 15) {
    return { field: "contactNumber", error: "That contact number doesn't look right." };
  }
  if (!body) {
    return { field: "message", error: "Please write a message." };
  }
  if (body.length < 10) {
    return { field: "message", error: "Your message is a little short. Tell me a bit more." };
  }
  if (body.length > 5000) {
    return { field: "message", error: "Your message is too long. Keep it under 5000 characters." };
  }

  return null;
};
