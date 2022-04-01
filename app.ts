import * as cachedChartService from './Melon/CachedChartService';
import * as userService from './User/UserService';
import { KakaoService, MessageHandler } from './Kakao/KakaoService';
import { scheduleJob } from 'node-schedule';
import { Chart } from './Melon/Chart';

const DATA_PATH = process.env.PATH ?? __dirname;
const API_SERVER = process.env.API_SERVER;
const API_KEY = process.env.API_KEY;
const DETAIL_URL = process.env.DETAIL_URL;

(async () => {
    console.log('app start')
    await cachedChartService.refreshAllChart();
    userService.setPath(DATA_PATH);
    userService.load();
})();

const messageHandler: MessageHandler = async (data) => {
    //.멜론 {숫자} - n번째 최신차트 검색결과(freetube)
    var match = /.멜론\s+\d+/.exec(data.message);
    if (match) {
        var searchIndex = Number(/\d+/.exec(data.message)[0]);
        if (1 <= searchIndex && searchIndex <= 10) {
            const chart = cachedChartService.newChart.musics[searchIndex - 1];
            const searchText = `${chart.name} ${chart.singer}`;
            const decodedSearchText = searchText.replace(/\s+/gi, '%20');
            const info = `'${searchText}'의 검색 결과\n\n` +
                `${DETAIL_URL}/index.html?search=${decodedSearchText}`;
            kakaoService.send(data.room, info);
        } else {
            kakaoService.send(data.room, "1~10까지 검색 가능합니다");
        }
        return;
    }

    //.멜론차트 {숫자} - n번째 Top100 차트 검색결과(freetube)
    var match = /.멜론차트\s+\d+/.exec(data.message);
    if (match) {
        var searchIndex = Number(/\d+/.exec(data.message)[0]);
        if (1 <= searchIndex && searchIndex <= 10) {
            const chart = cachedChartService.dailyChart.musics[searchIndex - 1];
            const searchText = `${chart.name} ${chart.singer}`;
            const decodedSearchText = searchText.replace(/\s+/gi, '%20');
            const info = `'${searchText}'의 검색 결과\n\n` +
                `${DETAIL_URL}/index.html?search=${decodedSearchText}`;
            kakaoService.send(data.room, info);
        } else {
            kakaoService.send(data.room, "1~10까지 검색 가능합니다");
        }
        return;
    }

    switch (data.message) {
        case ".멜론":
            kakaoService.send(data.room, cachedChartService.newChart.toDescription());
            break;
        case ".멜론차트":
            kakaoService.send(data.room, cachedChartService.dailyChart.toDescription());
            break;
        case ".멜론구독":
            userService.users.add(data.room);
            kakaoService.send(data.room, "멜론 서비스에 구독 되었습니다");
            userService.save();
            break;
        case ".멜론취소":
            userService.users.delete(data.room);
            kakaoService.send(data.room, "멜론 서비스에 구독취소 되었습니다");
            userService.save();
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
                (userService.users.has(data.room) ? "구독 중입니다" : "구독 중이 아닙니다");

            kakaoService.send(data.room, info);
            break;
    }
}
const kakaoService = new KakaoService(API_SERVER, API_KEY, messageHandler);

scheduleJob({ hour: 12, minute: 0, second: 15 }, () => {
    console.log('alarm run');
    userService.users.forEach(user => kakaoService.send(user, cachedChartService.newChart.toDescription()));
})

// 1시간 주기로 캐싱 ex(12:00:40, 3:00:40, ...)
scheduleJob('40 0 * * * *', async () => {
    console.log('load chart');
    await cachedChartService.refreshAllChart();
})
