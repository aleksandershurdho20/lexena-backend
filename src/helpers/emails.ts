import { google } from "googleapis";
import nodemailer, { SendMailOptions } from "nodemailer";

// Initialize OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

/**
 * Function to get Access Token from Google OAuth2
 * @returns {Promise<string>} - The access token
 */

async function getAccessToken(): Promise<string> {
  try {
    const { token } = await oauth2Client.getAccessToken();
    return token as string;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to get access token");
  }
}
/**
 * Function to send an email using Nodemailer and Google OAuth2
 * @param {SendMailOptions} mailOptions - Email options
 */

export async function sendEmail(mailOptions: SendMailOptions): Promise<void> {
  const accessToken = await getAccessToken();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      ...mailOptions,
    });
    console.log(`Email sent to ${mailOptions.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

/**
 * Function to generate the content for an activation email
 * @param {string} activationUrl - The activation URL
 * @param {string} name - The recipient's name
 * @returns {string} - The HTML content for the activation email
 */

export const activationEmailContent = (activationUrl: string, name: string) => {
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #00ADB5;">Pershendetje ${name},</h2>
        <p>Ju lutemi aktivizoni llogarinë tuaj duke klikuar linkun më poshtë:</p>
        <a href="${activationUrl}" style="background-color: #00ADB5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Aktivizo</a>
        <p>Ne qoftese nuk funksionon linku ju lutem kopjojeni manualisht : ${activationUrl} </p>
        <br/>
        <p>Faleminderit,<br/>Lexena</p>
      </div>
    `;
  return htmlContent;
};
