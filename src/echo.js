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
import CommandParser from './module/command-parser.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
	console.log('Bang, echo! | The echo is deafening');
});

/**
 * Captures the chat message before it is rendered to determine
 * if it contains the !echo command.
 */
Hooks.on('chatMessage', (log, message, data) => {
	return !CommandParser.parse(log, message, data);
});
