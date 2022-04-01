import { Chart } from './Chart';
import * as melonChartService from './MelonChartService';

export let dailyChart: Chart;
export let newChart: Chart;

function refreshDailyChart() {
	return melonChartService.getDailyChart()
		.then(chart => dailyChart = chart);
}

function refreshNewChart() {
	return melonChartService.getNewChart()
		.then(chart => newChart = chart);
}

export async function refreshAllChart() {
	await Promise.all([refreshDailyChart(), refreshNewChart()]);
}