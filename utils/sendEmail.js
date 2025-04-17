import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const isSecure = Number(process.env.EMAIL_PORT) === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: isSecure, // true for port 465, false for others (e.g., 587)
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // optional: useful for self-signed certs
      },
    });

    const info = await transporter.sendMail({
      from: `"Marketack System" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);
  } catch (error) {
    console.error(`❌ Email error:\n`, error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
