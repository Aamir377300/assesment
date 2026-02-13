const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all tasks
 * @route   GET /api/v1/tasks
 * @access  Private
 */
exports.getTasks = asyncHandler(async (req, res, next) => {
  let query;
  const { date } = req.query;

  // Build base query
  if (req.user.role === 'admin') {
    query = Task.find().populate('createdBy', 'name email');
  } else {
    query = Task.find({ createdBy: req.user._id });
  }

  // Filter by due date if provided
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query = query.where('dueDate').gte(startOfDay).lte(endOfDay);
  }

  const tasks = await query.sort('-createdAt');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

/**
 * @desc    Get single task
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  // Check ownership (users can only access their own tasks)
  if (task.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this task', 403));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Create new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  // Check ownership
  if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this task', 403));
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  // Check ownership
  if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this task', 403));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
