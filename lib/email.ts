import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ReactElement } from "react";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as SMTPTransport.Options);

type EmailOptions = {
  subject: string;
  emailElement: ReactElement;
  toEmail: string;
};

export const sendEmail = async ({
  subject,
  emailElement,
  toEmail,
}: EmailOptions) => {
  try {
    const emailHtml = await render(emailElement);

    await transport.sendMail({
      subject,
      from: process.env.EMAIL_USER,
      to: toEmail,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Error during sendEmail: ", error);
  }
};
