// Filters active policies
const filterActivePolicies = (policies, currentDate = new Date()) => {
	return policies.filter((policy) => new Date(policy.startDate) <= currentDate && new Date(policy.renewalDate || policy.endDate) >= currentDate);
};

// Calculates the sum of insured amounts for active policies
const calculateTotalInsured = (activePolicies) => {
	return activePolicies.reduce((sum, policy) => sum + parseFloat(policy.insuredAmount), 0);
};

// Calculates the average policy duration for active policies (this one was painful - I hate working with dates!)
const calculateAverageDuration = (activePolicies) => {
	if (!activePolicies.length) return 0;

	const totalDuration = activePolicies.reduce((sum, policy) => {
		const [startYear, startMonth, startDay] = policy.startDate.split("-").map(Number);
		const [endYear, endMonth, endDay] = policy.endDate.split("-").map(Number);

		const start = Date.UTC(startYear, startMonth - 1, startDay);
		const end = Date.UTC(endYear, endMonth - 1, endDay);

		// Calculate duration in days
		const duration = (end - start) / (1000 * 60 * 60 * 24) + 1;
		return sum + duration;
	}, 0);

	// Calculate the average
	const averageDuration = totalDuration / activePolicies.length;
	return parseFloat(averageDuration.toFixed(1));
};

// All the logging for active policies
const generateReport = (policies) => {
	const activePolicies = filterActivePolicies(policies);
	const totalActivePolicies = activePolicies.length;
	const totalActiveCustomers = new Set(activePolicies.map((policy) => policy.businessDescription)).size;
	const totalActiveInsured = calculateTotalInsured(activePolicies);
	const avgActiveDuration = calculateAverageDuration(activePolicies);

	console.log("\n--- Active Policies Report ---");
	console.log(`Total Policies: ${policies.length}`);
	console.log(`Total Active Policies: ${totalActivePolicies}`);
	console.log(`Total Customers with Active Policies: ${totalActiveCustomers}`);
	console.log(`Sum of Active Insured Policy Amounts: ${totalActiveInsured.toFixed(2)}`);
	console.log(`Average Active Policy Duration: ${avgActiveDuration.toFixed(2)} days`);
};

// Queries policies by a specific broker name
const queryByBroker = (policies, brokerNameInput) => {
	const brokerPolicies = policies.filter((policy) => policy.brokerName && policy.brokerName.toLowerCase() === brokerNameInput.toLowerCase());

	if (brokerPolicies.length > 0) {
		console.log(`\n--- Policies for Broker: ${brokerNameInput} ---`);
		console.log(brokerPolicies); // I did have this as a console.table but it was a bit messy because there's just so much data
	} else {
		console.log(`No policies found for broker: ${brokerNameInput}`);
	}

	return brokerPolicies;
};

// Exports the helper functions for testing in aggregator.test.js and usage in index.js
export { calculateAverageDuration, calculateTotalInsured, filterActivePolicies, generateReport, queryByBroker };
