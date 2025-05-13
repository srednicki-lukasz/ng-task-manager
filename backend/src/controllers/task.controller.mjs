import Task from '../models/task.model.mjs';

/**
 * @desc	Get tasks
 * @route	GET /api/tasks
 */
export const getTasks = async (req, res) => {
  try {
    const filter = {};
    const { status, title } = req.query;

    if (status) {
      if (!['active', 'completed'].includes(status)) {
        return res.status(400).json('Incorrect task status.');
      }

      filter.status = status;
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc	Create task
 * @route	POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const saved = await new Task({ title, description }).save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc	Update task
 * @route	PUT /api/tasks/{id}
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updated = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true, runValidator: true });
    if (!updated) return res.status(404).json({ message: 'Task not found.' });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc	Delete task
 * @route	DELETE /api/tasks/{id}
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found.' });
    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};
