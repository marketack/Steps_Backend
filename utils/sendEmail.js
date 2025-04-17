import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('📤 Preparing email to:', to);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"Marketack System" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Email error:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
