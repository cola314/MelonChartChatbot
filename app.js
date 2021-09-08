const address = "http://***REMOVED***:9200";
const io = require("socket.io-client");
const ioClient = io.connect(address);
const schedule = require('node-schedule');
const melon = require('./melon');
const userManager = require('./user-manager');

var latestTop100ChartCache;
var latestNewChartCache;

const init = async () => {
  console.log('start')
  latestTop100ChartCache = await melon.getTop100Chart();
  latestNewChartCache = await melon.getNewChart();
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

  //.멜론 {숫자} - n번째 최신차트 검색결과(freetube)
  var match = /.멜론\s+\d+/.exec(data.msg);
  if (match) {
    var searchIndex = Number(/\d+/.exec(data.msg)[0]);
    if (1 <= searchIndex && searchIndex <= 10) {
      const chart = latestNewChartCache.chartList[searchIndex - 1];
      const searchText = `${chart.name} ${chart.singer}`;
      const decodedSearchText = searchText.replace(/\s+/gi, '%20');
      const info = `'${searchText}'의 검색 결과\n\n` +
        `http://***REMOVED***:9203/index.html?search=${decodedSearchText}\n\n` +
        `https://***REMOVED***:9112/index.html?search=${decodedSearchText}`;
      sendMessage(data.room, info);
    } else {
      sendMessage(data.room, "1~10까지 검색 가능합니다");
    }
    return;
  }

  //.멜론차트 {숫자} - n번째 Top100 차트 검색결과(freetube)
  var match = /.멜론차트\s+\d+/.exec(data.msg);
  if (match) {
    var searchIndex = Number(/\d+/.exec(data.msg)[0]);
    if (1 <= searchIndex && searchIndex <= 10) {
      const chart = latestTop100ChartCache.chartList[searchIndex - 1];
      const searchText = `${chart.name} ${chart.singer}`;
      const decodedSearchText = searchText.replace(/\s+/gi, '%20');
      const info = `'${searchText}'의 검색 결과\n\n` +
        `http://***REMOVED***:9203/index.html?search=${decodedSearchText}\n\n` +
        `https://***REMOVED***:9112/index.html?search=${decodedSearchText}`;
      sendMessage(data.room, info);
    } else {
      sendMessage(data.room, "1~10까지 검색 가능합니다");
    }
    return;
  }

  switch (data.msg) {
    case ".멜론":
      sendMessage(data.room, melon.convertChartToString(latestNewChartCache));
      break;
    case ".멜론차트":
      sendMessage(data.room, melon.convertChartToString(latestTop100ChartCache));
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
        ".멜론 [1~10]\n" +
        ".멜론차트\n" +
        ".멜론차트 [1~10]\n" +
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

schedule.scheduleJob({ hour: 20, minute: 56, second: 15 }, async () => {
  console.log('alarm run');
  userManager.users.map(user => sendMessage(user, melon.convertChartToString(latestNewChartCache)));
})

//when the second is 1 (e.g. 12:00:01, 20:43:01, etc.).
schedule.scheduleJob('40 0 * * * *', async () => {
  console.log('load data');
  latestTop100ChartCache = await melon.getTop100Chart();
  latestNewChartCache = await melon.getNewChart();
})
