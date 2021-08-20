const fs = require("fs/promises")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const contactsPath = path.resolve("./model/contacts.json")

const listContacts = async () => {
  const data = await fs.readFile(contactsPath)
  return JSON.parse(data)
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  return contacts.find((contact) => contact.id.toString() === contactId)
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()
  const contact = contacts.find(
    (contact) => contact.id.toString() === contactId
  )
  if (!contact) {
    throw new Error("Contact not found")
  }
  const updatedContacts = contacts.filter(
    (contact) => contact.id.toString() !== contactId
  )
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts))
  return contact
}

const addContact = async (body) => {
  const id = uuidv4()
  const newContact = {
    id,
    ...body,
  }
  const contacts = await listContacts()
  contacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()
  const contact = contacts.find(
    (contact) => contact.id.toString() === contactId
  )
  if (!contact) {
    throw new Error("Contact not found")
  }
  Object.assign(contact, body)
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return contact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
