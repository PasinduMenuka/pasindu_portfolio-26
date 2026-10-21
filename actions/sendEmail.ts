"use server";

import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { validateContactForm, getErrorMessage } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

const { GMAIL_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  // never trust the client: run the same validation again on the server
  const invalid = validateContactForm(senderEmail, message);
  if (invalid) {
    return {
      error: invalid.error,
    };
  }

  if (!GMAIL_USER || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    console.error("sendEmail: missing Gmail OAuth2 environment variables");
    return {
      error: "Email service isn't configured yet. Please reach me at sannasuriyapm@gmail.com.",
    };
  }

  const email = (senderEmail as string).trim();
  const body = (message as string).trim();
  const sentAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GMAIL_USER,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
    },
  });

  let data;
  try {
    const info = await transporter.sendMail({
      from: `Portfolio Contact <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: email,
      subject: `New message from ${email}`,
      html: render(
        React.createElement(ContactFormEmail, {
          message: body,
          senderEmail: email,
          sentAt,
        })
      ),
      text: `New message from your portfolio\n\nFrom: ${email}\nSent: ${sentAt} (Colombo)\n\n${body}`,
    });
    data = { id: info.messageId };
  } catch (error: unknown) {
    console.error("sendEmail:", getErrorMessage(error));
    return {
      error: "Couldn't send your message right now. Please try again in a moment.",
    };
  }

  return {
    data,
  };
};
