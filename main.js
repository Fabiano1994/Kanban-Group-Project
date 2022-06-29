
let selected = [];
let tasks = [];
let users = [
    {
        "name": "Ahmet",
        "profPic": "./img/profilePic1.jpg"
    },
    {
        "name": "Fabian",
        "profPic": "./img/profilePic2.jpg"
    },
    {
        "name": "André",
        "profPic": "./img/profilePic3.jpg"
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
        "assigned": users[selected[0]]
    };
    tasks.push(taskNew);
    saveTasks();
    document.getElementById('titleInputField').value='';
    document.getElementById('selection').value='';
    document.getElementById('txtDescription').value='';
    document.getElementById('dueDate').value='';
    document.getElementById('urgency').value='';
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
            <div onclick="changeCat(${i})">
                ${tasks[i].title}
            </div>
        `
        };
    }
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
                <td class="" onclick="changeCat(${i})">add to board</td>
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

function delTask(i) {
    tasks.splice(i, 1);
    saveTasks();

}

async function saveTasks() {
    await backend.setItem('tasks', JSON.stringify(tasks));
}

function selectAv(i) {
    if (selected.includes(i)) {
        selected = selected.filter (a => a != i);
    } else {
        selected.push(i);
    }
    document.getElementById('assignedProfilePicture'+i).classList.toggle('selAv');
}