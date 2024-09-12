import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Replace with your SMTP host
    port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASSWORD ,
  },
});

/**
 * Send email
 * @param {object} mailOptions - Email options
 * @param {string} mailOptions.to - Recipient email address
 * @param {string} mailOptions.subject - Subject of the email
 * @param {string} mailOptions.text - Plain text body of the email
 */
export const sendEmail = async (mailOptions: {
  to: string;
  subject: string;
  text: string;
}) => {
  const mail = {
    from: process.env.EMAIL_FROM || "no-reply@example.com", // Sender address
    to: mailOptions.to, // Recipient address
    subject: mailOptions.subject, // Subject line
    text: mailOptions.text, // Plain text body,
  };

  try {
    await transporter.sendMail(mail);
    console.log(`Email sent to ${mailOptions.to}`);
  } catch (error) {
    throw new Error(`Could not send email: ${error}`);
  }
};
