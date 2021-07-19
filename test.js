const melon = require('./melon');

(async () => {
  console.log(await melon.get24HitChart());
})();