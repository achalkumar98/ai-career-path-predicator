const nodemailer = require('nodemailer');
const { createNotification } = require('./notification.service');

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

  // Save an in-app notification so the header bell shows it
  try {
    await createNotification({
      type: 'feedback',
      title: 'New feedback received',
      description: `${name || 'Anonymous'} left a ${stars} feedback in category: ${category}`,
      meta: { name, email, rating, category },
    });
  } catch (notifErr) {
    // Non-fatal — email already sent, just log the error
    console.error('[notification] failed to save feedback notification:', notifErr.message);
  }

  return { msg: 'Feedback submitted successfully!' };
};

module.exports = { sendFeedback };
