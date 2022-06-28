

let tasks = [];
let logs = [];

async function init() {
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    logs = JSON.parse(backend.getItem('logs')) || [];
}

async function addTask() {
    let title = document.getElementById('t1');
    let descr = document.getElementById('t2');
    let date = document.getElementById('t3');
    let taskNew = {
        "title": title.value,
        "description": descr.value,
        "date": date.value,
        "id": tasks.length,
        "status": 0,
        "assigned": assigned
    };
    tasks.push(taskNew);
    newLog(tasks.length - 1);
    saveTasks();
    //showTasks();
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

function newLog(i) {
    const d = new Date();
    d.getTime();
    let newLog = {
        'date': d,
        'task': tasks[i].title,
        'description': tasks[i].descr

    }
    logs.push(newLog);
    saveLogs();
}

async function showLogs() {
    await init();
    document.getElementById('logs').innerHTML =``;
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].status == 0) {
            document.getElementById('logs').innerHTML += `
            <tr>
                <td class="taskCreator">
                    <img src="./img/profilePic2.jpg">
                    &nbsp&nbsp&nbsp
                    <div class="name">
                        <span>Max Mustermann</span>
                    </div>
                </td>
                <td class="">(Category Class)</td>
                <td class="">${tasks[i].title}</td>
                <td class="" onclick="changeCat(${i})">add to board</td>
            </tr>
            `
        }
    }
}

/*
function showLogs() {
    for (i = logs.length - 1; i <= 0; i--) {
        document.getElementById('').innerHTML += `
            <div>

            </div>
        `
    }
}
*/
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

async function saveLogs() {
    await backend.setItem('logs', JSON.stringify(logs));
}

function delLog(i) {
    logs.splice(i, 1);
    saveLogs();
    showLogs();
}