#!/usr/bin/env node

const fs = require('fs');
const exec = require('child_process').exec;
const lernaConf = require('../../../lerna.json');

const POM_PATH = './e2e/component-objects/pom.xml';
const POM_ENCODING = 'utf8';

console.log(`Replace Component-objects version to ${lernaConf.version}`);

function exe(command, cb) {
	exec(command, (err, stdout, stderr) => {
		if (err) {
			return cb(new Error(err), null);
		} else if (typeof (stderr) !== 'string') {
			return cb(new Error(stderr), null);
		}
		return cb(null, stdout);
	});
}

function addAndCommit() {
	exe(`git add . && git commit --amend --no-edit && git tag -fa v${lernaConf.version}`);
}

fs.readFile(POM_PATH, POM_ENCODING, (readErr, data) => {
	if (readErr) {
		console.log(readErr);
		throw new Error('Unable to read component-objects pom.xml');
	}

	const result = data.replace(/<version>[.0-9]+<\/version>/, `<version>${lernaConf.version}</version>`);

	fs.writeFile(POM_PATH, result, POM_ENCODING, (writeErr) => {
		if (writeErr) {
			console.log(writeErr);
			throw new Error('Unable to write component-objects pom.xml');
		}

		addAndCommit();
	});
});
