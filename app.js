const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const boolParser = require('express-query-boolean');
const { limiterAPI } = require('./helpers/constants')
require('dotenv').config();
AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: 10000 }))
app.use(boolParser());

app.use('/api/', rateLimit(limiterAPI))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/contacts',require('./routes/api/contacts'))

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app;
