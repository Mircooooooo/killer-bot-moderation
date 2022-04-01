const { Permissions, MessageEmbed } = require("discord.js")

const db = require("quick.db")

let wrong = "#F04A47"
let right = "#43B581"

module.exports = {
  name: "warn",
  description: "Warns a user along with storing the total warns",
  run: async (client, message, args) => {
    try {


      const check = client.emojis.cache.find(x => x.name === "CheckMark")
      const cross = client.emojis.cache.find(x => x.name === "WrongMark")

      if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBER)) {
        const embed = new MessageEmbed()
          .setDescription(`**${cross} Missing KICK MEMBERS permissions**`)
          .setColor(wrong)
        return message.channel.send({ embeds: [embed] })
      }

      const target = message.mentions.users.first()
      if (!target) {
        const embed = new MessageEmbed()
          .setDescription(`**${cross} You must mention the user you want warned**`)
          .setColor(wrong)
        return message.channel.send({ embeds: [embed] })
      }

      if (target.bot) {
        const embed = new MessageEmbed()
          .setDescription(`**${cross} You cannot warn bots**`)
          .setColor(wrong)
        return message.channel.send({ embeds: [embed] })
      }

      if (target.id === message.author.id) {
        const embed = new MessageEmbed()
          .setDescription(`**${cross} Sorry but you can not warn yourself**`)
          .setColor(wrong)
        return message.channel.send({ embeds: [embed] })
      }


      if (message.member.roles.highest.comparePositionTo
        (message.mentions.members.first().roles.highest) < 1) {
        const embed = new MessageEmbed()
          .setDescription(`**${cross} You're role is too low**`)
          .setColor(wrong)
        return message.channel.send({ embeds: [embed] })
      }

      let reason = args.slice(1).join(" ")

      if (!reason) {
        const embed = new MessageEmbed()
          .setDescription(`**${cross} Please provide a valid reason**`)
          .setColor(wrong)
        return message.channel.send({ embeds: [embed] })
      }



      db.add(`warns_${target.id}`, 1)
      let x = db.get(`warns_${target.id}`)

      const embed = new MessageEmbed()
        .setDescription(`**${check} ${target.username} has been warned with ${x} now**`)
        .setColor(right)
      message.channel.send({ embeds: [embed] })

      try {

        let embed = new MessageEmbed()
          .setDescription(`⚠️ You have been warned in ${message.guild.name} by ${message.author.username}`)
          .setFooter(`Reason- ${reason}`)
          .setColor("#FFFF00")
        target.send({ embeds: [embed] })


      } catch (err) {
        const embed = new MessageEmbed()
          .setDescription(`**${cross} I can not send messages to that user**`)
          .setColor(wrong)
        return message.channel.send({ embeds: [embed] })
      }

    } catch (err) {
      console.log(err)
      const embed = new MessageEmbed()
        .setDescription(`**${cross} An unknown error occured**`)
        .setColor(wrong)
      return message.channel.send({ embeds: [embed] })
    }
  }
}