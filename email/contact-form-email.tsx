import React from "react";
import {
  Html,
  Body,
  Head,
  Button,
  Container,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
  contactNumber: string;
  sentAt: string;
};

// Ency palette, hard-coded because email clients don't support CSS variables
const ink = "#16105f";
const blue = "#0000ff";
const yellow = "#ffd60a";
const muted = "#565a92";
const card = "#f6f7ff";
const display = 'Impact, "Arial Narrow Bold", "Arial Narrow", "Helvetica Neue", Arial, sans-serif';
const sans = 'Inter, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const mono = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';

const styles = {
  body: { margin: 0, padding: "32px 12px", backgroundColor: "#e9eaff", fontFamily: sans },
  container: { maxWidth: "600px", margin: "0 auto" },
  header: { backgroundColor: ink, borderRadius: "20px 20px 0 0", padding: "32px 36px 30px" },
  tag: {
    display: "inline-block",
    margin: 0,
    padding: "4px 12px 5px",
    backgroundColor: yellow,
    color: ink,
    borderRadius: "6px",
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  heading: {
    margin: "18px 0 0",
    color: "#ffffff",
    fontFamily: display,
    fontSize: "40px",
    fontWeight: "normal" as const,
    lineHeight: "0.95",
    letterSpacing: "0.01em",
    textTransform: "uppercase" as const,
  },
  headingAccent: { color: yellow },
  date: { margin: "14px 0 0", color: "#b3b0f2", fontFamily: mono, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const },
  card: { backgroundColor: "#ffffff", borderRadius: "0 0 20px 20px", padding: "30px 36px 34px", boxShadow: "0 24px 48px -30px rgba(0, 0, 40, 0.6)" },
  label: { margin: "0 0 8px", color: muted, fontFamily: mono, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const },
  from: { margin: "0 0 26px", fontSize: "16px", fontWeight: 600 },
  fromLink: { color: blue, textDecoration: "none" },
  message: {
    margin: 0,
    padding: "18px 20px",
    backgroundColor: card,
    border: "1px solid rgba(22, 16, 95, 0.18)",
    borderRadius: "12px",
    color: ink,
    fontSize: "15px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
  },
  button: {
    display: "inline-block",
    marginTop: "28px",
    backgroundColor: blue,
    color: "#ffffff",
    borderRadius: "100em",
    fontSize: "15px",
    fontWeight: 500,
    textDecoration: "none",
  },
  footer: { margin: "22px 0 0", textAlign: "center" as const, color: muted, fontSize: "12px", lineHeight: "1.5" },
};

export default function ContactFormEmail({
  message,
  senderEmail,
  contactNumber,
  sentAt,
}: ContactFormEmailProps) {
  const preview = message.length > 90 ? `${message.slice(0, 90)}…` : message;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.tag}>New enquiry</Text>
            <Text style={styles.heading}>
              You&apos;ve got a <span style={styles.headingAccent}>message</span>
            </Text>
            <Text style={styles.date}>{sentAt} · Colombo</Text>
          </Section>

          <Section style={styles.card}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.from}>
              <Link href={`mailto:${senderEmail}`} style={styles.fromLink}>
                {senderEmail}
              </Link>
            </Text>

            <Text style={styles.label}>Contact number</Text>
            <Text style={styles.from}>
              <Link href={`tel:${contactNumber.replace(/[^\d+]/g, "")}`} style={styles.fromLink}>
                {contactNumber}
              </Link>
            </Text>

            <Text style={styles.label}>Message</Text>
            <Text style={styles.message}>{message}</Text>

            <Button
              pX={26}
              pY={14}
              href={`mailto:${senderEmail}?subject=${encodeURIComponent("Re: your message")}`}
              style={styles.button}
            >
              Reply to {senderEmail} ↗
            </Button>
          </Section>

          <Text style={styles.footer}>
            Sent from the contact form on your portfolio.
            <br />
            Hitting reply goes straight to the sender.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
