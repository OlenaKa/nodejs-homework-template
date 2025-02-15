const { Schema, model, SchemaTypes } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const contactSchema = new Schema(
  {
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

contactSchema.plugin(mongoosePaginate)

const Contact = model('contact', contactSchema)
module.exports = Contact
