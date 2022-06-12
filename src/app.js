export { todoProject, todoItem };

class todoProject {
  //@name: string; @description: string; @tasks: obj; @usermade: bool (used to flag non user made items)
  constructor(name, description, tasks = [], usermade = true) {
    this.name = name;
    this.description = description;
    this.usermade = usermade;
    this.tasks = tasks;
  }

  getTasks() {
    return this.tasks;
  }
  getDoneTasks() {
    let numOfTasks = this.tasks.length;
    if(numOfTasks == 0) return ''
    let doneTasks = () => {
      let counter = 0;
      for (let i in this.tasks) {
        if (this.tasks[i].getDone()) counter++;
      }
      return counter;
    };
    let numDoneTasks = doneTasks();
    return `Completed Tasks: ${numDoneTasks}/${numOfTasks}`;
  }
  addTask(name) {
    this.tasks.unshift(name);
  }
  getUsermade() {
    return this.usermade;
  }
  removeTask(index) {
    this.tasks.splice(index, 1);
  }
}

class todoItem {
  //@name: string; @description: string; @dueDate: Date; @done: boolean; @priority: number (1-3) (l-m-h);
  constructor(name, description, dueDate, priority = 1, done = false) {
    this.name = name;
    this.description = description;
    if (dueDate) this.dueDate = new Date(dueDate);
    else this.dueDate = new Date();
    this.done = done;
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
