const Discord = require('discord.js');
const token = require("token");
const bdd = require("bdd");
const fs = require("fs")

const bot = new Discord.Client();

bot.on("ready", async () => {
    console.log("Bot is Ready")
    bot.user.setStatus("idle");
    setTimeout(() => {
        bot.user.setActivity("En Développement", {type: "COMPETING"});
    }, 100)
    
})
//Message de bienvenue sur le serveur (modifier les paranthèse pour modifier les chanel ou le message s'affichera)
bot.on("guildMemberAdd", member => {

    if(bdd["message-bienvenue"]){
        bot.channels.cache.get('781640250459160586').send(bdd["message-bienvenue"]);
    }
    else{
        bot.channels.cache.get('781640250459160586').send(`**Bienvenue sur le serveur** ${member} !`);
    }
    member.send('**Bienvenue sur le serveur Discord La Mafia. Merci!**')
    member.roles.add('774352324571037696');

})
//Supprimée un nombre définie de message sur un chanel text
bot.on("message", message => {

    if(message.content.startsWith("!clear")){
        message.delete();
        if(message.member.hasPermission('MANAGE_MESSAGES')){

            let args = message.content.trim().split(/ +/g);
            
            if(args[1]){
                if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){

                    message.channel.bulkDelete(args[1])
                    message.channel.send(`**Vous avez supprimé ${args[1]} message(s)**`)

                }
                else{
                    message.channel.send(`**Vous devez entré un nombre entre 1 et 99 !**`)
                }
            }
        }
        else{
            message.channel.send(`**Vous devez avoir les permisions !**`)
        }
    }
    //Commande pour définir un message de bienvenue
    if(message.content.startsWith("!mb")){
        message.delete()
        if(message.member.hasPermission('MANAGE_MESSAGES')){
            if(message.content.length > 5){
                message_bienvenue = message.content.slice(4)
                bdd["message-bienvenue"] = message_bienvenue
                Savebdd()
            }
        }
    }
    //Ban ou Mute un personne avec la commande définie + un message certifier que la personne a bien était ban ou mute
    if(message.content.startsWith("!warn")){

        message.delete();
        if(message.member.hasPermission('MUTE_MEMBERS')){

            if(!message.mentions.users.first())return;
            utilisateur = message.mentions.users.first().id

            if(bdd["warn"][utilisateur] == 2){

                delete bdd["warn"][utilisateur]

                message.guild.members.ban(utilisateur)
                message.channel.send(`Un Utilisateur vient de ce faire ban ${member}`)

            }
            else{
                if(!bdd["warn"][utilisateur]){
                    bdd["warn"][utilisateur] = 1
                    Savebdd();
                    message.channel.send("Tu as a présent " + bdd["warn"][utilisateur] + " avertissement(s)");
                }
                else{
                    bdd["warn"][utilisateur]++
                    Savebdd();
                    message.channel.send("Tu as a présent " + bdd["warn"][utilisateur] + " avertissements");
                }
            }
        }
    }

    if(message.content.startsWith("!kick")){
        message.delete();
        if(message.member.hasPermission('BAN_MEMBERS')){
            if(!message.mentions.users.first())return;
            
               message.guild.members.kick(utilisateur)
               message.channel.send(`Un Utilisateur vient de ce faire ban ${member}`)
            
            }
        }
    }

)       


//Erreur
function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}



bot.login(token.token);
