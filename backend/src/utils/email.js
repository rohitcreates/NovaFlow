import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({
  email,
  resetUrl,
}) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your NovaFlow password",
    html: `
      <h2>Reset your NovaFlow password</h2>

      <p>
        You requested a password reset for your NovaFlow account.
      </p>

      <p>
        Click the button below to choose a new password:
      </p>

      <p>
        <a href="${resetUrl}">
          Reset Password
        </a>
      </p>

      <p>
        This link expires in 30 minutes.
      </p>

      <p>
        If you didn't request this, you can safely ignore this email.
      </p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};