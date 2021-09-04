const express = require('express')
const router = express.Router()
const guard = require('../../helpers/guard')
const {
  getAll,
  getById,
  contactAdd,
  contactDell,
  contactUpdate,
  contactStatusUpdate,
} = require('../../controllers/contacts-ctrl')

const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validationID,
} = require('../../validation/validationContacts')

router
  .get('/', guard, getAll)
  .post('/', guard, validationCreateContact, contactAdd)

router
  .get('/:contactId', guard, validationID, getById)
  .delete('/:contactId', guard, validationID, contactDell)
  .put(
    '/:contactId',
    guard,
    validationID,
    validationUpdateContact,
    contactUpdate
  )

router.patch(
  '/:contactId/favorite',
  guard,
  validationID,
  validationUpdateStatusContact,
  contactStatusUpdate
)

module.exports = router
