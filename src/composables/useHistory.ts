import { useLocalStorage } from "@vueuse/core";

export interface HistoryItem {
	id: string;
	calculatorName: string;
	text: string;
	timestamp: number;
}

export const useHistory = () => {
	const history = useLocalStorage<HistoryItem[]>("nc-history", []);

	const addToHistory = (calculatorName: string, text: string) => {
		history.value.unshift({
			id: crypto.randomUUID(),
			calculatorName,
			text,
			timestamp: Date.now(),
		});

		// Keep only the last 30 items
		if (history.value.length > 30) {
			history.value.pop();
		}
	};

	const clearHistory = () => {
		history.value = [];
	};

	return {
		history,
		addToHistory,
		clearHistory,
	};
};
