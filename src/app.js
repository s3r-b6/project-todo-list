export { todoProject, todoItem };

class todoProject {
  constructor(name, description, tasks) {
    this.name = name;
    this.description = description;
    this.tasks = tasks;
  }

  getTasks() {
    return this.tasks;
  }
  addTask(name) {
    const newTask = new todoItem(name);
    this.tasks.push(newTask);
  }
}

class todoItem {
  //@name: string; @description: string; @dueDate: Date; @done: boolean; @priority: number (1-5);
  constructor(name, description, dueDate, priority = 0) {
    this.name = name;
    this.description = description;
    if (dueDate) this.dueDate = new Date(dueDate);
    else this.dueDate = new Date();
    this.done = false;
    this.priority = 0;
  }

  getName() {
    return this.name;
  }
  getDescription() {
    return this.description;
  }
  getDueDate() {
    return this.dueDate.toDateString();
  }
  getDone() {
    return this.done;
  }
  getPriority() {
    return this.priority;
  }
  setDone(done) {
    this.done = done;
  }
  setPriority(priority) {
    if (priority >= 0 && priority <= 5) this.priority = priority;
    else console.error("error: priority must be between 0 and 5");
  }
}
