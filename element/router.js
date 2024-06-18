const express = require('express');
const { test } = require('./routes/test');
const { serch } = require('./routes/serch');
const { create_message_in_dialog } = require('./routes/create_message_in_dialog');
const { login } = require('./routes/login');
const { factoryList } = require('./routes/factoryList');


const router = express.Router();



router.get('/test', test)
// поиск диалога
router.post('/serch', serch)

router.post('/create_message_in_dialog', create_message_in_dialog)

// вход
router.post('/login', login)

//  список всех фабрик для этого пльзовтеля и его компании
router.post('/factoryList', factoryList)
module.exports = router 