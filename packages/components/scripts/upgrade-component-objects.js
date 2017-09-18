#!/usr/bin/env node

const fs = require('fs')
const lernaConf = require('../../../lerna.json');

const POM_PATH = './e2e/component-objects/pom.xml';
const POM_ENCODING = 'utf8';

console.log(`Replace Component-objects version to ${lernaConf.version}`);

fs.readFile(POM_PATH, POM_ENCODING, (readErr, data) => {
	if (readErr) {
		console.log(readErr);
		throw new Error('Unable to read component-objects pom.xml');
	}

	const result = data.replace(/<version>[.0-9]+<\/version>/, `<version>${lernaConf.version}</version>`);

	fs.writeFile(POM_PATH, result, POM_ENCODING, (writeErro) => {
		if (writeErro) {
			console.log(writeErro);
			throw new Error('Unable to write component-objects pom.xml');
		}
	});
});
