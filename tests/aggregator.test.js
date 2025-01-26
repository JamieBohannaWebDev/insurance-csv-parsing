import { normaliseData, processCSVFiles } from "../src/aggregator.js";
import { calculateAverageDuration, calculateTotalInsured, filterActivePolicies, queryByBroker } from "../src/reports.js";

test("Processes and aggregates CSV files correctly", async () => {
	const data = await processCSVFiles();
	expect(data).toBeInstanceOf(Array);
	expect(data.length).toBeGreaterThan(0);
	expect(data[0]).toHaveProperty("policyNumber");
	expect(data[0]).toHaveProperty("insuredAmount");
	expect(data[0]).toHaveProperty("startDate");
	expect(data[0]).toHaveProperty("endDate");
});

test("Filters active policies correctly", () => {
	const today = new Date("2025-01-26"); // Use ISO format to avoid locale issues
	const policies = [
		{ startDate: "2025-01-01", endDate: "2025-12-31" }, // Active
		{ startDate: "2023-01-01", endDate: "2023-12-31" }, // Expired
		{ startDate: "2025-02-01", endDate: "2025-12-31" }, // Future
	];
	const activePolicies = filterActivePolicies(policies, today);
	expect(activePolicies.length).toBe(1);
	expect(activePolicies[0]).toEqual({ startDate: "2025-01-01", endDate: "2025-12-31" });
});

test("Calculates sum of insured amounts for active policies", () => {
	const activePolicies = [{ insuredAmount: 500000 }, { insuredAmount: 250000 }];
	const totalInsured = calculateTotalInsured(activePolicies);
	expect(totalInsured).toBe(750000);
});

test("Calculates average policy duration for active policies", () => {
	const activePolicies = [
		{ startDate: "2025-01-01", endDate: "2025-12-31" }, // 365 days
		{ startDate: "2025-02-01", endDate: "2025-12-31" }, // 334 days
	];
	const averageDuration = calculateAverageDuration(activePolicies);
	expect(averageDuration).toBeCloseTo(349.5, 1); // Average of 365 and 334
});

test("Returns policies for the correct broker", () => {
	const policies = [
		{ brokerName: "broker1", policyNumber: "POL001" },
		{ brokerName: "broker2", policyNumber: "POL002" },
	];

	const broker1Policies = queryByBroker(policies, "broker1");

	// Check that the returned policies include the one with policyNumber "POL001"
	expect(broker1Policies).toEqual(expect.arrayContaining([expect.objectContaining({ policyNumber: "POL001" })]));
});

test("Normalises fields correctly for Broker 1", () => {
	const broker1Sample = [{ PolicyNumber: "POL001", InsuredAmount: "1000000", EffectiveDate: "2023-01-15", EndDate: "2024-01-15" }];
	const fieldMap = {
		PolicyNumber: "PolicyNumber",
		InsuredAmount: "InsuredAmount",
		EffectiveDate: "EffectiveDate",
		EndDate: "EndDate",
	};
	const normalised = normaliseData(broker1Sample, fieldMap, "broker1");
	expect(normalised[0]).toMatchObject({
		brokerName: "broker1",
		policyNumber: "POL001",
		insuredAmount: "1000000",
		effectiveDate: "2023-01-15",
		endDate: "2024-01-15",
	});
});

test("Normalises fields correctly for Broker 2", () => {
	const broker2Sample = [{ PolicyRef: "POL040", CoverageAmount: "550000", ActivationDate: "2026-03-20", ExpirationDate: "2027-03-20" }];
	const fieldMap = {
		PolicyRef: "PolicyRef",
		CoverageAmount: "CoverageAmount",
		ActivationDate: "ActivationDate",
		ExpirationDate: "ExpirationDate",
	};
	const normalised = normaliseData(broker2Sample, fieldMap, "broker2");
	expect(normalised[0]).toMatchObject({
		brokerName: "broker2",
		policyNumber: "POL040",
		insuredAmount: "550000",
		effectiveDate: "2026-03-20",
		endDate: "2027-03-20",
	});
});
