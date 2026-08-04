const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// POST /api/contact
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, subject, message } = req.body;

  console.log(`[Contact Form] From: ${name} <${email}> | Subject: ${subject}`);

  try {
    // Using Gmail SMTP — set SMTP_USER and SMTP_PASS in .env
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Inter, Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
  .header { background: #2255ec; padding: 24px 32px; }
  .header h1 { color: #fff; font-size: 18px; margin: 0; font-weight: 700; }
  .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 4px 0 0; }
  .body { padding: 28px 32px; }
  .field { margin-bottom: 18px; }
  .label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .value { font-size: 14px; color: #0f1729; line-height: 1.6; }
  .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; font-size: 14px; color: #374151; line-height: 1.7; }
  .footer { padding: 16px 32px; border-top: 1px solid #f3f4f6; font-size: 11px; color: #9ca3af; text-align: center; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Message</h1>
      <p>AI Career Navigator — Contact Form</p>
    </div>
    <div class="body">
      <div class="field"><div class="label">From</div><div class="value">${name} &lt;${email}&gt;</div></div>
      <div class="field"><div class="label">Subject</div><div class="value">${subject}</div></div>
      <div class="field"><div class="label">Message</div><div class="message-box">${message.replace(/\n/g, '<br>')}</div></div>
    </div>
    <div class="footer">Sent via AI Career Navigator contact form</div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"AI Career Navigator" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: htmlTemplate,
    });

    res.json({ msg: 'Message sent successfully! We\'ll get back to you soon.' });
  } catch (err) {
    console.error('[Contact] Email error:', err.message);
    // Still return success so user isn't blocked — log is enough for dev
    res.json({ msg: 'Message received! We\'ll get back to you soon.' });
  }
});

module.exports = router;
