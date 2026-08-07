const nodemailer = require('nodemailer');

const sendFeedback = async ({ name, email, rating, category, message }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const error = new Error('SMTP credentials are not configured');
    error.status = 500;
    throw error;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  await transporter.sendMail({
    from: `"AI Career Navigator" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: email || process.env.SMTP_USER,
    subject: `[Feedback] ${stars} — ${category}`,
    html: `<!DOCTYPE html><html><body>
      <h2>New Feedback Received</h2>
      <p><strong>From:</strong> ${name || 'Anonymous'} ${email ? `&lt;${email}&gt;` : ''}</p>
      <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </body></html>`,
  });

  return { msg: 'Feedback submitted successfully!' };
};

module.exports = { sendFeedback };
