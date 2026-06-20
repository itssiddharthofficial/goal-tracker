const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

db.initDatabase();

app.use(express.json());

// Serve React build from dist, fallback to public for legacy assets
app.use(express.static(path.join(__dirname, 'public', 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// Get all goals
app.get('/api/goals', (req, res) => {
  const goals = db.getAllGoals();
  res.json(goals);
});

// Get active goal
app.get('/api/active', (req, res) => {
  const activeGoal = db.getActiveGoal();
  res.json(activeGoal || null);
});

// Add new goal
app.post('/api/goals', (req, res) => {
  const { title, category, priority } = req.body;

  if (!title || !category || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = db.addGoal(title, category, priority);
  const goals = db.getAllGoals();
  const newGoal = goals.find(g => g.id === id);
  res.json(newGoal);
});

// Set active goal
app.put('/api/goals/:id/active', (req, res) => {
  const { id } = req.params;
  db.setActiveGoal(parseInt(id));
  const activeGoal = db.getActiveGoal();
  res.json(activeGoal);
});

// Clear active goal
app.delete('/api/goals/active', (req, res) => {
  db.clearActiveGoal();
  res.json({ success: true });
});

// Update goal status
app.put('/api/goals/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  db.updateGoalStatus(parseInt(id), status);
  const goals = db.getAllGoals();
  const updatedGoal = goals.find(g => g.id === parseInt(id));
  res.json(updatedGoal);
});

// Delete goal
app.delete('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  db.deleteGoal(parseInt(id));
  res.json({ success: true });
});

// Serve React index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dist/index.html'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log('\n🎯 Goal Tracker running on http://localhost:' + PORT);
  console.log('📝 Open your browser and navigate to http://localhost:' + PORT + '\n');
});
