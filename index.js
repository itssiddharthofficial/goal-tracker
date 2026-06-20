#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const db = require('./db');

db.initDatabase();

const priorityColors = {
  high: chalk.red,
  medium: chalk.yellow,
  low: chalk.green
};

const priorityOrder = { high: 3, medium: 2, low: 1 };

function getPriorityDisplay(priority) {
  return priorityColors[priority](priority.toUpperCase());
}

function formatGoal(goal, index) {
  const prefix = goal.is_active ? chalk.cyan('> ') : '  ';
  const statusBadge = goal.status === 'done'
    ? chalk.green('[DONE]')
    : goal.status === 'paused'
    ? chalk.gray('[PAUSED]')
    : chalk.blue('[ACTIVE]');

  return `${prefix}${index + 1}. ${goal.title} ${getPriorityDisplay(goal.priority)} (${goal.category}) ${statusBadge}`;
}

function displayGoals() {
  console.clear();
  console.log(chalk.bold('\n📋 My Goals\n'));

  const goals = db.getAllGoals();

  if (goals.length === 0) {
    console.log(chalk.gray('No goals yet. Add one to get started!\n'));
    return goals;
  }

  const activeGoal = db.getActiveGoal();
  console.log(chalk.cyan('Currently working on: ') + (activeGoal ? chalk.bold(activeGoal.title) : chalk.gray('None')));
  console.log();

  goals.forEach((goal, index) => {
    console.log(formatGoal(goal, index));
  });
  console.log();

  return goals;
}

async function addNewGoal() {
  console.clear();
  console.log(chalk.bold('\n➕ Add New Goal\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Goal title:',
      validate: input => input.trim().length > 0 || 'Title cannot be empty'
    },
    {
      type: 'input',
      name: 'category',
      message: 'Category (e.g., Work, Health, Learning):',
      validate: input => input.trim().length > 0 || 'Category cannot be empty'
    },
    {
      type: 'list',
      name: 'priority',
      message: 'Priority:',
      choices: ['high', 'medium', 'low']
    }
  ]);

  db.addGoal(answers.title, answers.category, answers.priority);
  console.log(chalk.green('\n✅ Goal added successfully!\n'));
}

async function setCurrentGoal() {
  const goals = displayGoals();

  if (goals.length === 0) {
    console.log(chalk.gray('No goals to select from.\n'));
    return;
  }

  const activeGoal = db.getActiveGoal();
  const choices = goals.map((goal, index) => ({
    name: formatGoal(goal, index),
    value: goal.id,
    short: goal.title
  }));

  choices.push(new inquirer.Separator());
  choices.push({ name: chalk.gray('None (clear active goal)'), value: null });

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'goalId',
      message: 'Select goal to work on:',
      choices: choices,
      default: activeGoal ? activeGoal.id : undefined
    }
  ]);

  if (answer.goalId === null) {
    db.clearActiveGoal();
    console.log(chalk.gray('\nCleared active goal.\n'));
  } else {
    db.setActiveGoal(answer.goalId);
    const goal = goals.find(g => g.id === answer.goalId);
    console.log(chalk.green(`\n✅ Now working on: ${goal.title}\n`));
  }
}

async function updateGoalStatus() {
  const goals = displayGoals();

  if (goals.length === 0) {
    console.log(chalk.gray('No goals to update.\n'));
    return;
  }

  const choices = goals.map((goal, index) => ({
    name: formatGoal(goal, index),
    value: goal.id,
    short: goal.title
  }));

  const goalAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'goalId',
      message: 'Select goal to update:',
      choices: choices
    }
  ]);

  const goal = goals.find(g => g.id === goalAnswer.goalId);

  const statusAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'status',
      message: `Update "${goal.title}" to:`,
      choices: ['active', 'done', 'paused'],
      default: goal.status
    }
  ]);

  db.updateGoalStatus(goalAnswer.goalId, statusAnswer.status);

  if (goal.is_active && statusAnswer.status !== 'active') {
    db.clearActiveGoal();
  }

  console.log(chalk.green(`\n✅ Goal updated to "${statusAnswer.status}"!\n`));
}

async function deleteGoalPrompt() {
  const goals = displayGoals();

  if (goals.length === 0) {
    console.log(chalk.gray('No goals to delete.\n'));
    return;
  }

  const choices = goals.map((goal, index) => ({
    name: formatGoal(goal, index),
    value: goal.id,
    short: goal.title
  }));

  const goalAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'goalId',
      message: 'Select goal to delete:',
      choices: choices
    }
  ]);

  const goal = goals.find(g => g.id === goalAnswer.goalId);

  const confirmAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Delete "${goal.title}"?`,
      default: false
    }
  ]);

  if (confirmAnswer.confirmed) {
    db.deleteGoal(goalAnswer.goalId);
    console.log(chalk.green('\n✅ Goal deleted!\n'));
  } else {
    console.log(chalk.gray('\nDeletion cancelled.\n'));
  }
}

async function mainMenu() {
  displayGoals();

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '➕ Add new goal', value: 'add' },
        { name: '🎯 Set currently working goal', value: 'set' },
        { name: '📝 Update goal status', value: 'update' },
        { name: '🗑️  Delete goal', value: 'delete' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }
  ]);

  switch (answer.action) {
    case 'add':
      await addNewGoal();
      break;
    case 'set':
      await setCurrentGoal();
      break;
    case 'update':
      await updateGoalStatus();
      break;
    case 'delete':
      await deleteGoalPrompt();
      break;
    case 'exit':
      console.log(chalk.cyan('\n👋 Keep working on those goals!\n'));
      process.exit(0);
  }

  await mainMenu();
}

mainMenu();
