import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

export interface PatientProfile {
	id: string;
	name: string;
	weight: number | null;
	height: number | null;
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

	const hasPatientData = computed(() => {
		return (
			currentPatient.value.weight !== null ||
			currentPatient.value.height !== null ||
			currentPatient.value.name !== ""
		);
	});

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
	};
};
