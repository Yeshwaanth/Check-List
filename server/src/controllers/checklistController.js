const Checklist = require('../models/Checklist');

function findChecklist(id) {
  return Checklist.findById(id);
}

exports.list = async (req, res, next) => {
  try {
    const checklists = await Checklist.find().sort({ updatedAt: -1 });
    res.json(checklists);
  } catch (error) { next(error); }
};

exports.getOne = async (req, res, next) => {
  try {
    const checklist = await findChecklist(req.params.checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found.' });
    return res.json(checklist);
  } catch (error) { return next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const checklist = await Checklist.create({ name: req.body.name });
    res.status(201).json(checklist);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const checklist = await Checklist.findByIdAndUpdate(
      req.params.checklistId,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!checklist) return res.status(404).json({ message: 'Checklist not found.' });
    return res.json(checklist);
  } catch (error) { return next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const checklist = await Checklist.findByIdAndDelete(req.params.checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found.' });
    return res.status(204).send();
  } catch (error) { return next(error); }
};

exports.addItem = async (req, res, next) => {
  try {
    const checklist = await findChecklist(req.params.checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found.' });
    checklist.items.push({ title: req.body.title });
    await checklist.save();
    return res.status(201).json(checklist);
  } catch (error) { return next(error); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const checklist = await findChecklist(req.params.checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found.' });
    const item = checklist.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Checklist item not found.' });
    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.completed !== undefined) item.completed = req.body.completed;
    await checklist.save();
    return res.json(checklist);
  } catch (error) { return next(error); }
};

exports.removeItem = async (req, res, next) => {
  try {
    const checklist = await findChecklist(req.params.checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found.' });
    const item = checklist.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Checklist item not found.' });
    item.deleteOne();
    await checklist.save();
    return res.status(204).send();
  } catch (error) { return next(error); }
};
