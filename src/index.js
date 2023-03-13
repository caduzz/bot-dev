require('dotenv').config();

const { TOKEN } = process.env;

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const { Guilds, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require('./Handlers/eventReady')
const { loadCommands } = require('./Handlers/eventCommands');

const client = new Client({
    intents: [Guilds, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
})

client.commands = new Collection();

client.login(TOKEN).then(() => {
    loadEvents(client)
    loadCommands(client)
})