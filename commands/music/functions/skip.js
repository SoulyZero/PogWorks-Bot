const { MessageEmbed } = require('discord.js');

module.exports = function skip(message, serverQueue, queueIndex) {
    try {
        if (!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first");
        if (!serverQueue)
            return message.channel.send("There is nothing to skip!");

        queueIndex++;
        serverQueue.connection.dispatcher.end();

    }
    catch (err) {
        console.log(err);
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('❌  Failed  ❌')
            .setFooter('PogWorks Studios ©️ 2021')

        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
}