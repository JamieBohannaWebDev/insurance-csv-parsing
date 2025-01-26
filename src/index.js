import { processCSVFiles } from './aggregator.js';
import { generateReport, queryByBroker } from './reports.js';
import chalk from 'chalk';
import readline from 'readline';

(async () => {
  try {
    // Start the main processing
    const policies = await processCSVFiles();

    // Generate the report (active policies, customers, insured amount, avg duration)
    generateReport(policies);

    // Terminal prompt for broker name
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(chalk.blue('\nEnter a broker name (e.g., "broker1" or "broker2") to view their policies: '), (brokerName) => {

      // Pass that name and the processed policies into the queryByBroker func
      queryByBroker(policies, brokerName);
      rl.close();
    });
  } catch (err) {
    console.error(chalk.red('Error:'), err.message);
  }
})();
