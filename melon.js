const axios = require("axios");
const cheerio = require("cheerio");

const getTop100Html = async () => {
  try {
    return await axios.get("https://www.melon.com/chart/day/index.htm");
  } catch (err) {
    console.error(err);
  }
}

const getTop100Chart = async () => {
  return new Promise((resolve, reject) => {
    getTop100Html()
      .then(html => {
        const $ = cheerio.load(html.data);
        musicNameList = $("div.ellipsis.rank01").find("span");
        singerList = $("div.ellipsis.rank02").find("span");

        const chartList = []
        for (var i = 0; i < 10; i++) {
          chartList.push({
            name: $(musicNameList[i]).text().trim(),
            singer: $(singerList[i]).text()
          })
        }
        const data = {
          chartName: "멜론 일간 차트",
          chartList: chartList
        }
        console.log(data);

        resolve(data);
      });
  });
};

const getNewHtml = async () => {
  try {
    return await axios.get("https://www.melon.com/new/");
  } catch (err) {
    console.error(err);
  }
}

const getNewChart = async () => {
  return new Promise((resolve, reject) => {
    getNewHtml()
      .then(html => {
        const $ = cheerio.load(html.data);
        headLine = $('span.yyyymmdd').text().trim() + " - " + $('span.hhmm').text().trim();
        musicNameList = $("div.ellipsis.rank01").find("span");
        singerList = $("div.ellipsis.rank02").find("span");

        const chartList = []
        for (var i = 0; i < 10; i++) {
          chartList.push({
            name: $(musicNameList[i]).text().trim(),
            singer: $(singerList[i]).text()
          })
        }
        const data = {
          chartName: "멜론 최신곡",
          chartList: chartList
        }
        console.log(data);

        resolve(data);
      });
  });
};

const convertChartToString = (chart) => {
  let result = chart.chartName + "\n";
  for (var i = 0; i < chart.chartList.length; i++) {
    result += `${i + 1}. ${chart.chartList[i].name} - ${chart.chartList[i].singer}\n`
  }
  return result.trim();
}

exports.getTop100Chart = getTop100Chart;
exports.getNewChart = getNewChart;
exports.convertChartToString = convertChartToString;