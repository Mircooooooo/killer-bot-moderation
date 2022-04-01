const Discord = require('discord.js')

module.exports = {
    name: "warn",
    execute(message) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has('WARN_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        if (!utente.kickable) {
            return message.channel.send('Io non ho il permesso');
        }
    }}