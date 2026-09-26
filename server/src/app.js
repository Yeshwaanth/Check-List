const express = require('express');
const checklistRoutes = require('./routes/checklistRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/checklists', checklistRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
