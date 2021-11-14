const melon = require('./melon');

(async () => {
  await melon.getNewChart();
  await melon.getTop100Chart();
})();