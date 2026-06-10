import { useClipboard } from "@vueuse/core";
import { ref } from "vue";
import { useHistory } from "./useHistory";
import { activeTab } from "./useNavigation";
import { usePatient } from "./usePatient";

const showSnackbar = ref(false);
const snackbarText = ref("");

export const useAppClipboard = () => {
	const { copy, isSupported } = useClipboard();
	const { addToHistory } = useHistory();
	const { currentPatient, formatPatientVitals, getPatientName } = usePatient();

	const copyToClipboard = async (calculatorName: string, text: string) => {
		if (!isSupported.value) {
			snackbarText.value = "Seu navegador não suporta a cópia automática.";
			showSnackbar.value = true;
			return;
		}

		try {
			const name = getPatientName();
			const vitals = formatPatientVitals(currentPatient.value);

			let header = "";
			if (name) {
				header = vitals
					? `Paciente/Leito: ${name} (${vitals})`
					: `Paciente/Leito: ${name}`;
			}

			const finalText = header ? `${header}\n${text}` : text;

			await copy(finalText);
			addToHistory(calculatorName, text, name, vitals);

			snackbarText.value = "Copiado para o prontuário!";
			showSnackbar.value = true;
		} catch (error) {
			console.error("Copy failed:", error);
			snackbarText.value = "Erro ao copiar (permissão negada pelo navegador).";
			showSnackbar.value = true;
		} finally {
			// Auto redirect to dashboard
			activeTab.value = "dashboard";
		}
	};

	const copyRawText = async (text: string) => {
		if (!isSupported.value) {
			snackbarText.value = "Seu navegador não suporta a cópia automática.";
			showSnackbar.value = true;
			return;
		}

		try {
			await copy(text);
			snackbarText.value = "Texto copiado com sucesso!";
			showSnackbar.value = true;
		} catch (error) {
			console.error("Copy failed:", error);
			snackbarText.value = "Erro ao copiar (permissão negada pelo navegador).";
			showSnackbar.value = true;
		}
	};

	return {
		copyToClipboard,
		copyRawText,
		showSnackbar,
		snackbarText,
	};
};
