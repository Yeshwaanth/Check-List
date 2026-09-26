const express = require('express');
const Joi = require('joi');
const controller = require('../controllers/checklistController');
const validate = require('../middleware/validate');

const router = express.Router();
const checklistSchema = Joi.object({ name: Joi.string().trim().min(1).max(100).required() });
const itemSchema = Joi.object({ title: Joi.string().trim().min(1).max(200).required() });
const itemUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  completed: Joi.boolean(),
}).min(1);

router.route('/').get(controller.list).post(validate(checklistSchema), controller.create);
router.route('/:checklistId').get(controller.getOne).put(validate(checklistSchema), controller.update).delete(controller.remove);
router.post('/:checklistId/items', validate(itemSchema), controller.addItem);
router.route('/:checklistId/items/:itemId').put(validate(itemUpdateSchema), controller.updateItem).delete(controller.removeItem);

module.exports = router;
