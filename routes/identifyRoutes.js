const express = require('express');
const router = express.Router();
const {
  createContact,
  findContactByEmailOrPhone,
  findSecondaryContacts,
} = require('../controllers/contactController');

router.post('/', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Email or phoneNumber must be provided.' });
  }

  try {
    const existingContact = await findContactByEmailOrPhone(email, phoneNumber);

    if (!existingContact) {
      const primaryContactId = await createContact(email, phoneNumber, 'primary');

      const response = {
        contact: {
          primaryContactId,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: [],
        },
      };

      return res.status(200).json(response);
    }

    const primaryContactId =
      existingContact.linkPrecedence === 'primary'
        ? existingContact.id
        : existingContact.linkedId;

    const secondaryContacts = await findSecondaryContacts(primaryContactId);

    const emails = secondaryContacts
      .filter((contact) => contact.email)
      .map((contact) => contact.email);

    const phoneNumbers = secondaryContacts
      .filter((contact) => contact.phoneNumber)
      .map((contact) => contact.phoneNumber);

    const secondaryContactIds = secondaryContacts
      .filter((contact) => contact.linkPrecedence === 'secondary')
      .map((contact) => contact.id);

    const response = {
      contact: {
        primaryContactId,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'db error.' });
  }
});

module.exports = router;
