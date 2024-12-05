const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");

const TASKS_FILE = path.join(__dirname, "tasks.json");

const readTasks = async () => {
  try {
    return await fs.readJSON(TASKS_FILE);
  } catch {
    return [];
  }
};

const writeTasks = async (tasks) => {
  if (TASKS_FILE) {
    await fs.writeJSON(TASKS_FILE, tasks, { spaces: 2 });
  } else {
    const FILE = path.join(__dirname, "tasks.json");
    await fs.writeJSON(FILE, tasks, { spaces: 2 });
  }
};

// Add Task
program
  .command("add <title> [description]")
  .description("Add a new task")
  .action(async (title, description) => {
    const tasks = await readTasks();
    const existingTask = tasks.find((task) => task.title === title);
    if (existingTask) {
      console.warn(`Task title should be unique: ${title}`);
      return;
    }
    const newTask = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      title,
      description: description || "",
      status: "pending",
    };
    tasks.push(newTask);
    await writeTasks(tasks);
    console.log("Task added:", newTask);
  });

// Update Task
program
  .command("update <id> [title] [description] [status]")
  .description("Update an existing task")
  .option("--t <title>", "Updates task title")
  .option("--d <description>", "Updates task description")
  .option("--s <status>", "Updates task status")
  .action(async (id, title, description, status, options) => {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex === -1) {
      console.log("Task not found!");
      return;
    }
    const optionsFlags = {
      t: "title",
      d: "description",
      s: "status",
    };

    Object.entries(optionsFlags).forEach(([key, prop]) => {
      if (options[key]) {
        tasks[taskIndex][prop] = options[key];
      }
    });

    await writeTasks(tasks);
    console.log("Task updated:", tasks[taskIndex]);
  });

// Delete Task
program
  .command("delete <id>")
  .description("Delete a task")
  .action(async (id) => {
    const tasks = await readTasks();
    const updatedTasks = tasks.filter((task) => task.id !== parseInt(id));
    if (tasks.length === updatedTasks.length) {
      console.log("Task not found!");
      return;
    }
    await writeTasks(updatedTasks);
    console.log("Task deleted.");
  });

// LIst All Tasks

// todo add filter to list by status and custom filter or date. Check how tu run it from terminal outside of the project, probably zhsl file needs to be updated. Enabled debugger in vscode
program
  .command("list")
  .description("List all tasks")
  .action(async (id) => {
    const tasks = await readTasks();
    if (tasks.length === 0) {
      console.log("Tasks not found!");
      return;
    }
    console.info("------List of all tasks-------");
    console.table(tasks);
  });

program.parse(process.argv);
