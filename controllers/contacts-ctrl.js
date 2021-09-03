const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
} = require('../repositories/contacts')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { docs: contactsList, ...rest } = await listContacts(
      userId,
      req.query
    )
    res
      .status(200)
      .json({ status: 'success', code: 200, data: { contactsList, ...rest } })
  } catch (e) {
    next(e)
  }
}

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await getContactById(userId, req.params.contactId)
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
    const userId = req.user.id
    const contact = await addContact(req.body, userId)
    res.status(201).json({ status: 'success', code: 201, data: { contact } })
  } catch (e) {
    next(e)
  }
}

const contactDell = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await removeContact(userId, req.params.contactId)
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
    const userId = req.user.id
    const contact = await updateContact(userId, req.params.contactId, req.body)
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

const contactStatusUpdate = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await updateContactStatus(
      userId,
      req.params.contactId,
      req.body
    )
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

module.exports = {
  getAll,
  getById,
  contactAdd,
  contactDell,
  contactUpdate,
  contactStatusUpdate,
}
