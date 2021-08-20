const fs = require('fs/promises');
const path = require('path');

const { v4: uuid } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');
const readFile = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8')
  return JSON.parse(data)
};

const listContacts = async () => {
  return await readFile();
}

const getContactById = async (contactId) => {
  const data = await readFile();
   const result = isNaN(contactId)
    ? data.find(contact => contact.id === contactId)
    : data.find(contact => contact.id === +contactId);
  return result;
}

const removeContact = async (contactId) => {
  const data = await readFile();
  const index = isNaN(contactId)
    ? data.findIndex(contact => contact.id === contactId)
    : data.findIndex(contact => contact.id === +contactId);
  if (index !== -1) {
    const result = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return result;
  }
  return null;
}

const addContact = async body => {
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  const data = await readFile();
  data.push(record);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return record;
};

const updateContact = async (contactId, body) => {
 const data = await readFile();
   const [result] = isNaN(contactId)
    ? data.filter(contact => contact.id === contactId)
    : data.filter(contact => contact.id === +contactId);
  if (result) {
  Object.assign(result, body);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  }
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
