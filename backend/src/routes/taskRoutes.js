const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { taskValidation, validate } = require('../middleware/validator');

// All routes require authentication
router.use(authenticate);

router.route('/').get(getTasks).post(taskValidation, validate, createTask);

router
  .route('/:id')
  .get(getTask)
  .put(taskValidation, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
