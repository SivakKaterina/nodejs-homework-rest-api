const Contact = require('../model/contact');

const listContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
     favorite = null,
    limit = 5,
    page = 1,
  } = query;
  const optionSearch = { owner: userId };

  if (favorite !== null) {
    optionSearch.favorite = favorite;
  };

  const results = await Contact.paginate(optionSearch,
    {
      limit,
      page,
      sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
      path: 'owner',
      select: 'email subscription -_id',
  },
  });
  return results;
};

const getContactById = async (userId, contactId) => {
  const results = await Contact
    .findOne({ _id: contactId, owner: userId })
    .populate({
    path: 'owner',
    select: 'email subscription -_id',
  });
  return results;
};

const removeContact = async (userId, contactId) => {
    const result = await Contact.findOneAndRemove({ _id: contactId, owner: userId });
   return result;
};

const addContact = async (userId, body) => {
  const result = await Contact.create({ ...body, owner: userId });
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId},
    { ...body },
    { upsert: true },
  );
  return result;
};

const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { favorite: body },
    { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};