# Goal Tracker 🎯

A simple CLI app to track your goals, prioritize them, and monitor your progress.

## Getting Started

Everything is already set up! Just run:

```bash
npm start
```

or

```bash
node index.js
```

## Features

- **Add Goals** — Create new goals with a title, category, and priority (high/medium/low)
- **Manage Status** — Mark goals as active, done, or paused
- **Set Active Goal** — Choose which goal you're currently working on
- **Color-Coded Priorities** — Visual cues for task urgency
  - 🔴 High priority (red)
  - 🟡 Medium priority (yellow)
  - 🟢 Low priority (green)
- **Persistent Storage** — Your goals are automatically saved to a local database (goals.json)
- **Active Goal Indicator** — See which goal has a `>` arrow next to it

## How It Works

1. **Main Menu** — Choose an action from the menu
2. **Add Goal** — Create a new goal with title, category, and priority
3. **Set Current Goal** — Select which goal you want to work on next
4. **Update Status** — Change a goal's status (active → done/paused)
5. **Delete Goal** — Remove a goal you no longer need
6. **Exit** — Close the app (your data is saved)

## File Structure

- `index.js` — Main CLI application and menu
- `db.js` — Database management using JSON storage
- `goals.json` — Your goals database (created after first run)
- `package.json` — Project configuration
- `node_modules/` — Installed dependencies

## Data Persistence

All your goals are automatically saved to `goals.json` in the project folder. The file is updated every time you make changes, so your data persists between sessions.
