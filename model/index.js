const fs = require("fs/promises")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const contactsPath = path.resolve("./model/contacts.json")

const readContacts = async () => {
  const data = await fs.readFile(contactsPath)
  return JSON.parse(data)
}

const listContacts = async () => {
  return await readContacts()
}

const getContactById = async (contactId) => {
  const contacts = await readContacts()
  return contacts.find((contact) => contact.id.toString() === contactId)
}

const removeContact = async (contactId) => {
  const contacts = await readContacts()
  const contact = contacts.find(
    (contact) => contact.id.toString() === contactId
  )
  const index = contacts.indexOf(contact)
  if (index === -1) {
    return null
  }
  const removedContact = contacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return removedContact
}

const addContact = async (body) => {
  const id = uuidv4()
  try {
    const newContact = {
      id,
      ...body,
    }
    const contacts = await readContacts()
    contacts.push(newContact)
    await fs.writeFile(contactsPath, JSON.stringify(contacts))
    return newContact
  } catch (e) {}
}

const updateContact = async (contactId, body) => {
  const contacts = await readContacts()
  const contact = contacts.find(
    (contact) => contact.id.toString() === contactId
  )
  if (!contact) {
    return null
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
