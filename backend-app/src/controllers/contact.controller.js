const contactService = require('../services/contact.service');

const sendContactMessage = async (req, res) => {
  try {
    const result = await contactService.sendContactMessage(req.body);
    res.json(result);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Failed to send contact message' });
  }
};

module.exports = {
  sendContactMessage,
};
