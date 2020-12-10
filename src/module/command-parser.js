/**
 * Utility class used to parse the incoming command.
 */
export default class CommandParser {
    /**
     * Captures the chat message before it is rendered to determine
     * if it contains the !echo command.
     * 
     * @param {ChatLog} log     The `ChatLog` object
     * @param {string}  message The message to parse
     * @param {*}       data    Data for the chat message
     */
    static parse(log, message, data) {
        // If the chat message doesn't start with an exclamation point (!)
        // then we don't care about it.
        if (!message.trimStart().startsWith('!')) return false;
        const test = game.echo.parser.parse(message.trimStart(), (err, argv, output) => {
            if (argv.help) {
                this.printHelp(data);

                return true;
            }

            if (output) {
                this._createChatMessage(output, data);

                return true;
            }
            
            let actor;
            if (data.speaker?.actor ?? false) {
                actor = game.actors.get(data.speaker.actor);
            }

            if (argv.actor) {
                actor = game.actors.getName(argv.actor);
            }

            if (!actor) {
                this.printHelp(data);

                return true;
            }

            let item;
            if (argv.item) {
                item = actor.items.find(i => i.name === argv.item);
            }
            
            const rollData = actor.getRollData();
            if (item) mergeObject(rollData, { item: item.getRollData() });
            
            let message = argv.message.reduce((prev, curr) => {
                if (curr.startsWith('@')) {
                    let val = getProperty(rollData, curr.replace('@', ''));
                    prev.push(`<code>${val}</code>`);
                } else {
                    prev.push(curr);
                }

                return prev;
            }, []);

            this._createChatMessage(`<div>${message.join(' ')}</div>`, data);
        });

        console.log(test);

        return true;
    }

    static async printHelp(data) {
        const template = await renderTemplate("./modules/echo/templates/help.html", {});

        await this._createChatMessage(template, data);
    }

    /**
     * Display a message to chat.
     * 
     * @param {HTMLElement|string|JQuery} message      The message to display
     * @param {object}                    data         Data passed to the chatmessage
     * @param {string}                    data.user    The user sending the message
     * @param {*}                   data.speaker The speaker of the message
     */
    static async _createChatMessage(message, data) {
        await ChatMessage.create({
            content: message,
            user: data.user,
            speaker: data.speaker,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER
        });
    }
}
