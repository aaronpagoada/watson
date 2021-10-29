const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'drink',
    description: 'Adds (or subtracts) a drink of water to your tally',
    usage: '[number of water bottles]',
    cooldown: 1,
    execute(message, args){
        if(!args[0] || args[0] == 0){
            return message.reply('Please provide the number of bottles!');
        }else if(Number(args[0]) > 15 || Number(args[0]) < -4){
            const invEmbed = new Discord.MessageEmbed()
                .setColor('#de1f22')
                .setTitle(`That doesn\'t make any sense, ${message.author.username}.`)
            message.channel.send(invEmbed);
        }else if(typeof Number(args[0]) === 'number' && !args[1]){
            function findObjectByKey(array, key, value){
                for(let i = 0; i < array.length; i++){
                    if(array[i][key] === value){
                        return array[i];
                    }
                }
                return null;
            }

            fs.readFile('./users.json', 'utf-8', (err, jsonData) => {
                if(err){
                    console.error('Error reading file', err);
                    return;
                }

                try{
                    let userData = JSON.parse(jsonData);
                    let userObject = findObjectByKey(userData, 'name', message.author.tag);

                    if(userObject != null){
                        if(userObject.currentDailyIntake + Number(args[0]) >= 0){
                            let today = new Date();
                            let year = today.getFullYear();
                            let month = today.getMonth();
                            let day = today.getDate();

                            if(new Date(year, month, day) - new Date(userObject.lastRequest) > 0){
                                userObject.currentDailyIntake = 0;
                            }

                            userObject.currentDailyIntake += Number(args[0]);
                            userObject.totalIntake += Number(args[0]);
                            userObject.lastRequest = [year, month + 1, day];
                            
                            let editedData = JSON.stringify(userData, null, 2);

                            if(Number(args[0]) > 0){
                                if(args[0] === '1'){
                                    const addedEmbed = new Discord.MessageEmbed()
                                        .setColor('#34ebeb')
                                        .setTitle(`1 drink has been added to your tally, ${message.author.username}!`)
                                    message.channel.send(addedEmbed);
                                }else{
                                    const addedEmbed = new Discord.MessageEmbed()
                                        .setColor('#34ebeb')
                                        .setTitle(args[0] + ` drinks have been added to your tally, ${message.author.username}!`)
                                    message.channel.send(addedEmbed);
                                }
                            }else{
                                if(Number(args[0]) === -1){
                                    const addedEmbed = new Discord.MessageEmbed()
                                        .setColor('#de1f22')
                                        .setTitle(`1 drink has been subtracted from your tally, ${message.author.username}!`)
                                    message.channel.send(addedEmbed);
                                }else{
                                    let unsignedArg = args[0].slice(1);
    
                                    const addedEmbed = new Discord.MessageEmbed()
                                        .setColor('#de1f22')
                                        .setTitle(unsignedArg + ` drinks have been subtracted from your tally, ${message.author.username}!`)
                                    message.channel.send(addedEmbed);
                                }
                            }

                            fs.writeFile('./users.json', editedData, (err) => {
                                if(err){
                                    console.error('Error writing to file', err);
                                    return;
                                }else{
                                    console.log(`Drink data for ${message.author.tag} from ${message.guild.name} written to file`);
                                }
                            })
                        }else{
                            const invEmbed = new Discord.MessageEmbed()
                                .setColor('#de1f22')
                                .setTitle(`That doesn\'t make any sense, ${message.author.username}`)
                            message.channel.send(invEmbed);
                        }
                    }else{
                        const notEmbed = new Discord.MessageEmbed()
                            .setColor('#90271b')
                            .setTitle(`You\'re not being tracked, ${message.author.username}!`)
                        message.channel.send(notEmbed);
                    }
                }catch(err){
                    console.error('Error parsing file', err);
                    return;
                }
            })
        }else{
            return message.reply('Please provide less arguments!')
        }
    }
}