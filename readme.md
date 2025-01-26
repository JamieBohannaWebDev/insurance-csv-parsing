# B2B Insurance CSV Parsing

Hey there! This is a project that parses and normalizes CSV data for different insurance brokers.

This was a bit of a tricky project, but I'm happy with the result. I hope you like it!

This project uses Node.js and the following dependencies:

- **[csv-parser](https://www.npmjs.com/package/csv-parser)**: A CSV parsing library that we use to read the CSV files.
- **[jest](https://www.npmjs.com/package/jest)**: A testing library that we use to write our tests.
- **[chalk](https://www.npmjs.com/package/chalk)**: A library that we use to add some color to our console output.

## Prerequisites

- **Node.js (v14 or newer)**: We use some modern JavaScript features, so you'll want an updated version of Node.
- **npm**: Typically included with Node.js, used to install our dependencies.

## Installation

1. **Clone this repo** or [download it](https://github.com/JamieBohannaWebDev/insurance-csv-parsing).

   ```bash
   git clone https://github.com/JamieBohannaWebDev/insurance-csv-parsing.git
   cd broker-insights

2. **Install dependencies**

   ```bash
   npm install

3. **Run the project**

   ```bash
   node src/index.js

4. **Run the tests**

   ```bash
   npm test
   npm run coverage
