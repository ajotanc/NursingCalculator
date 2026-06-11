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
	age?: number | null;
	fallRisk?: boolean;
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

		return active || {} as PatientProfile;
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

	const vitaisFields = computed(() => [
		{
			key: "name",
			label: "Nome",
			icon: "mdi-account",
			color: "primary",
			value: currentPatient.value?.name,
			unit: "",
			hidden: true,
		},
		{
			key: "age",
			label: "Idade",
			icon: "mdi-calendar-blank",
			color: "blue",
			value: currentPatient.value?.age,
			unit: "anos",
			hidden: false,
		},
		{
			key: "weight",
			label: "Peso",
			icon: "mdi-scale",
			color: "teal",
			value: currentPatient.value?.weight,
			unit: "kg",
			hidden: false,
		},
		{
			key: "height",
			label: "Altura",
			icon: "mdi-human-male-height",
			color: "indigo",
			value: currentPatient.value?.height,
			unit: "cm",
			hidden: false,
		},
		{
			key: "fc",
			label: "Freq. Cardíaca",
			icon: "mdi-heart-pulse",
			color: "red",
			value: currentPatient.value?.fc,
			unit: "bpm",
			hidden: false,
		},
		{
			key: "pa",
			label: "P. Arterial",
			icon: "mdi-gauge",
			color: "orange",
			value: currentPatient.value?.pa,
			unit: "mmHg",
			hidden: false,
		},
		{
			key: "fr",
			label: "Freq. Resp.",
			icon: "mdi-lungs",
			color: "cyan",
			value: currentPatient.value?.fr,
			unit: "irpm",
			hidden: false,
		},
		{
			key: "temp",
			label: "Temperatura",
			icon: "mdi-thermometer",
			color: "deep-orange",
			value: currentPatient.value?.temp,
			unit: "°C",
			hidden: false,
		},
		{
			key: "spO2",
			label: "SpO₂",
			icon: "mdi-water-percent",
			color: "light-blue",
			value: currentPatient.value?.spO2,
			unit: "%",
			hidden: false,
		},
		{
			key: "fallRisk",
			label: "Risco Queda",
			icon: "mdi-alert-octagon",
			color: "amber",
			value: currentPatient.value?.fallRisk,
			unit: "",
			hidden: true,
		},
	]);

	return {
		patientsList,
		activePatientId,
		currentPatient,
		hasPatientData,
		vitaisFields,
		addPatient,
		updatePatient,
		deletePatient,
		setActivePatient,
		formatPatientVitals,
		getPatientName,
		getPatientParam,
	};
};
