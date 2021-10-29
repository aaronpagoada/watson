const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'new',
    description: 'Creates new user data for tracking',
    cooldown: 1,
    execute(message){
        fs.readFile('./users.json', 'utf-8', (err, jsonData) => {
            if(err){
                console.error('Error reading file', err);
                return;
            }

            try{
                const userData = JSON.parse(jsonData);
                let existingDataArray = new Array(userData);
                let userDataString = JSON.stringify(userData, null, 2);

                if(userDataString.includes(message.author.tag)){ //IF USER ALREADY IN FILE DATABASE
                    const alreadyEmbed = new Discord.MessageEmbed()
                        .setColor('#90271b')
                        .setTitle(`You\'re already being logged, ${message.author.username}! No need for two of you.`)
                    
                    message.channel.send(alreadyEmbed);
                }else{ //IF USER NOT IN FILE DATABASE
                    let rewriteDataArray = new Array();
                    let today = new Date();
                    let year = today.getFullYear();
                    let month = today.getMonth();
                    let day = today.getDate();

                    const user = {
                            name: message.author.tag,
                            currentDailyIntake: 0,
                            totalIntake: 0,
                            lastRequest: [year, month + 1, day],
                            firstRequest: [year, month + 1, day]
                    }

                    if(userDataString.length > 2){ //array magic
                        for(let i = 0; i < existingDataArray[0].length; i++){ 
                            rewriteDataArray.push(existingDataArray[0][i]);
                        }
                    }

                    rewriteDataArray.push(user);

                    let userjsonString = JSON.stringify(rewriteDataArray, null, 2);

                    fs.writeFile('./users.json', userjsonString, (err) => {
                        if(err){
                            console.error('Error writing to file', err);
                            return;
                        }else{
                            const newEmbed = new Discord.MessageEmbed()
                                .setColor('#2982f0')
                                .setTitle(`Gotcha, ${message.author.username}! I\'ll keep my eye on you from now on!`)
                            
                            message.channel.send(newEmbed);

                            console.log(`Data for ${message.author.tag} from ${message.guild.name} written to file`);
                        }
                    });
                }
            }catch(err){
                console.error('Error parsing file', err);
                return;
            }
        })
    }
}