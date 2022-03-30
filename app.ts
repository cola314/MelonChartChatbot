import * as MelonChartService from './Melon/MelonChatService'

(async () => {
	console.log((await MelonChartService.getDailyChart()).toDescription());
})();