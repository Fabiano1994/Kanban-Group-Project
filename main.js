
let selected;
let tasks = [];
let actualEdit;
let currentDrop;
let users = [
    {
        "name": "Ahmet",
        "profPic": "./img/profilePic1.jpg",
        "number": 0
    },
    {
        "name": "Fabian",
        "profPic": "./img/profilePic2.jpg",
        "number": 1
    },
    {
        "name": "André",
        "profPic": "./img/profilePic3.jpg",
        "number": 2
    }
]


async function init() {
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
}

async function addTask() {
    await init();
    if (selected.length == 0) {
        selected[0] = 0;
    }
    let title = document.getElementById('titleInputField');
    let cat = document.getElementById('selection');
    let descr = document.getElementById('txtDescription');
    let date = document.getElementById('dueDate');
    let urgency = document.getElementById('urgency');
    let taskNew = {
        "title": title.value,
        "category": cat.value,
        "description": descr.value,
        "date": date.value,
        "urgency": urgency.value,
        "id": tasks.length,
        "status": 0,
        "assigned": users[selected]
    };
    tasks.push(taskNew);
    saveTasks();
    document.getElementById('titleInputField').value='';
    document.getElementById('selection').value='';
    document.getElementById('txtDescription').value='';
    document.getElementById('dueDate').value='';
    document.getElementById('urgency').value='';
    resetAV();
}

async function showTasks() {
    await init();
    console.log(tasks);
    for (i = 1; i < 5; i++) {
        document.getElementById('task' + i).innerHTML = '';
    }
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].status > 0) {
            document.getElementById('task' + (tasks[i].status)).innerHTML += `
            <div id="tasks${i}" draggable="true" ondragstart="drag(${i})">
                <div >
                    <div id="" class="newTask" " ondblclick="showInputForm()"
                        title="double-click for edit!">
                        <img class="profilePicTask" id="profilePic" src="${tasks[i].assigned.profPic}">
                    <div>
                    <h5 class="descriptionHeader">${tasks[i].title}</h5>
                    <p class="description">${tasks[i].description}</p>
                </div>
                <div class="taskDate">
                    <p>${tasks[i].date}</p>
                    <img class="taskIcons" src="./img/trash.ico" onclick="delTask(${i})" title="remove task">
                    <img class="taskIcons" src="./img/edit.ico" onclick="editTask(${i})" title="view/edit task">
                </div>
            </div>
            
        `
        };
    }
}

function drag(id) {
    currentDrop=id;
    
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  

async function moveTo (i) {
    tasks[currentDrop].status = i;
    await saveTasks();
    await showTasks();
}

async function showLogs() {
    await init();
    document.getElementById('logs').innerHTML =``;
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].status == 0) {
            document.getElementById('logs').innerHTML += `
            <tr class="${tasks[i].urgency}">
                <td class="taskCreator ">
                    <img src="${tasks[i].assigned.profPic}">
                    &nbsp&nbsp&nbsp
                    <div class="name">
                        <span>${tasks[i].assigned.name}</span>
                    </div>
                </td>
                <td class="">${tasks[i].category}</td>
                <td class="">${tasks[i].title}</td>
                <td class="">${tasks[i].urgency}</td>
                <td class="" onclick="editTask(${i})"><img class="boardImg" src="./img/zoom.ico" title="view details / edit"></td>
                <td class="" onclick="changeCat(${i})"><img class="boardImg" src="./img/plus.ico" title="add to board"></td>
                <td class="" onclick="delLog(${i})"><img class="boardImg" src="./img/trash.ico" title="delete"></td>
            </tr>
            `
        }
    }
}


async function changeCat(i) {
    if (tasks[i].status < 4) {
        tasks[i].status++;
    } else {
        delTask(i);
    }
    await saveTasks();
    if (document.getElementById('task1')){
        await showTasks();
    }
    if (document.getElementById('logs')){
        await showLogs();
    }
}

async function delTask(i) {
    tasks.splice(i, 1);
    await saveTasks();
    showTasks();
}

async function delLog(i) {
    tasks.splice(i, 1);
    await saveTasks();
    showLogs();
}

async function saveTasks() {
    await backend.setItem('tasks', JSON.stringify(tasks));
}

function selectAv(i) {
    selected = i;
    resetAV();
    document.getElementById('assignedProfilePicture'+i).classList.add('selAv');
}

function editTask(i) {
    resetAV();
    setMinDate();
    document.getElementById('addTaskSection').classList.remove('dnone');
    document.getElementById('titleInputField').value = tasks[i].title;
    document.getElementById('selection').value = tasks[i].category;
    document.getElementById('txtDescription').value = tasks[i].description;
    document.getElementById('dueDate').value = tasks[i].date;
    document.getElementById('urgency').value = tasks[i].urgency;
    selectAv(tasks[i].assigned.number);
    actualEdit=i;

}

function resetAV() {
    document.getElementById('assignedProfilePicture0').classList.remove('selAv');
    document.getElementById('assignedProfilePicture1').classList.remove('selAv');
    document.getElementById('assignedProfilePicture2').classList.remove('selAv');
}

async function saveEdit() {
    tasks[actualEdit].title = document.getElementById('titleInputField').value;
    tasks[actualEdit].cat = document.getElementById('selection').value;
    tasks[actualEdit].description = document.getElementById('txtDescription').value;
    tasks[actualEdit].date = document.getElementById('dueDate').value;
    tasks[actualEdit].urgency = document.getElementById('urgency').value;
    if (selected){
        tasks[actualEdit].assigned = users[selected];
    } else {
        tasks[actualEdit].assigned = users[0];
    }
    document.getElementById('addTaskSection').classList.add('dnone');
    await saveTasks();
    if (document.getElementById('task1')){
        await showTasks();
    }
    if (document.getElementById('logs')){
        await showLogs();
    }
}

function closeWindow() {
    document.getElementById('addTaskSection').classList.add('dnone');
}

function setMinDate() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('dueDate').setAttribute('min', today);
}