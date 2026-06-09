import type { MedicationProtocol } from "../types/clinical";

export const medications: MedicationProtocol[] = [
	{
		id: "noradrenalina",
		name: "Noradrenalina",
		category: "MAV - Vasopressor",
		isMAV: true,
		requiresWeight: true,
		mechanism: "Bomba de Infusão (BIC)",
		safetyGuideline:
			"Uso exclusivo em via central. Monitorar PA. Diluição comum: 4 amp + 234mL SG5%.",
		calculationType: "mcg_kg_min",
	},
	{
		id: "amiodarona",
		name: "Amiodarona",
		category: "MAV - Antiarrítmico",
		isMAV: true,
		requiresWeight: false,
		mechanism: "Bomba de Infusão (BIC)",
		safetyGuideline:
			"Diluir obrigatoriamente em Soro Glicosado (SG 5%). Incompatível com Soro Fisiológico.",
		calculationType: "bic",
	},
	{
		id: "insulina_regular",
		name: "Insulina Regular",
		category: "MAV - Hormônio",
		isMAV: true,
		requiresWeight: false,
		mechanism: "Bomba de Infusão (BIC)",
		safetyGuideline:
			"Controle rigoroso de glicemia capilar (HGT) a cada hora. Dupla checagem obrigatória.",
		calculationType: "bic",
	},
	{
		id: "fentanil",
		name: "Fentanil",
		category: "MAV - Opioide",
		isMAV: true,
		requiresWeight: true,
		mechanism: "Bomba de Infusão (BIC)",
		safetyGuideline:
			"Sedativo potente. Monitorar depressão respiratória e saturação de oxigênio.",
		calculationType: "mcg_kg_min",
	},
	{
		id: "ceftriaxona",
		name: "Ceftriaxona",
		category: "Uso Geral - Antibiótico",
		isMAV: false,
		requiresWeight: false,
		mechanism: "Gotejamento por Minutos",
		safetyGuideline: "Infundir em tempo não inferior a 30 minutos na veia.",
		calculationType: "drops",
	},
	{
		id: "metronidazol",
		name: "Metronidazol",
		category: "Uso Geral - Antibiótico",
		isMAV: false,
		requiresWeight: false,
		mechanism: "Gotejamento por Minutos",
		safetyGuideline:
			"Medicamento pronto para uso em sistema fechado (100mL). Não diluir.",
		calculationType: "drops",
	},
	{
		id: "dipirona",
		name: "Dipirona",
		category: "Uso Geral - Analgésico",
		isMAV: false,
		requiresWeight: false,
		mechanism: "Gotejamento por Minutos",
		safetyGuideline:
			"Infundir lentamente para evitar risco de hipotensão severa.",
		calculationType: "drops",
	},
];
