import { todoProject, todoItem } from "./app.js";
let projectList = [];

window.onload = () => {
  //tests
  const cachedProjects = JSON.parse(localStorage.getItem("cache"));
  if (cachedProjects) {
    //console.log(cachedProjects);
    function rebuildObjs() {
      for (let item in cachedProjects) {
        //console.log(cachedProjects[item]);
        let currentProject = cachedProjects[item];
        //name, description, tasks = [], usermade = true
        const cachedProject = new todoProject(
          currentProject.name,
          currentProject.description,
          rebuildTasks(),
          currentProject.usermadefalse
        );
        projectList.push(cachedProject);
        function rebuildTasks() {
          for (let item in currentProject.tasks) {
            //name, description, dueDate, priority = 1, done=false
            const cachedItem = new todoItem(
              currentProject.tasks[item].name,
              currentProject.tasks[item].description,
              currentProject.tasks[item].Date,
              currentProject.tasks[item].priority,
              currentProject.tasks[item].done
            );
            currentProject.tasks.splice([item], 1, cachedItem);
          }
          return currentProject.tasks;
        }
      }
    }
    rebuildObjs();
    showProjects();
  } else {
    defaultItems();
    showProjects();
  }
};

function refreshCache() {
  localStorage.clear;
  localStorage.setItem("cache", JSON.stringify(projectList));
}

//IDEA: implementar <p id="currentDone"> 6/7 </p>
//que en el overview del project salga cuántas tareas de cuántas están hechas, quizás las prioritarias, etc.

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
      <p id="currentDone"> 6/7 </p>
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
  addProjectListener();
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
          //if default items are still on project list when a user-project is added, delete them
          //as there are just 2 possible non-usermade projects, just check in the 0 and 1 indexes (deleting the 0th index would make the 1st 0, so check for 0th two times) with the provided method
          //the first test is to check if projectList[0] exists; this is, the list isn't empty; else it wouldn't let add projects
          if (projectList[0] && projectList[0].getUsermade() == false)
            projectList.splice(0, 1);
          if (projectList[0] && projectList[0].getUsermade() == false)
            projectList.splice(0, 1);
          projectList.push(newProject);
          showProjects();
          refreshCache();
        } else {
          alert("bad input");
        }
      });
    }
  });
}

//showTasks event listener
//NOTE; a is a placeholder ++ I can derive all the callbacks to another .js file to cleanup the code
function showTasksListener() {
  document.querySelectorAll("#showTask").forEach((el) => {
    el.addEventListener("click", function a(e) {
      // console.log(e.target.parentNode);
      let eventClass = e.target.parentNode.classList[0];
      let eventIndex = eventClass[eventClass.length - 1];
      let taskListSelector = document.querySelector(`#taskList${eventIndex}`);
      let showTaskButton = document.querySelector(
        `.project${eventIndex}>#showTask`
      );
      // console.log(eventIndex);
      //if tasks are already shown, hide them
      if (
        projectList[eventIndex].getTasks().length != 0 &&
        taskListSelector.innerHTML == ""
      ) {
        console.log(projectList[eventIndex].getTasks());
        showTaskButton.innerHTML = "Hide tasks";
        showTasks(eventIndex, taskListSelector);
      } else if (
        projectList[eventIndex].getTasks().length == 0 &&
        taskListSelector.innerHTML == ""
      ) {
        //if no tasks are added, show an error through the button
        showTaskButton.innerHTML = "No tasks yet!";
        document
          .querySelector(`.project${eventIndex}>#showTask`)
          .classList.add("error");
        setTimeout(() => {
          showTaskButton.innerHTML = "Show tasks";
          document
            .querySelector(`.project${eventIndex}>#showTask`)
            .classList.remove("error");
        }, 1500);
      } else {
        showTaskButton.innerHTML = "Show tasks";
        taskListSelector.innerHTML = "";
      }
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
        refreshCache();
      } else {
        return;
      }
    });
  });
}

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
            refreshCache();
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
        refreshCache();
        // console.log("taskDone is now: " + currentProjectTasks[taskI].getDone());
        // console.log(currentProjectTasks[taskI]);
      } else {
        currentProjectTasks[taskI].setDone(false);
        showTasks(eventIndex, taskListSelector);
        refreshCache();
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
        refreshCache();
      } else if (currentProjectTasks[taskI].getPriority() == 2) {
        currentProjectTasks[taskI].setPriority(3);
        showTasks(eventIndex, taskListSelector);
        refreshCache();
      } else {
        currentProjectTasks[taskI].setPriority(1);
        showTasks(eventIndex, taskListSelector);
        refreshCache();
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
        refreshCache();
      } else {
        showTasks(eventIndex, taskListSelector);
      }
      // console.log(projectList[eventIndex].getTasks());
      showTasks(eventIndex, taskListSelector);
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

  //the fourth arg flags the project as non-usermade (default == usermade; so when a user adds a project of his own default-projects can be deleted)
  const defaultProject1 = new todoProject(
    "Family",
    "This is the family project",
    [todoItem1, todoItem2, todoItem3],
    false
  );

  const defaultProject2 = new todoProject(
    "Work",
    "This is the work project",
    [todoItem1, todoItem2, todoItem3],
    false
  );

  projectList.push(defaultProject1);
  projectList.push(defaultProject2);
  todoItem1.setDone(true);
  todoItem3.setPriority(2);
  todoItem2.setPriority(3);

  // console.log(projectList);
  // console.log(defaultProject1.getTasks(), defaultProject2.getTasks());
}
