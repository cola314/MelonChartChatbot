const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => {
    try {
        return await axios.get("https://www.melon.com/chart/day/index.htm");
    } catch(err) {
        console.error(err);
    }
}

const getChart = async () => {
    return new Promise((resolve, reject) => {
        getHtml()
            .then(html => {
                let result = "멜론 일간 차트\n";
                const $ = cheerio.load(html.data);
                musicNameList = $("div.ellipsis.rank01").find("span");
                singerList = $("div.ellipsis.rank02").find("span");

                for(var i=0; i<10; i++) {
                    result += String(i + 1) + ". " + $(musicNameList[i]).text().trim() + " - " + $(singerList[i]).text() + "\n";
                }
                console.log(result);

                resolve(result.trim());
            });
    });
};

const get24HitHtml = async () => {
    try {
        return await axios.get("https://www.melon.com/chart/");
    } catch(err) {
        console.error(err);
    }
}

const get24HitChart = async () => {
    return new Promise((resolve, reject) => {
        get24HitHtml()
            .then(html => {
                let result = "멜론 24Hit 차트\n"
                const $ = cheerio.load(html.data);
                headLine = $('span.yyyymmdd').text().trim() + " - " + $('span.hhmm').text().trim();
                musicNameList = $("div.ellipsis.rank01").find("span");
                singerList = $("div.ellipsis.rank02").find("span");

                result += headLine + "\n";
                for(var i=0; i<10; i++) {
                    result += String(i + 1) + ". " + $(musicNameList[i]).text().trim() + " - " + $(singerList[i]).text() + "\n";
                }
                console.log(result);

                resolve(result.trim());
            });
    });
};

exports.getChart = getChart;
exports.get24HitChart = get24HitChart;
