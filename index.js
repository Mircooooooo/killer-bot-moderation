const Discord = require("discord.js");
const fs = require("fs");
global.client = new Discord.Client({
    intents: 32767
})


client.login(process.env.token);

client.on("ready", () => {
    console.log("Bot ONLINE")
})

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./command").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    var command = require(`./command/${file}`);
    client.commands.set(command.name, command);
}
client.on("messageCreate", message => {
    const prefix = "KB";

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return


    client.commands.get(command).execute(message, args);


})

client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    var embed = new Discord.MessageEmbed()
        .setTitle("WELCOME")
        .setDescription(`Ciao ${member.toString()}, benvenuto in ${member.guild.name}. Sei il **${member.guild.memberCount}° Membro**`)

    client.channels.cache.get("949288145847988234").send({embeds: [embed]}); 
})
//ADDIO
client.on("guildMemberRemove", member => {
    if (member.user.bot) return
    var embed = new Discord.MessageEmbed()
        .setTitle("GOODBEY")
        .setDescription(`${member.toString()}, è uscito da ${member.guild.name}`)

    client.channels.cache.get("949288182187425892").send({embeds: [embed]}); 
})


client.on("messageCreate", message => {
    if (message.channel.type == "DM") return

    var parolacce = ["vaffanculo", "troia", "coglione", "zoccola", "zoccolo", "stronzo", "cazzo", "porco dio", "porcodio"]
    var trovata = false;
    var testo = message.content;

    parolacce.forEach(parola => {
        if (message.content.toLowerCase().includes(parola.toLowerCase())) {
            trovata = true;
            testo = testo.replace(eval(`/${parola}/g`), "###");
        }
    })

    if (trovata) {
        message.delete();
        var embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setDescription("Hai scritto un messaggio con parole bloccate\rIl tuo messaggio: " + testo)
            
        message.channel.send({ embeds: [embed] })
    }
})

var embedticket = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle("TICKET ASSISTENZA")
    .setDescription("Stai riscontrando problemi con il server o all'interno del gioco? apri un ticket e spiegaci il tuo disagio!!") //Messaggio
    .setFooter({ text: "Ticket", iconURL: "https://cdn.discordapp.com/avatars/944959631384539186/6dfffa84a3b58dc9bae042eb4789a262.png?size=512"})
    .setTimestamp()

//Prima di tutto mandare il messaggio del ticket
client.on("messageCreate", message => {
    if (message.content == "KBopen")
        if (message.member.roles.cache.has("949288099152789554")) { //Ruolo admin 
            message.channel.send({ embeds: [embedticket] })
                .then(msg => msg.react("📩")) //Personalizzare l'emoji della reaction
                message.delete()
        }
})

client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return
    if (messageReaction.message.partial) await messageReaction.message.fetch();
    if (messageReaction._emoji.name == "📩") { //Personalizzare l'emoji della reaction
        if (messageReaction.message.channel.id == "950041566209273916") { //Settare canale
            messageReaction.users.remove(user);
            var server = messageReaction.message.channel.guild;
            if (server.channels.cache.find(canale => canale.topic == `User ID: ${user.id}`)) {
                user.send("Hai un ticket già aperto!!").catch(() => { })
                return
            }
            server.channels.create(user.username, {
                type: "GUILD_TEXT"
            }).then(canale => {
                canale.setTopic(`User ID: ${user.id}`);
                canale.setParent("950041526845718589") //Settare la categoria

                canale.permissionOverwrites.set([
                    {
                        id: server.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: user.id,
                        allow: ["VIEW_CHANNEL"]
                    }
                ])

                var embedticket1 = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("🎫SUPPORTO TICKET🎫")
                    .setDescription(`<@${user.id}> La ringraziamo di aver aperto un ticket, un membro dello staff sarà da lei il prima possibile!!`)
                    .setTimestamp()

                canale.send("<@&949288099152789554> andiamo ad aiutarlo!!") //messaggio sopra  (lo metto per provare dopo lo puoi cambiare)
                canale.send({ embeds: [embedticket1] }) 
            });
        }
    }
})

client.on("messageCreate", message => {
    if (message.content == "KBclose") {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }
        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.permissions.has()) {
                message.channel.delete();
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
})




