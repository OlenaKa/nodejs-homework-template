const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../repositories/contacts')

const getAll = async (_, res, next) => {
  try {
    const contactsList = await listContacts()
    res
      .status(200)
      .json({ status: 'success', code: 200, data: { contactsList } })
  } catch (e) {
    next(e)
  }
}

const getById = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId)
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } })
    }
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'contact with such id wad not found',
    })
  } catch (e) {
    next(e)
  }
}

const contactAdd = async (req, res, next) => {
  try {
    const contact = await addContact(req.body)
    res.status(201).json({ status: 'success', code: 201, data: { contact } })
  } catch (e) {
    next(e)
  }
}

const contactDell = async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId)
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: { contact },
      })
    }
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'contact with such id wad not found',
    })
  } catch (e) {
    next(e)
  }
}

const contactUpdate = async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.contactId, req.body)
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } })
    }
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not found',
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { getAll, getById, contactAdd, contactDell, contactUpdate }
