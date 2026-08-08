const notificationService = require('../services/notification.service');

/** GET /notifications — list all, newest first */
const list = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const items = await notificationService.getNotifications({ limit });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load notifications', error: err.message });
  }
};

/** PATCH /notifications/:id/read — mark one as read */
const markRead = async (req, res) => {
  try {
    const updated = await notificationService.markRead(req.params.id);
    if (!updated) return res.status(404).json({ msg: 'Notification not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to mark notification as read', error: err.message });
  }
};

/** PATCH /notifications/read-all — mark all as read */
const markAllRead = async (req, res) => {
  try {
    await notificationService.markAllRead();
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to mark all as read', error: err.message });
  }
};

/** DELETE /notifications/:id — dismiss / delete one */
const dismiss = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.json({ msg: 'Notification dismissed' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to dismiss notification', error: err.message });
  }
};

module.exports = { list, markRead, markAllRead, dismiss };
