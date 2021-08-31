const express = require('express')
const router = express.Router()
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
} = require('../../validation/validation')

router.get('/', getAll).post('/', validationCreateContact, contactAdd)

router
  .get('/:contactId', validationID, getById)
  .delete('/:contactId', validationID, contactDell)
  .put('/:contactId', validationID, validationUpdateContact, contactUpdate)

router.patch(
  '/:contactId/favorite',
  validationID,
  validationUpdateStatusContact,
  contactStatusUpdate
)

module.exports = router
