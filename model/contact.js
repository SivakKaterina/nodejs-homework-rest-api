const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
  name: {
    type: String,
    min: 1,
    max: 20,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    min: 1,
    max: 20,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {
  versionKey: false,
  timestamps: true,
     toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: {},
});

const Contact = model('contact', contactSchema);
module.exports = Contact;