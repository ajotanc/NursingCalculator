export interface MedicationProtocol {
	id: string;
	name: string;
	category: string;
	isMAV: boolean;
	requiresWeight: boolean;
	mechanism: string;
	safetyGuideline: string;
	calculationType: "bic" | "drops" | "mcg_kg_min";
}

export interface CalculationResult {
	primaryValue: string;
	primaryUnit: string;
	secondaryValue?: string;
	secondaryUnit?: string;
	label: string;
}
