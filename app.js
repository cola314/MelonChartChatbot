const address = "http://***REMOVED***:9200";
const io = require("socket.io-client");
const fs = require('fs');
const ioClient = io.connect(address);
const schedule = require('node-schedule');
const melon = require('./melon');

const BACKUP_FILE = 'user.backup';
console.log('start')

let users = [];
loadUsers();

const registerData = {
    "password" : "4321"
};

ioClient.on('connect', () => {
    ioClient.emit("register", registerData);
});

ioClient.on("receive message", async (data) => {
    console.log(data);
    switch(data.msg) {
        case ".멜론":
            const chart = await melon.get24HitChart();
            console.log(chart);
            sendMessage(data.room, chart);
            break;
        case ".멜론구독":
            addUser(data.room);
            sendMessage(data.room, "멜론 서비스에 구독 되었습니다");
            saveUsers();
            break;
        case ".멜론취소":
            deleteUser(data.room);
            sendMessage(data.room, "멜론 서비스에 구독취소 되었습니다");
            saveUsers();
            break;
        case ".멜론정보":
            const info = "명령어 모음\n" + 
                        ".멜론\n" + 
                        ".멜론구독\n" +
                        ".멜론취소\n" + 
                        ".멜론정보\n\n" +
                        (isExistUser(data.room) ? "구독 중입니다" : "구독 중이 아닙니다");

            sendMessage(data.room, info);
            break;
    }
});

const sendMessage = (room, msg) => {
    const res = {
        "room" : room,
        "msg" : msg
    };
    ioClient.emit("send message", res);
};

const addUser = (user) => {
    if(!isExistUser(user)) {
        users.push(user);
    }
}

const isExistUser = (user) => {
    return users.indexOf(user) !== -1;
}

const deleteUser = (user) => {
    users = users.filter(e => e !== user);
}

function saveUsers() {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(users), (err) => {
        console.error(err);
    });
}

function loadUsers() {
    try {
        if(fs.existsSync(BACKUP_FILE)) {
            fs.readFileSync(BACKUP_FILE, (err, data) => {
                if(!err) {
                    users = JSON.parse(data);
                    console.log('read ' + BACKUP_FILE);
                } else {
                    console.error(err);
                }
            });
        }
    } catch(err) {
        console.error(err);
    }
}

schedule.scheduleJob({hour: 12, minute: 0}, async () => {
    let chart = await melon.getChart();
    console.log(chart);
    users.map(user => sendMessage(user, chart));
})
