#!/usr/bin/env node

const chalk = require('chalk');
const db = require('./db');

db.initDatabase();

function getStats() {
  const goals = db.getAllGoals();
  const activeGoal = db.getActiveGoal();

  const total = goals.length;
  const done = goals.filter(g => g.status === 'done').length;
  const inProgress = goals.filter(g => g.status === 'active').length;
  const paused = goals.filter(g => g.status === 'paused').length;
  const percentComplete = total === 0 ? 0 : Math.round((done / total) * 100);

  return {
    goals,
    activeGoal,
    total,
    done,
    inProgress,
    paused,
    percentComplete
  };
}

function createProgressBar(percent, width = 30) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return '[' + chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty)) + ']';
}

function displayDashboard() {
  console.clear();
  const stats = getStats();

  // Header
  console.log(chalk.cyan.bold('\n╔══════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║') + chalk.bold('           🎯 GOAL TRACKER DASHBOARD') + chalk.cyan.bold('                  ║'));
  console.log(chalk.cyan.bold('╚══════════════════════════════════════════════════════════╝\n'));

  // Currently Working On Section
  console.log(chalk.bold('📌 Currently Working On:\n'));
  if (stats.activeGoal) {
    const priorityColor = stats.activeGoal.priority === 'high' ? chalk.red
      : stats.activeGoal.priority === 'medium' ? chalk.yellow
      : chalk.green;

    console.log('  ' + chalk.cyan('┌' + '─'.repeat(54) + '┐'));
    console.log('  ' + chalk.cyan('│') + chalk.bold.cyan('  ' + stats.activeGoal.title.substring(0, 50)) + ' '.repeat(Math.max(0, 50 - stats.activeGoal.title.length)) + chalk.cyan('  │'));
    console.log('  ' + chalk.cyan('│') + '  Category: ' + chalk.bold(stats.activeGoal.category) + ' | Priority: ' + priorityColor.bold(stats.activeGoal.priority.toUpperCase()) + ' '.repeat(Math.max(0, 30 - stats.activeGoal.category.length - stats.activeGoal.priority.length)) + chalk.cyan('│'));
    console.log('  ' + chalk.cyan('└' + '─'.repeat(54) + '┘'));
  } else {
    console.log('  ' + chalk.cyan('┌' + '─'.repeat(54) + '┐'));
    console.log('  ' + chalk.cyan('│') + chalk.gray('        Nothing active right now') + ' '.repeat(22) + chalk.cyan('│'));
    console.log('  ' + chalk.cyan('└' + '─'.repeat(54) + '┘'));
  }

  // Stats Line
  console.log(chalk.bold('\n📊 Progress:\n'));
  console.log(`  Total Goals: ${chalk.bold(stats.total)}  |  Done: ${chalk.green.bold(stats.done)}  |  In Progress: ${chalk.blue.bold(stats.inProgress)}  |  Paused: ${chalk.gray.bold(stats.paused)}`);

  // Progress Bar
  console.log(chalk.bold('\n📈 Completion:\n'));
  const progressBar = createProgressBar(stats.percentComplete, 40);
  console.log(`  ${progressBar}  ${chalk.bold(stats.percentComplete + '%')}`);

  // Goal Breakdown
  if (stats.goals.length > 0) {
    console.log(chalk.bold('\n📋 Goal Breakdown:\n'));

    const activeGoals = stats.goals.filter(g => g.status === 'active');
    const doneGoals = stats.goals.filter(g => g.status === 'done');
    const pausedGoals = stats.goals.filter(g => g.status === 'paused');

    if (activeGoals.length > 0) {
      console.log('  ' + chalk.blue.bold('ACTIVE:'));
      activeGoals.forEach(goal => {
        const marker = goal.is_active ? chalk.cyan('  > ') : '    ';
        const priorityBadge = goal.priority === 'high' ? chalk.red('●')
          : goal.priority === 'medium' ? chalk.yellow('●')
          : chalk.green('●');
        console.log(marker + priorityBadge + '  ' + goal.title + chalk.gray(` (${goal.category})`));
      });
    }

    if (doneGoals.length > 0) {
      console.log('\n  ' + chalk.green.bold('DONE:'));
      doneGoals.forEach(goal => {
        const priorityBadge = goal.priority === 'high' ? chalk.red('●')
          : goal.priority === 'medium' ? chalk.yellow('●')
          : chalk.green('●');
        console.log('    ' + priorityBadge + '  ' + chalk.strikethrough(goal.title) + chalk.gray(` (${goal.category})`));
      });
    }

    if (pausedGoals.length > 0) {
      console.log('\n  ' + chalk.gray.bold('PAUSED:'));
      pausedGoals.forEach(goal => {
        const priorityBadge = goal.priority === 'high' ? chalk.red('●')
          : goal.priority === 'medium' ? chalk.yellow('●')
          : chalk.green('●');
        console.log('    ' + priorityBadge + '  ' + chalk.gray(goal.title) + chalk.gray(` (${goal.category})`));
      });
    }
  }

  console.log(chalk.cyan('\n╔══════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║') + chalk.gray('  Run "npm start" to open the web interface') + ' '.repeat(8) + chalk.cyan('║'));
  console.log(chalk.cyan('╚══════════════════════════════════════════════════════════╝\n'));
}

// Main command handler
const command = process.argv[2];

if (command === 'dashboard') {
  displayDashboard();
} else if (command === 'help') {
  console.log('\nGoal Tracker CLI\n');
  console.log('Usage: node app.js [command]\n');
  console.log('Commands:');
  console.log('  dashboard   Show the dashboard view');
  console.log('  help        Show this help message\n');
} else if (!command) {
  displayDashboard();
} else {
  console.log('Unknown command: ' + command);
  console.log('Run: node app.js help\n');
}
