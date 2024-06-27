import nodemailer from "nodemailer";
// Takes object as parameter
export const sendEmail = async ({
  recipientEmail,
  subject,
  emailTemplate,
  attachments,
}) => {
  try {
    subject = subject || "Untitled";
    emailTemplate = emailTemplate || "TemplateNotFound";
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const messageConfigurations = {
      from: "WorkHub",
      to: recipientEmail,
      subject,
      html: emailTemplate,
      attachments,
    };

    let info = await transporter.sendMail(messageConfigurations);
    console.log(
      "\t",
      `<sendEmail>: Mail sent at email address:${recipientEmail}`
    );
    return info;
  } catch (error) {
    console.log("error thrown");
    console.log(error);
  }
};
