import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP provider
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: `"Email Warmup Service" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}