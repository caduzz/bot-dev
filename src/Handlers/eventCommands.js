function loadCommands(client){
    const ascii = require('ascii-table')

    const fs = require('fs')
    const path = require('path')

    const table = new ascii().setHeading('Commands', 'Status')

    let commandsArray = [];

    const commandsFolders = fs.readdirSync(path.join(__dirname,'../','Commands'))

    for(const folder of commandsFolders){
        const commandFiles = fs.readdirSync(path.join(__dirname,'../', 'Commands', folder)).filter(file => file.endsWith('js'))

        for(const file of commandFiles){
            const commandFile = require(`../Commands/${folder}/${file}`)

            const props = { folder, ...commandFile}

            client.commands.set(commandFile.data.name, props)

            commandsArray.push(commandFile.data.toJSON());
            
            table.addRow(file, "Loaded")
            continue
        }
    }
    client.application.commands.set(commandsArray)
    return console.log(table.toString(), '\nLoaded commands')
}

module.exports = {loadCommands}