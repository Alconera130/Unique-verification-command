const { Client } = require('discord.js')

const client = new Client({
    intents: 32767
})

client.func = require(process.cwd() + '/config/main/handler.js')
client.variables = require(process.cwd() + '/config/main/config.json').variables

client.login(process?.env?.TOKEN || 'TOKEN')
