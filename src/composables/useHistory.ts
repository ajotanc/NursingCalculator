import { useLocalStorage } from "@vueuse/core";
import dayjs from "dayjs";

export interface HistoryItem {
	id: string;
	calculatorName: string;
	text: string;
	timestamp: number;
	patientName?: string;
	patientVitals?: string;
}

export const useHistory = () => {
	const history = useLocalStorage<HistoryItem[]>("nc-history", []);

	const cleanupHistory = () => {
		const now = dayjs();
		history.value = history.value.filter(
			(item) => now.diff(dayjs(item.timestamp), "hour") < 24,
		);
	};

	// Clean up old history on init
	cleanupHistory();

	const addToHistory = (
		calculatorName: string,
		text: string,
		patientName?: string,
		patientVitals?: string,
	) => {
		cleanupHistory();
		history.value.unshift({
			id: crypto.randomUUID(),
			calculatorName,
			text,
			timestamp: dayjs().valueOf(),
			patientName,
			patientVitals,
		});
	};

	const clearHistory = () => {
		history.value = [];
	};

	const deleteItem = (id: string) => {
		history.value = history.value.filter((item) => item.id !== id);
	};

	return {
		history,
		addToHistory,
		clearHistory,
		deleteItem,
	};
};
