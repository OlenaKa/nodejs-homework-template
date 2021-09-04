const Contact = require('../model/contact')

const listContacts = async (userId, query) => {
  const { favorite = null, limit = 4, offset = 0 } = query

  const searchOptions = { owner: userId }
  if (favorite !== null) {
    searchOptions.favorite = true
  }
  const data = await Contact.paginate(searchOptions, { limit, offset })
  return data
}

const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  })
  return contact
}

const removeContact = async (userId, contactId) => {
  const contact = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  })
  return contact
}

const addContact = async (body, userId) => {
  const newContact = Contact.create({ ...body, owner: userId })
  return newContact
}

const updateContact = async (userId, contactId, body) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  )
  return contact
}

const updateContactStatus = async (userId, contactId, body) => {
  const contact = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { favorite: body.favorite },
    { new: true }
  )
  return contact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
}
