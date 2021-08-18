const express = require("express")
const router = express.Router()
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model/")

const {
  validationCreateContact,
  validationUpdateContact,
} = require("./validation")

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await listContacts()
    res.json({ status: "success", code: 200, data: { contactsList } })
  } catch (e) {
    next(e)
  }
})

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId)
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } })
    }
    return res.json({
      status: "error",
      code: 404,
      message: "Not found",
    })
  } catch (e) {
    next(e)
  }
})

router.post("/", validationCreateContact, async (req, res, next) => {
  try {
    const contact = await addContact(req.body)
    res.status(201).json({ status: "success", code: 201, data: { contact } })
  } catch (e) {
    next(e)
  }
})

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId)
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        message: "contact deleted",
      })
    }
    return res.json({
      status: "error",
      code: 404,
      message: "Not found",
    })
  } catch (e) {
    next(e)
  }
})

router.put("/:contactId", validationUpdateContact, async (req, res, next) => {
  try {
    console.log("hi")
    const contact = await updateContact(req.params.contactId, req.body)
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } })
    }
    return res.json({
      status: "error",
      code: 404,
      message: "Not found",
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router
