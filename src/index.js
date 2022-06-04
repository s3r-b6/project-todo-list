import { todoProject, todoItem } from "./app.js";
let projectList = [];

window.onload = () => {
  //tests
  defaultItems();
  showProjects();
  showListener();
};

//initialize projects
function showProjects() {
  document.querySelector("#projects").innerHTML = `
      <button id="addProject">Add Project</button>
  `;
  for (let i = 0; i < projectList.length; i++) {
    document.querySelector("#projects").innerHTML += `
    <div class="project${i}">
      <h2>${projectList[i].name}</h2>
      <p>${projectList[i].description}</p>
      <p> 6/7 </p>
      <button id="showTask">Show tasks</button>
      <button id="addTask">Add task</button>
      <button id="deleteProject">Delete project</button>
      <div id="taskList${i}"><div id="addTaskForm"></div></div>
    </div>  
  `;
  }
  addTaskListener();
}

//showTasks event listener
function showListener() {
  document.querySelectorAll("#showTask").forEach((el) => {
    el.addEventListener("click", function (e) {
      //console.log(e.target.parentNode);
      let eventClass = e.target.parentNode.classList[0];
      let eventIndex = eventClass[eventClass.length - 1];
      let taskListSelector = document.querySelector(`#taskList${eventIndex}`);
      //if tasks are already shown, hide them
      if (taskListSelector.innerHTML != "") {
        taskListSelector.innerHTML = "";
      } else {
        showTasks(eventIndex, taskListSelector);
      }
    });
  });
}

//deleteTask event listener
function deleteListener(eventIndex, taskListSelector) {
  document.querySelectorAll("#deleteTask").forEach((el) => {
    el.addEventListener("click", function (e) {
      let taskN = e.target.parentNode.parentNode.classList[0];
      let taskI = taskN[taskN.length - 1];
      console.log(taskI);
      projectList[eventIndex].removeTask(taskI);
      console.log(projectList[eventIndex].getTasks());
      showTasks(eventIndex, taskListSelector);
    });
  });
}

//ahora mismo, el botón de showtasks reemplaza al botón de add task (porque cambia el html), además, falta la lógica que añada la task al project
function addTaskListener() {
  document.querySelectorAll("#addTask").forEach((el) => {
    el.addEventListener("click", function (e) {
      let eventClass = e.target.parentNode.classList[0];
      let eventIndex = eventClass[eventClass.length - 1];
      let addTaskSelector = document.querySelector(
        `#taskList${eventIndex}>#addTaskForm`
      );
      if (addTaskSelector.innerHTML == "") {
        addTaskSelector.innerHTML += `
      <form>
        <input type="text" id="taskName" placeholder="Task name">
        <input type="text" id="taskDescription" placeholder="Task description">
        <input type="date" id="taskDueDate" placeholder="Task due date">
        <div id="priorityContainer">
          <label for="priority">Priority</label>
          <select id="priority">
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>
        <button id="addTaskToProject">Add task to project</button>
      </form>
      
      `;
      } else {
        addTaskSelector.innerHTML = "";
      }
    });
  });
}

// const task = new todoItem(
//   document.querySelector(`#taskName${eventIndex}`).value,
//   document.querySelector(`#taskDescription${eventIndex}`).value,
//   document.querySelector(`#taskDueDate${eventIndex}`).value,
//   document.querySelector(`#taskPriority${eventIndex}`).value
// );
// addTask(task);

//show tasks logic; is called when triggered by the showTask event listener, but also when a task is added or deleted
function showTasks(eventIndex, taskListSelector) {
  let currentProjectTasks = projectList[eventIndex].getTasks();
  console.log(currentProjectTasks.length);
  taskListSelector.innerHTML = "";
  for (let i = 0; i < currentProjectTasks.length; i++) {
    taskListSelector.innerHTML += `
          <div class="task${i}">
            <h3>${currentProjectTasks[i].getName()}</h3>
            <p>${currentProjectTasks[i].getDescription()}</p>
            <p>${currentProjectTasks[i].getDueDate()}</p>
            <div id="buttonContainer">
              <button id="priorityTask">Set Priority </button>
              <button id="deleteTask">Delete Task</button>
              <div id="doneContainer">
                <label for="done"> Done </label>
                <input name="done" type="checkbox" id="doneTask" ${
                  currentProjectTasks[i].getDone() ? "checked" : ""
                }>
              </div>
            </div>
          </div>
        `;
    console.log(currentProjectTasks, i);
    drawColors(currentProjectTasks, eventIndex, i);
  }
  setDone(currentProjectTasks);
  deleteListener(eventIndex, taskListSelector);
}

function drawColors(currentProjectTasks, eventIndex, i) {
  if (currentProjectTasks[i].getDone() == true) {
    //if task is done, make titles color green
    document.querySelector(`#taskList${eventIndex}>.task${i}>h3`).style.color =
      "green";
  } else if (
    currentProjectTasks[i].getPriority() > 2 &&
    currentProjectTasks[i].getDone() == false
  ) {
    //if tasks priority is high (and undone), make text red
    document.querySelector(`#taskList${eventIndex}>.task${i}>h3`).style.color =
      "red";
  } else if (
    currentProjectTasks[i].getPriority() > 1 &&
    currentProjectTasks[i].getDone() == false
  ) {
    //if tasks priority is mid (and undone), make text orange
    document.querySelector(`#taskList${eventIndex}>.task${i}>h3`).style.color =
      "orange";
  }
}
//makes the Done button interact with the task object through the setDone method
function setDone(currentProjectTasks) {
  document.querySelectorAll("#doneTask").forEach((el) => {
    el.addEventListener("change", function (e) {
      //gets the task index from the class name
      let taskN = e.target.parentNode.parentNode.parentNode.classList[0];
      let taskI = taskN[taskN.length - 1];
      console.log(taskI);
      if (this.checked) {
        currentProjectTasks[taskI].setDone(true);
        console.log("taskDone is now: " + currentProjectTasks[taskI].getDone());
        console.log(currentProjectTasks[taskI]);
      } else {
        currentProjectTasks[taskI].setDone(false);
        console.log("taskDone is now: " + currentProjectTasks[taskI].getDone());
        console.log(currentProjectTasks[taskI]);
      }
    });
  });
}

function defaultItems() {
  const todoItem1 = new todoItem(
    "Buy milk",
    "Buy milk for the family",
    new Date("2020-01-01")
  );
  const todoItem2 = new todoItem(
    "Buy eggs",
    "Buy eggs for the family",
    new Date("2020-01-01")
  );
  const todoItem3 = new todoItem(
    "Buy bread",
    "Buy bread for the family",
    new Date("2020-01-01")
  );

  const todoProject1 = new todoProject("Family", "This is the family project", [
    todoItem1,
    todoItem2,
    todoItem3,
  ]);

  const todoProject2 = new todoProject("Work", "This is the work project", [
    todoItem1,
    todoItem2,
    todoItem3,
  ]);

  projectList.push(todoProject1);
  projectList.push(todoProject2);
  todoItem1.setDone(true);
  todoItem3.setPriority(2);
  todoItem2.setPriority(5);
  todoProject1.addTask("Buy milk");

  console.log(projectList);
  console.log(todoProject1.getTasks(), todoProject2.getTasks());
}
