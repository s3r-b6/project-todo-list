import { todoProject, todoItem } from "./app.js";
let projectList = [];

window.onload = () => {
  //tests
  defaultItems();
  showProjects();
  addProjectListener();
};

//initialize projects
function showProjects() {
  //button to add projects
  document.querySelector("#projects").innerHTML = `
  <div id="addProject">
      <button id="addProjectButton">Add Project</button>
      <div id="addProjectForm"></div>
  </div>
  `;
  //loop to add the projects in the projectList array
  for (let i = 0; i < projectList.length; i++) {
    document.querySelector("#projects").innerHTML += `
    <div class="project${i}">
      <h2>${projectList[i].name}</h2>
      <p>${projectList[i].description}</p>
      <p> 6/7 </p>
      <button id="showTask">Show tasks</button>
      <button id="addTask">Add a task</button>
      <button id="deleteProject">Delete project</button>
      <div id="newTaskFormContainer${i}"></div>
      <div id="taskList${i}"></div>
    </div>  
  `;
  }
  showTasksListener();
  addTaskListener();
  deleteProjectListener();
}

//this should delete the placeholder projects and show the user ones
function addProjectListener() {
  let projectForm = document.querySelector("#addProjectForm");
  document.querySelector("#addProjectButton").addEventListener("click", () => {
    if (projectForm.innerHTML != "") {
      document.querySelector("#addProjectButton").innerHTML = "Add project";
      projectForm.innerHTML = "";
    } else {
      document.querySelector("#addProjectButton").innerHTML = "Hide menu";
      projectForm.innerHTML = `
      <input id="projectName" type="text" name="project-name" placeholder="Project name">
      <input id="projectDescription" type"text" name="project-description" placeholder="Description">
      <button id="projectSubmit"> Submit </button>
        `;
      document.querySelector("#projectSubmit").addEventListener("click", () => {
        let projectName = document.querySelector("#projectName").value;
        let projectDescription = document.querySelector(
          "#projectDescription"
        ).value;
        if (
          /[\w\d]{1,25}/.test(projectName) &&
          /[\w\d]{1,144}/.test(projectDescription)
        ) {
          const newProject = new todoProject(
            projectName.toString(),
            projectDescription.toString()
          );
          projectList.push(newProject);
          showProjects();
          addProjectListener();
          console.log(projectList)
        } else {
          alert("bad input");
        }
      });
    }
  });
}

//showTasks event listener
function showTasksListener() {
  document.querySelectorAll("#showTask").forEach((el) => {
    el.addEventListener("click", function (e) {
      // console.log(e.target.parentNode);
      let eventClass = e.target.parentNode.classList[0];
      let eventIndex = eventClass[eventClass.length - 1];
      let taskListSelector = document.querySelector(`#taskList${eventIndex}`);
      // console.log(eventIndex);
      //if tasks are already shown, hide them
      if (taskListSelector.innerHTML == "") {
        document.querySelector(`.project${eventIndex}>#showTask`).innerHTML =
          "Hide tasks";
        showTasks(eventIndex, taskListSelector);
      } else {
        document.querySelector(`.project${eventIndex}>#showTask`).innerHTML =
          "Show tasks";
        taskListSelector.innerHTML = "";
      }
    });
  });
}

//deleteTask event listener
function deleteTaskListener(eventIndex, taskListSelector) {
  document.querySelectorAll("#deleteTask").forEach((el) => {
    el.addEventListener("click", function (e) {
      let taskN = e.target.parentNode.parentNode.classList[0];
      let taskI = taskN[taskN.length - 1];
      // console.log(taskI);
      //placeholder || lo suyo sería crear una alerta custom que devuelva un bool
      let deleteTask = confirm("Are you sure you want to delete this task?");
      if (deleteTask) {
        projectList[eventIndex].removeTask(taskI);
        showTasks(eventIndex, taskListSelector);
      } else {
        showTasks(eventIndex, taskListSelector);
      }
      // console.log(projectList[eventIndex].getTasks());
      showTasks(eventIndex, taskListSelector);
    });
  });
}

//delete project event listener
function deleteProjectListener() {
  document.querySelectorAll("#deleteProject").forEach((el) => {
    el.addEventListener("click", function (e) {
      let eventClass = e.target.parentNode.classList[0];
      let eventIndex = eventClass[eventClass.length - 1];

      // console.log(eventIndex);
      //placeholder || lo suyo sería crear una alerta custom que devuelva un bool
      let deleteProject = confirm(
        "Are you sure you want to delete this project?"
      );
      if (deleteProject) {
        projectList.splice(eventIndex, 1);
        showProjects();
      } else {
        showProjects();
      }
    });
  });
}

//ahora mismo, el botón de showtasks reemplaza al botón de add task (porque cambia el html), además, falta la lógica que añada la task al project
function addTaskListener() {
  document.querySelectorAll("#addTask").forEach((el) => {
    el.addEventListener("click", function (e) {
      let eventClass = e.target.parentNode.classList[0];
      let eventIndex = eventClass[eventClass.length - 1];
      let formContainer = document.querySelector(
        `#newTaskFormContainer${eventIndex}`
      );
      //if formContainer is empty, add the form, else, empty the container
      if (formContainer.innerHTML == "") {
        document.querySelector(`.project${eventIndex}>#addTask`).innerHTML =
          "Hide menu";
        formContainer.innerHTML = `
        <form id="newTaskForm${eventIndex}" onsubmit="return false">
          <input type="text" id="taskNameForm" placeholder="Task name">
          <input type="text" id="taskDescriptionForm" placeholder="Task description">
          <input type="date" id="taskDueDateForm" placeholder="Task due date">
          <div id="priorityContainer">
            <label for="priority">Priority</label>
            <select id="priorityForm">
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
          <button id="addTaskToProject">Add task to project</button>
        </form>
        `;
        let addTaskButton = document.querySelector(
          `#newTaskForm${eventIndex}>#addTaskToProject`
        );
        addTaskButton.addEventListener("click", (e) => {
          let eventClass = e.target.parentNode.id;
          let eventIndex = eventClass[eventClass.length - 1];
          let taskListSelector = document.querySelector(
            `#taskList${eventIndex}`
          );

          let taskName = document.querySelector(
            `#newTaskForm${eventIndex}>#taskNameForm`
          ).value;
          let taskDescription = document.querySelector(
            `#newTaskForm${eventIndex}>#taskDescriptionForm`
          ).value;
          let taskDueDate = document.querySelector(
            `#newTaskForm${eventIndex}>#taskDueDateForm`
          ).value;
          let taskPriority = document.querySelector(
            `#newTaskForm${eventIndex}>#priorityContainer>#priorityForm`
          ).value;
          if (
            /[\w\d]{1,25}/.test(taskName) &&
            /[\w\d]{1,144}/.test(taskDescription) &&
            /[123]{1}/.test(taskPriority)
          ) {
            const addedTodoItem = new todoItem(
              taskName.toString(),
              taskDescription.toString(),
              taskDueDate,
              taskPriority
            );
            projectList[eventIndex].addTask(addedTodoItem);
            showTasks(eventIndex, taskListSelector);
          } else {
            //placeholder || crear una alerta custom
            alert("bad input");
          }
        });
      } else {
        document.querySelector(`.project${eventIndex}>#addTask`).innerHTML =
          "Add a task";
        formContainer.innerHTML = "";
      }
    });
  });
}

//show tasks logic; is called when triggered by the showTask event listener, but also when a task is added or deleted
function showTasks(eventIndex, taskListSelector) {
  let currentProjectTasks = projectList[eventIndex].getTasks();
  // console.log(currentProjectTasks.length);
  taskListSelector.innerHTML = "";
  for (let i = 0; i < currentProjectTasks.length; i++) {
    //if task.getDone == true; don't show priority setter
    if (currentProjectTasks[i].getDone()) {
      taskListSelector.innerHTML += `
          <div class="task${i}">
            <h3>${currentProjectTasks[i].getName()}</h3>
            <p>${currentProjectTasks[i].getDescription()}</p>
            <p>${currentProjectTasks[i].getDueDate()}</p>
            <div id="buttonContainer">
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
    } else {
      //if task is undone, show priority setter
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
    }
    // console.log(currentProjectTasks, i);
    drawColors(currentProjectTasks, eventIndex, i);
  }
  setDone(currentProjectTasks, eventIndex, taskListSelector);
  setPriority(currentProjectTasks, eventIndex, taskListSelector);
  deleteTaskListener(eventIndex, taskListSelector);
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
function setDone(currentProjectTasks, eventIndex, taskListSelector) {
  document.querySelectorAll("#doneTask").forEach((el) => {
    el.addEventListener("change", function (e) {
      //gets the task index from the class name
      let taskN = e.target.parentNode.parentNode.parentNode.classList[0];
      let taskI = taskN[taskN.length - 1];
      // console.log(taskI);
      if (this.checked) {
        currentProjectTasks[taskI].setDone(true);
        showTasks(eventIndex, taskListSelector);
        // console.log("taskDone is now: " + currentProjectTasks[taskI].getDone());
        // console.log(currentProjectTasks[taskI]);
      } else {
        currentProjectTasks[taskI].setDone(false);
        showTasks(eventIndex, taskListSelector);
        // console.log("taskDone is now: " + currentProjectTasks[taskI].getDone());
        // console.log(currentProjectTasks[taskI]);
      }
    });
  });
}

function setPriority(currentProjectTasks, eventIndex, taskListSelector) {
  document.querySelectorAll("#priorityTask").forEach((el) => {
    el.addEventListener("click", function (e) {
      //gets the task index from the class name
      let taskN = e.target.parentNode.parentNode.classList[0];
      let taskI = taskN[taskN.length - 1];
      // console.log(taskI);
      // console.log(taskI);
      if (currentProjectTasks[taskI].getPriority() == 1) {
        currentProjectTasks[taskI].setPriority(2);
        showTasks(eventIndex, taskListSelector);
      } else if (currentProjectTasks[taskI].getPriority() == 2) {
        currentProjectTasks[taskI].setPriority(3);
        showTasks(eventIndex, taskListSelector);
      } else {
        currentProjectTasks[taskI].setPriority(1);
        showTasks(eventIndex, taskListSelector);
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
  todoItem2.setPriority(3);

  // console.log(projectList);
  // console.log(todoProject1.getTasks(), todoProject2.getTasks());
}
