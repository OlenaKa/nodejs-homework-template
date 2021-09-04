const { HTTP_CODE } = require('../helpers/constants')
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
    res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: { contactsList, ...rest },
    })
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
        .status(HTTP_CODE.OK)
        .json({ status: 'success', code: HTTP_CODE.OK, data: { contact } })
    }
    return res.status(HTTP_CODE.BAD_REQUEST).json({
      status: 'error',
      code: HTTP_CODE.BAD_REQUEST,
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
    res
      .status(HTTP_CODE.CREATED)
      .json({ status: 'success', code: HTTP_CODE.CREATED, data: { contact } })
  } catch (e) {
    next(e)
  }
}

const contactDell = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await removeContact(userId, req.params.contactId)
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: 'success',
        code: HTTP_CODE.OK,
        data: { contact },
      })
    }
    return res.status(HTTP_CODE.BAD_REQUEST).json({
      status: 'error',
      code: HTTP_CODE.BAD_REQUEST,
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
        .status(HTTP_CODE.OK)
        .json({ status: 'success', code: HTTP_CODE.OK, data: { contact } })
    }
    return res.status(HTTP_CODE.NOT_FOUND).json({
      status: 'error',
      code: HTTP_CODE.NOT_FOUND,
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
        .status(HTTP_CODE.OK)
        .json({ status: 'success', code: HTTP_CODE.OK, data: { contact } })
    }
    return res.status(HTTP_CODE.NOT_FOUND).json({
      status: 'error',
      code: HTTP_CODE.NOT_FOUND,
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
