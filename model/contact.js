const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
  owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
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
contactSchema.plugin(mongoosePaginate);
const Contact = model('contact', contactSchema);
module.exports = Contact;