const express = require('express');
const { test } = require('./routes/test');
const { search } = require('./routes/search');
const { create_message_in_dialog } = require('./routes/create_message_in_dialog');
const { login } = require('./routes/login');


const router = express.Router();



router.get('/test', test)
// поиск диалога
router.post('/search', search)

router.post('/create_message_in_dialog',create_message_in_dialog)

// вход
router.post('/login',login)
module.exports = router 