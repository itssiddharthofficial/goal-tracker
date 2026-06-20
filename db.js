const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'goals.json');

function loadData() {
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  }
  return { goals: [], nextId: 1 };
}

function saveData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

function initDatabase() {
  if (!fs.existsSync(dbPath)) {
    saveData({ goals: [], nextId: 1 });
  }
}

function addGoal(title, category, priority) {
  const data = loadData();
  const id = data.nextId;

  data.goals.push({
    id,
    title,
    category,
    priority,
    status: 'active',
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  data.nextId = id + 1;
  saveData(data);
  return id;
}

function getAllGoals() {
  const data = loadData();
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  return data.goals.sort((a, b) => {
    if (a.is_active !== b.is_active) return b.is_active - a.is_active;
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.created_at) - new Date(b.created_at);
  });
}

function getActiveGoal() {
  const data = loadData();
  return data.goals.find(goal => goal.is_active);
}

function setActiveGoal(goalId) {
  const data = loadData();
  data.goals.forEach(goal => goal.is_active = false);
  const goal = data.goals.find(g => g.id === goalId);
  if (goal) goal.is_active = true;
  saveData(data);
}

function clearActiveGoal() {
  const data = loadData();
  data.goals.forEach(goal => goal.is_active = false);
  saveData(data);
}

function updateGoalStatus(goalId, status) {
  const data = loadData();
  const goal = data.goals.find(g => g.id === goalId);
  if (goal) {
    goal.status = status;
    goal.updated_at = new Date().toISOString();
  }
  saveData(data);
}

function deleteGoal(goalId) {
  const data = loadData();
  data.goals = data.goals.filter(g => g.id !== goalId);
  saveData(data);
}

module.exports = {
  initDatabase,
  addGoal,
  getAllGoals,
  getActiveGoal,
  setActiveGoal,
  clearActiveGoal,
  updateGoalStatus,
  deleteGoal
};
