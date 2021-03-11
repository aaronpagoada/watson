const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'stats',
    description: 'Returns user statistics',
    cooldown: 1,
    execute(message){
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
                    let today = new Date();
                    let year = today.getFullYear();
                    let month = today.getMonth();
                    let day = today.getDate();
                    let dateToday = new Date(year, month, day);

                    userObject.lastRequest = [year, month + 1, day];
                    let firstReq = new Date(userObject.firstRequest);
                    let difference = (Math.floor(dateToday.getTime() - firstReq.getTime())) / (1000 * 60 * 60 * 24);

                    if(difference === 0){
                        let averageIntake = userObject.totalIntake / 1;

                        const statsEmbed = new Discord.MessageEmbed()
                            .setColor('#885d1b')
                            .setTitle(`${message.author.username}'s Statistics`)
                            .addField('Current Daily Intake', userObject.currentDailyIntake + ' drink(s)', true)
                            .addField('\u200B', '\u200B', true)
                            .addField('Total Intake', userObject.totalIntake + ' drink(s)', true)
                            .addField('Average Intake', averageIntake.toFixed(2) + ' drink(s) per day', true)
                            .addField('\u200B', '\u200B', true)
                            .addField('Days Tracked', difference + 1, true)
                        message.channel.send(statsEmbed);
                    }else{
                        let averageIntake = userObject.totalIntake / (difference + 1);

                        const statsEmbed = new Discord.MessageEmbed()
                            .setColor('#885d1b')
                            .setTitle(`${message.author.username}'s Statistics`)
                            .addField('Current Daily Intake', userObject.currentDailyIntake + ' drink(s)', true)
                            .addField('\u200B', '\u200B', true)
                            .addField('Total Intake', userObject.totalIntake + ' drink(s)', true)
                            .addField('Average Intake', averageIntake.toFixed(2) + ' drink(s) per day', true)
                            .addField('\u200B', '\u200B', true)
                            .addField('Days Tracked', difference + 1, true)
                        message.channel.send(statsEmbed);
                    }
                }else{
                    const notEmbed = new Discord.MessageEmbed()
                        .setColor('#90271b')
                        .setTitle(`You're not being tracked, ${message.author.username}!`)
                    message.channel.send(notEmbed);
                }
            }catch(err){
                console.error('Error parsing file', err);
                return;
            }
        })
    }
}