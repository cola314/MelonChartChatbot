import axios from 'axios';
import cheerio from 'cheerio';
import { Chart } from './Chart';
import { Music } from "./Music";

async function getChart(chartName: string, url: string): Promise<Chart> {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const musicNameList = $('div.ellipsis.rank01').find('span a');
    const singerList = $('div.ellipsis.rank02').find('span');

    const musicList: Music[] = [];
    for (var i = 0; i < 10; i++) {
        musicList.push({
            name: $(musicNameList[i]).text().trim(),
            singer: $(singerList[i]).text()
        });
    }
    return new Chart(chartName, musicList);
}

export function getDailyChart() {
    return getChart('멜론 일간 차트', 'https://www.melon.com/chart/day/index.htm')
}

export function getNewChart() {
    return getChart('멜론 최신곡', 'https://www.melon.com/new/');
}
