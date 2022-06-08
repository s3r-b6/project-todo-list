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
    this.tasks.unshift(name);
  }
  removeTask(index) {
    this.tasks.splice(index, 1);
  }
}

class todoItem {
  //@name: string; @description: string; @dueDate: Date; @done: boolean; @priority: number (1-3) (l-m-h);
  constructor(name, description, dueDate, priority = 1) {
    this.name = name;
    this.description = description;
    if (dueDate) this.dueDate = new Date(dueDate);
    else this.dueDate = new Date();
    this.done = false;
    this.priority = priority;
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
    if (priority >= 1 && priority <= 3) this.priority = priority;
    else console.error("error: priority must be between 0 and 5");
  }
}
