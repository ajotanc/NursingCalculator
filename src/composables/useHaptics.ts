import { ref } from "vue";

export const useHaptics = () => {
	const isSupported = ref(
		typeof window !== "undefined" && "vibrate" in navigator,
	);

	const vibrate = (pattern: number | number[] = 20) => {
		if (!isSupported.value) return;
		try {
			navigator.vibrate(pattern);
		} catch (error) {
			if (error instanceof Error) {
				console.warn("Vibration failed", error.message);
			}
		}
	};

	const vibrateSuccess = () => vibrate([20, 50, 20]);
	const vibrateError = () => vibrate([50, 50, 50, 50, 50]);

	return {
		isSupported,
		vibrate,
		vibrateSuccess,
		vibrateError,
	};
};
