const address = "http://***REMOVED***:9200";
const io = require("socket.io-client");
const ioClient = io.connect(address);
const schedule = require('node-schedule');
const melon = require('./melon');
const userManager = require('./user-manager');

var latestChartCache;

const init = async () => {
    console.log('start')
    latestChartCache = await melon.get24HitChart();
    userManager.loadUsers();
}
init();

const registerData = {
    "password": "4321"
};

ioClient.on('connect', () => {
    ioClient.emit("register", registerData);
});

ioClient.on("receive message", async (data) => {
    console.log(data);
    switch (data.msg) {
        case ".멜론":
            sendMessage(data.room, latestChartCache);
            break;
        case ".멜론구독":
            userManager.addUser(data.room);
            sendMessage(data.room, "멜론 서비스에 구독 되었습니다");
            userManager.saveUsers();
            break;
        case ".멜론취소":
            userManager.deleteUser(data.room);
            sendMessage(data.room, "멜론 서비스에 구독취소 되었습니다");
            userManager.saveUsers();
            break;
        case ".멜론정보":
            const info = "명령어 모음\n" +
                ".멜론\n" +
                ".멜론구독\n" +
                ".멜론취소\n" +
                ".멜론정보\n\n" +
                (userManager.isExistUser(data.room) ? "구독 중입니다" : "구독 중이 아닙니다");

            sendMessage(data.room, info);
            break;
    }
});

const sendMessage = (room, msg) => {
    const res = {
        "room": room,
        "msg": msg
    };
    ioClient.emit("send message", res);
    console.log("send message to " + res.room);
};

schedule.scheduleJob({ hour: 12, minute: 0, second: 15 }, async () => {
    console.log('alarm run');
    userManager.users.map(user => sendMessage(user, latestChartCache));
})

//when the second is 1 (e.g. 12:00:01, 20:43:01, etc.).
schedule.scheduleJob('40 0 * * * *', async () => {
    console.log('load data');
    latestChartCache = await melon.get24HitChart();
})
