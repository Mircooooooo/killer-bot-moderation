const Discord = require('discord.js')

module.exports = {
    name: "kick",
    description: "Kicka una persona",
    execute(message) {
                var utente = message.mentions.members.first();
                if (!message.member.permissions.has('KICK_MEMBERS')) {
                    return message.channel.send('Non hai il permesso');
                }
                if (!utente) {
                    return message.channel.send('Non hai menzionato nessun utente');
                }
                if (!utente.kickable) {
                    return message.channel.send('Io non ho il permesso');
                }
                utente.kick()
                    .then(() => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(`${utente.user.username} kickato`)
                            .setDescription(`Utente kickato da ${message.author.toString()}`)
        
                        message.channel.send({ embeds: [embed] })
                    })
            }
        }