const express = require('express');
const router = express.Router();
const {addTodo} = require('../controllers/todo');

router.post('/command', addTodo);

module.exports = router;
