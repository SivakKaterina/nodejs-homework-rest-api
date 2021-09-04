const Contacts = require('../repositories/index');


const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res
      .status(200)
      .json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

const getByIdContact =  async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

const addContact =  async (req, res, next) => {
  try {
    const contacts = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

const deleteContact =  async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, message: 'Contact deleted', data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

const updateContact =  async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const contact = await Contacts.updateStatusContact(
      req.params.contactId,
      req.body.favorite,
    );
    
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getByIdContact,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact,
}