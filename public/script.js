// Fetch and display all goals
async function loadGoals() {
  try {
    const response = await fetch('/api/goals');
    const goals = await response.json();
    displayGoals(goals);
    updateStats(goals);
    loadActiveGoal();
  } catch (error) {
    console.error('Error loading goals:', error);
  }
}

// Update stats and progress bar
function updateStats(goals) {
  const total = goals.length;
  const done = goals.filter(g => g.status === 'done').length;
  const inProgress = goals.filter(g => g.status === 'active').length;
  const paused = goals.filter(g => g.status === 'paused').length;
  const percentComplete = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statInProgress').textContent = inProgress;
  document.getElementById('statDone').textContent = done;
  document.getElementById('statPaused').textContent = paused;
  document.getElementById('progressPercent').textContent = percentComplete + '%';
  document.getElementById('progressFill').style.width = percentComplete + '%';
}

// Display goals in the list
function displayGoals(goals) {
  const goalsList = document.getElementById('goalsList');

  if (goals.length === 0) {
    goalsList.innerHTML = '<p class="empty-state">No goals yet. Add one to get started!</p>';
    return;
  }

  goalsList.innerHTML = goals.map(goal => `
    <div class="goal-card ${goal.is_active ? 'active' : ''} ${goal.status === 'done' ? 'done' : ''}">
      <div class="goal-info">
        <div class="goal-title">${escapeHtml(goal.title)}</div>
        <div class="goal-meta">
          <span class="goal-category">${escapeHtml(goal.category)}</span>
          <span class="goal-priority ${goal.priority}">${goal.priority.toUpperCase()}</span>
          <span class="goal-status ${goal.status}">${goal.status.toUpperCase()}</span>
        </div>
      </div>
      <div class="goal-actions">
        ${!goal.is_active ? `<button class="btn btn-small btn-primary" onclick="setActiveGoal(${goal.id})">Set Active</button>` : ''}
        ${goal.status === 'active' ? `<button class="btn btn-small btn-success" onclick="updateStatus(${goal.id}, 'done')">✓ Done</button>` : ''}
        ${goal.status === 'active' ? `<button class="btn btn-small btn-warning" onclick="updateStatus(${goal.id}, 'paused')">⏸ Pause</button>` : ''}
        ${goal.status !== 'active' ? `<button class="btn btn-small btn-primary" onclick="updateStatus(${goal.id}, 'active')">Resume</button>` : ''}
        <button class="btn btn-small btn-danger" onclick="deleteGoal(${goal.id})">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

// Load and display current active goal
async function loadActiveGoal() {
  try {
    const response = await fetch('/api/active');
    const activeGoal = await response.json();
    displayCurrentGoal(activeGoal);
  } catch (error) {
    console.error('Error loading active goal:', error);
  }
}

// Display current active goal
function displayCurrentGoal(goal) {
  const currentGoalDiv = document.getElementById('currentGoal');

  if (!goal) {
    currentGoalDiv.innerHTML = '<p class="no-goal">Nothing active right now</p>';
    return;
  }

  currentGoalDiv.innerHTML = `
    <div class="current-goal-content">
      <div class="current-goal-title">${escapeHtml(goal.title)}</div>
      <div class="current-goal-meta">
        Category: <strong>${escapeHtml(goal.category)}</strong> |
        Priority: <strong>${goal.priority.toUpperCase()}</strong>
      </div>
    </div>
  `;
}

// Add new goal
document.getElementById('goalForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('goalTitle').value.trim();
  const category = document.getElementById('goalCategory').value.trim();
  const priority = document.getElementById('goalPriority').value;

  if (!title || !category || !priority) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, priority })
    });

    if (response.ok) {
      document.getElementById('goalForm').reset();
      loadGoals();
    } else {
      alert('Error adding goal');
    }
  } catch (error) {
    console.error('Error adding goal:', error);
    alert('Error adding goal');
  }
});

// Set active goal
async function setActiveGoal(goalId) {
  try {
    await fetch(`/api/goals/${goalId}/active`, {
      method: 'PUT'
    });
    loadGoals();
  } catch (error) {
    console.error('Error setting active goal:', error);
  }
}

// Update goal status
async function updateStatus(goalId, status) {
  try {
    await fetch(`/api/goals/${goalId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadGoals();
  } catch (error) {
    console.error('Error updating goal status:', error);
  }
}

// Delete goal
async function deleteGoal(goalId) {
  if (!confirm('Are you sure you want to delete this goal?')) {
    return;
  }

  try {
    await fetch(`/api/goals/${goalId}`, {
      method: 'DELETE'
    });
    loadGoals();
  } catch (error) {
    console.error('Error deleting goal:', error);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load goals on page load
loadGoals();
