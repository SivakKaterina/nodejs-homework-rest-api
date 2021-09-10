const Contacts = require('../repositories/index');
const { HttpCode } = require('../helpers/constants');


const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {docs: contacts, ...rest} = await Contacts.listContacts(userId, req.query);
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contacts, ...rest } });
  } catch (error) {
    next(error);
  }
};

const getByIdContact =  async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    if (contact) {
      return res
        .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
    }
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const addContact =  async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contacts.addContact(userId, req.body);
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

const deleteContact =  async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, message: 'Contact deleted', data: { contact } });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

const updateContact =  async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(userId, req.params.contactId, req.body);
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
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
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
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