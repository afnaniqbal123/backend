// server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const databasePath = './database.json';

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(databasePath, 'utf-8');
    const tasks = JSON.parse(data);
    res.json(tasks);
  } catch (error) {
    console.error('Error reading tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Add a task
app.post('/api/tasks', async (req, res) => {
  const { task } = req.body;
  console.log(task);
  try {
    const data = await fs.readFile(databasePath, 'utf-8');
    const tasks = JSON.parse(data);
    tasks.push(task);
    await fs.writeFile(databasePath, JSON.stringify(tasks, null, 2));
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Error adding task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const data = await fs.readFile(databasePath, 'utf-8');
    let tasks = JSON.parse(data);
    tasks = tasks.filter((task, index) => index !== parseInt(taskId));
    await fs.writeFile(databasePath, JSON.stringify(tasks, null, 2));
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
