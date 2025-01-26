import csv from "csv-parser";
import fs from "fs";

// Responsible for parsing the CSV files
const parseCSV = (filePath) => {
	const data = [];
	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => data.push(row))
			.on("end", () => resolve(data))
			.on("error", (err) => reject(err));
	});
};

// Responsible for building the unified JSON object
const normaliseData = (rawData, fieldMap, brokerName) => {
	return rawData.map((row) => ({
		brokerName,
		policyNumber: row[fieldMap.PolicyNumber] || row[fieldMap.PolicyRef],
		insuredAmount: row[fieldMap.InsuredAmount] || row[fieldMap.CoverageAmount],
		startDate: row[fieldMap.StartDate] || row[fieldMap.InitiationDate],
		endDate: row[fieldMap.EndDate] || row[fieldMap.ExpirationDate],
		adminFee: row[fieldMap.AdminFee] || row[fieldMap.AdminCharges],
		businessDescription: row[fieldMap.BusinessDescription] || row[fieldMap.CompanyDescription],
		businessEvent: row[fieldMap.BusinessEvent] || row[fieldMap.ContractEvent],
		clientType: row[fieldMap.ClientType] || row[fieldMap.ConsumerCategory],
		clientRef: row[fieldMap.ClientRef] || row[fieldMap.ConsumerID],
		commission: row[fieldMap.Commission] || row[fieldMap.BrokerFee],
		effectiveDate: row[fieldMap.EffectiveDate] || row[fieldMap.ActivationDate],
		insurerPolicyNumber: row[fieldMap.InsurerPolicyNumber] || row[fieldMap.InsuranceCompanyRef],
		iptAmount: row[fieldMap.IPTAmount] || row[fieldMap.TaxAmount],
		premium: row[fieldMap.Premium] || row[fieldMap.CoverageCost],
		policyFee: row[fieldMap.PolicyFee] || row[fieldMap.ContractFee],
		policyType: row[fieldMap.PolicyType] || row[fieldMap.ContractCategory],
		insurer: row[fieldMap.Insurer] || row[fieldMap.Underwriter],
		product: row[fieldMap.Product] || row[fieldMap.InsurancePlan],
		renewalDate: row[fieldMap.RenewalDate] || row[fieldMap.NextRenewalDate],
		rootPolicyRef: row[fieldMap.RootPolicyRef] || row[fieldMap.PrimaryPolicyRef],
	}));
};

// Where the magic happens
const processCSVFiles = async () => {
	try {
		const broker1Data = await parseCSV("./data/broker1.csv");
		const broker2Data = await parseCSV("./data/broker2.csv");

		// Here I specify the field mappings for each csv file
		const fieldMapBroker1 = {
			PolicyNumber: "PolicyNumber",
			InsuredAmount: "InsuredAmount",
			StartDate: "StartDate",
			EndDate: "EndDate",
			AdminFee: "AdminFee",
			BusinessDescription: "BusinessDescription",
			BusinessEvent: "BusinessEvent",
			ClientType: "ClientType",
			ClientRef: "ClientRef",
			Commission: "Commission",
			EffectiveDate: "EffectiveDate",
			InsurerPolicyNumber: "InsurerPolicyNumber",
			IPTAmount: "IPTAmount",
			Premium: "Premium",
			PolicyFee: "PolicyFee",
			PolicyType: "PolicyType",
			Insurer: "Insurer",
			Product: "Product",
			RenewalDate: "RenewalDate",
			RootPolicyRef: "RootPolicyRef",
		};

		const fieldMapBroker2 = {
			PolicyRef: "PolicyRef",
			CoverageAmount: "CoverageAmount",
			ExpirationDate: "ExpirationDate",
			AdminCharges: "AdminCharges",
			InitiationDate: "InitiationDate",
			CompanyDescription: "CompanyDescription",
			ContractEvent: "ContractEvent",
			ConsumerID: "ConsumerID",
			BrokerFee: "BrokerFee",
			ActivationDate: "ActivationDate",
			ConsumerCategory: "ConsumerCategory",
			InsuranceCompanyRef: "InsuranceCompanyRef",
			TaxAmount: "TaxAmount",
			CoverageCost: "CoverageCost",
			ContractFee: "ContractFee",
			ContractCategory: "ContractCategory",
			Underwriter: "Underwriter",
			NextRenewalDate: "NextRenewalDate",
			PrimaryPolicyRef: "PrimaryPolicyRef",
			InsurancePlan: "InsurancePlan",
		};

		// Create two separate normalised JSON objects from that function above
		const normalizedBroker1 = normaliseData(broker1Data, fieldMapBroker1, "broker1");
		const normalizedBroker2 = normaliseData(broker2Data, fieldMapBroker2, "broker2");

		// Merge them together
		const mergedObj = [...normalizedBroker1, ...normalizedBroker2];

		return mergedObj;
	} catch (err) {
		console.error("Error processing CSV files:", err.message);
		return [];
	}
};

export { normaliseData, processCSVFiles };
