import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

export interface PatientProfile {
	id: string;
	name: string;
	weight: number | null;
	height: number | null;
	fc?: number | null;
	pa?: string | null;
	fr?: number | null;
	temp?: number | null;
	spO2?: number | null;
}

export const usePatient = () => {
	const patientsList = useLocalStorage<PatientProfile[]>(
		"nc-patients-list",
		[],
	);
	const activePatientId = useLocalStorage<string | null>(
		"nc-active-patient-id",
		null,
	);

	const currentPatient = computed<PatientProfile>(() => {
		const active = patientsList.value.find(
			(p) => p.id === activePatientId.value,
		);
		// Return a default blank object if no patient is active
		return active || { id: "", name: "", weight: null, height: null };
	});

	const formatPatientVitals = (patient: PatientProfile | null) => {
		if (!patient) return "";

		const vitals = [];
		if (patient.pa) vitals.push(`PA: ${patient.pa}`);
		if (patient.fc) vitals.push(`FC: ${patient.fc}`);
		if (patient.fr) vitals.push(`FR: ${patient.fr}`);
		if (patient.temp) vitals.push(`Tax: ${patient.temp}°C`);
		if (patient.spO2) vitals.push(`SpO2: ${patient.spO2}%`);

		return vitals.join(", ");
	};

	const getPatientName = () => {
		return currentPatient.value?.name || "";
	};

	const getPatientParam = <K extends keyof PatientProfile>(
		key: K,
	): PatientProfile[K] | null => {
		return currentPatient.value ? currentPatient.value[key] : null;
	};

	const hasPatientData = computed(() => activePatientId.value !== null);

	const addPatient = (patient: Omit<PatientProfile, "id">) => {
		const newPatient = { ...patient, id: crypto.randomUUID() };
		patientsList.value.push(newPatient);
		activePatientId.value = newPatient.id;
	};

	const updatePatient = (
		id: string,
		data: Partial<Omit<PatientProfile, "id">>,
	) => {
		const index = patientsList.value.findIndex((p) => p.id === id);
		if (index !== -1) {
			patientsList.value[index] = { ...patientsList.value[index], ...data };
		}
	};

	const deletePatient = (id: string) => {
		patientsList.value = patientsList.value.filter((p) => p.id !== id);
		if (activePatientId.value === id) {
			activePatientId.value =
				patientsList.value.length > 0 ? patientsList.value[0].id : null;
		}
	};

	const setActivePatient = (id: string | null) => {
		activePatientId.value = id;
	};

	return {
		patientsList,
		activePatientId,
		currentPatient,
		hasPatientData,
		addPatient,
		updatePatient,
		deletePatient,
		setActivePatient,
		formatPatientVitals,
		getPatientName,
		getPatientParam,
	};
};
