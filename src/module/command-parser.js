import parser from "https://unpkg.com/yargs-parser@20.2.4/browser.js";

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
        // If the chat message doesn't start with !echo
        // then we don't care about it.
        if (!message.trimStart().startsWith('!echo')) return false;

        const argv = parser(message.replace('!echo', ''), {
            alias: {
                actor: ['a'],
                item: ['i'],
                help: ['h']
            }
        });

        if (!argv || !(argv._.length > 0)) {
            this.printHelp(data);

            return true;
        }

        if (argv.help) {
            this.printHelp(data);

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
        
        let echo = argv._.reduce((prev, curr) => {
            prev.push(Roll.replaceFormulaData(curr, rollData, {missing: 'undefined'}));

            return prev;
        }, []);

        this._createChatMessage(`<div>${echo.join(' ')}</div>`, data);

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
