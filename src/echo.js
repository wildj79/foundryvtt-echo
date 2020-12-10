/**
 * This is a simple utilty that echo's what you type into a new ChatMessage.
 * The magic of this module is that it will evaluate any roll-like parameters that you
 * pass it.
 * 
 * @author James Allred <wildj79 at gmail.com>
 * @license MIT
 * @copyright (c) 2020 James Allred
 */

// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import CommandParser from './module/command-parser.js';
import Yargs from 'https://unpkg.com/yargs@16.2.0/browser.mjs';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
	console.log('Bang, echo! | The echo is deafening');
	
	game.echo = {
		parser: Yargs()
		.scriptName('')
		.command('!echo [options] <message...>', 'Echo the users input', {
			actor: {
				alias: 'a',
				describe: 'The name of an actor to pull roll data from',
				default: null
			},
			item: {
				alias: 'i',
				describe: 'The name of an item that the currently selected actor owns to pull roll data from',
				default: null
			}
		})
		.help()
		.showHelpOnFail(false)
		.parserConfiguration({'parse-positional-numbers': false})
		.version(false)
	};
	
	// Register custom module settings
	registerSettings();
	
	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
});

/**
 * Captures the chat message before it is rendered to determine
 * if it contains the !echo command.
 */
Hooks.on('chatMessage', (log, message, data) => {
	return !CommandParser.parse(log, message, data);
});
