require('dotenv').config();

const { REST, Routes } = require('discord.js');

const { TOKEN, CLIENT_ID } = process.env;

const fs = require('node:fs');
const path = require('node:path');

let commandsArray = [];

const commandsFolders = fs.readdirSync(path.join(__dirname,'Commands'))

for(const folder of commandsFolders){
    const commandFiles = fs.readdirSync(path.join(__dirname, 'Commands', folder)).filter(file => file.endsWith('js'))

    for(const file of commandFiles){
        const commandFile = require(`./Commands/${folder}/${file}`)

        commandsArray.push(commandFile.data.toJSON());
    }
}
const rest = new REST({version: "10"}).setToken(TOKEN);

(async () => {
    try {
        console.log(`Resetando ${commandsArray} comandos...`);
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commandsArray }
        );
        console.log("Commandos registrados com sucesso!");
    } catch (error) {
        console.error(error)
    }
})()