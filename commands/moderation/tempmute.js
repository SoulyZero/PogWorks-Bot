const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const fs = require('fs');

module.exports = {
    name: 'tempmute',
    category: 'moderation',
    description: 'Mutes a user for a specific ammount of time (minutes).',
    usage: `tempmute`,
    run: async (client, message) => {
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            if (message.member.guild.roles.cache.find(role => role.name === "MUTED")) {

                const user = message.mentions.users.first();

                if (user) {

                    const member = message.guild.members.resolve(user);
                    let time = message.content.split(' ')[2];

                    if (!time) {
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle('No time specified!')

                        return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                    }

                    console.log(ms(time));

                    if (member) {

                        member.roles.add(message.guild.roles.cache.find(r => r.name === "MUTED")).catch(err => console.error(err));
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle(`${user.tag} is now muted for ` + time)

                        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                        
                        fs.appendFile('./persistentRoles/persistentMute.txt', user.id + `,\n`, function (err) {
                            if (err) throw err;
                            console.log('Updated the mute file!');
                        });

                        setTimeout(() => {

                            member.roles.remove(message.guild.roles.cache.find(r => r.name === "MUTED")).catch(err => console.error(err));
                            const embed1 = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`${user.tag} is no longer muted`)
                            message.channel.send(embed1).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));


                            fs.readFile('./persistentRoles/persistentMute.txt', function (err, data) {
                                if (err) throw error;
                                data = data + '';
                                let dataArray = data.split('\n'); 
                                const searchKeyword = user.id; 
                                let lastIndex = -1; 

                                for (let index = 0; index < dataArray.length; index++) {
                                    if (dataArray[index].includes(searchKeyword)) { 
                                        lastIndex = index; 
                                        break;
                                    }
                                }

                                dataArray.splice(lastIndex, 1); 

                                const updatedData = dataArray.join('\n');
                                fs.writeFile('./persistentRoles/persistentMute.txt', updatedData, (err) => {
                                    if (err) throw err;
                                    console.log('Successfully removed from the muted data');
                                });

                            });

                        }, ms(time));


                    } else {
                        const embed2 = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle(`Unknown user!`)

                        message.channel.send(embed2).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                    }
                } else {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`No users were mentioned!`)

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                }
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`Please generate the MUTED role first!`)

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            }
        }
    }
}