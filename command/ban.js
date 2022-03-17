const Discord = require('discord.js')

module.exports = {
    name: "ban",
    description: "banna una persona",
    execute(message) {
                var utente = message.mentions.members.first();
                if (!message.member.permissions.has('BAN_MEMBERS')) {
                    return message.channel.send('Non hai il permesso');
                }
                if (!utente) {
                    return message.channel.send('Non hai menzionato nessun utente');
                }
                if (!utente.bannable) {
                    return message.channel.send('Io non ho il permesso');
                }
                utente.ban()
                    .then(() => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(`${utente.user.username} bannato`)
                            .setDescription(`Utente bannato da ${message.author.toString()}`)
        
                        message.channel.send({ embeds: [embed] })
                    })
            }
        }
