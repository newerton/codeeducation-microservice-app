import {default as chalk} from 'chalk';
import './bootstrap';
import * as commands from './commands';

const command = process.argv[2] || null;
if (!command) {
  showAvailableCommand();
}

const commandKey: string | undefined = Object.keys(commands).find(
  //@ts-ignore
  (c) => commands[c].command === command,
);

if (!commandKey) {
  showAvailableCommand();
}

//@ts-ignore
const commandInstance = new commands[commandKey]();

commandInstance.run().catch(console.error);

function showAvailableCommand() {
  console.log(chalk.green('Loopback Console'));
  console.log('');
  console.log(chalk.green('Available command'));
  console.log('');
  for (const c of Object.keys(commands)) {
    //@ts-ignore
    console.log(`${commands[c].command}\t\t${commands[c].description}`);
  }
  console.log('');
  process.exit();
}
