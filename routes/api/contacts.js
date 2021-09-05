const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts')
const {createValidation, updateValidation, updateStatusValidation, validateMongoId} = require('./validation')

router.get('/', ctrl.getAllContacts);

router.get('/:contactId', validateMongoId, ctrl.getByIdContact);

router.post('/', createValidation, ctrl.addContact);

router.delete('/:contactId', validateMongoId, ctrl.deleteContact);

router.put('/:contactId', updateValidation, validateMongoId, ctrl.updateContact);

router.patch('/:contactId/favorite', validateMongoId,updateStatusValidation, ctrl.updateStatusContact
);

module.exports = router;