const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/contacts');
const guard = require('../../../helpers/guard');

const {createValidation, updateValidation, updateStatusValidation, validateMongoId} = require('./validation')

router.get('/', guard,ctrl.getAllContacts);

router.get('/:contactId', guard, validateMongoId, ctrl.getByIdContact);

router.post('/', guard, createValidation, ctrl.addContact);

router.delete('/:contactId', guard, validateMongoId, ctrl.deleteContact);

router.put('/:contactId', guard, updateValidation, validateMongoId, ctrl.updateContact);

router.patch('/:contactId/favorite', guard, validateMongoId,updateStatusValidation, ctrl.updateStatusContact
);

module.exports = router;