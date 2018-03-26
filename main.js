const readline = require('readline'),
Quiz = require('./quiz.js'),
chalk = require('chalk'),
Store = require('./store.js')('sql');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.on('close', () => {
	console.log('Adiós!');
	process.exit(0);
});

let commands;

const prompText = chalk.magenta("quiz > ");
let quiz;
let store = new Store();
store.init().then(() => {
	quiz = new Quiz(store, rl);
	commands = quiz.commands;
	rl.question(prompText, processInput);
}).catch((error) => {
	console.log(error);
})

function processInput(command) {
	let splitCommand = command.split(" ");
	let commandName = splitCommand[0].toLowerCase();
	let commandArgs;
	if (splitCommand.length > 1) {
		commandArgs = splitCommand.slice(1, splitCommand.length);
	}
	
	let promise;
	for (command of commands) {
		if(command.name == commandName || command.alias == commandName){
			if (commandArgs) {
				promise = quiz[command.name](...commandArgs);
			} else {
				promise = quiz[command.name]();
			}
			
			commandFound = true;
			break;
		}
	}
	
	if(promise) {
		promise.then(() => {
			rl.question(prompText, processInput);
		}).catch((error) => {
			console.log(error);
		});
	} else {
		console.log(chalk.yellow.bgRed.bold("El comando " + commandName + " no se ha encontrado, pruebe con \"help\""));
		rl.question(prompText, processInput);
	}
	
}