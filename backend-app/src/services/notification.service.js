const Notification = require('../models/Notification');

/**
 * Create a new notification document.
 * @param {{ type: 'feedback'|'contact', title: string, description: string, meta?: object }} data
 */
const createNotification = async ({ type, title, description, meta = {} }) => {
  const doc = await Notification.create({ type, title, description, meta });
  return doc;
};

/**
 * Return all notifications, newest first.
 * @param {{ limit?: number }} opts
 */
const getNotifications = async ({ limit = 50 } = {}) => {
  return Notification.find().sort({ createdAt: -1 }).limit(limit).lean();
};

/**
 * Mark a single notification as read.
 * @param {string} id
 */
const markRead = async (id) => {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true }).lean();
};

/**
 * Mark ALL notifications as read.
 */
const markAllRead = async () => {
  await Notification.updateMany({ read: false }, { read: true });
};

/**
 * Delete (dismiss) a single notification.
 * @param {string} id
 */
const deleteNotification = async (id) => {
  await Notification.findByIdAndDelete(id);
};

module.exports = {
  createNotification,
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
};
