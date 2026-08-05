const nodemailer = require('nodemailer');

const sendContactMessage = async ({ name, email, subject, message }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const error = new Error('SMTP credentials are not configured');
    error.status = 500;
    throw error;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlTemplate = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>New Contact Message</h1><p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p></body></html>`;

  await transporter.sendMail({
    from: `"AI Career Navigator" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    html: htmlTemplate,
  });

  return { msg: 'Message sent successfully! We\'ll get back to you soon.' };
};

module.exports = {
  sendContactMessage,
};
