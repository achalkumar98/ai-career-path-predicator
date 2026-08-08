const mongoose = require('mongoose');

/**
 * A notification is created whenever a user submits feedback or sends a
 * contact message.  It is stored globally (no per-user ownership) so that
 * the admin (logged-in user) can see all incoming messages in the header bell.
 */
const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['feedback', 'contact'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    /** extra metadata – rating for feedback, subject for contact */
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Notification', notificationSchema);
