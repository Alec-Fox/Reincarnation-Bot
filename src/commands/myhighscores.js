/* eslint-disable space-before-function-paren */
const rp = require('request-promise');
const {
    DUNGEON_NAMES,
} = require('../util/constants.js');
const {
    constructEmbed,
    formatDungeonName,
} = require('../util/utilities.js');
module.exports = {
    name: 'myhighscores',
    description: 'Displays  your personal best records for all dungeons.',
    cooldown: 5,
    modOnly: false,
    execute(message) {
        message.delete();
        let dungNumber = 0;
        if (message.client.memberinfo[message.member.id].steamid === '') return message.reply('You need to set your steam id with .setsteamid');
        /** API request options for Dungeon Top 10
         *
         * @param {string} dungeonName - Name of the dungeon to lookup
         */
        const determineReqOptions = (dungeonName, steamId) => {
            return {
                uri: `http://reincarnationrpg.com:3000/api/dungeons/top10?dungeon_name=${dungeonName}&players=[${steamId}]&json=true`,
                headers: {
                    'User-Agent': 'Request-Promise',
                },
                json: true,
            };
        };
        const embed = constructEmbed(`${message.author.username}'s Dungeon Records`, '', null, null, message.member.user.displayAvatarURL);
        DUNGEON_NAMES.forEach((dungeon) => {
            rp(determineReqOptions(dungeon, message.client.memberinfo[message.member.id].steamid))
                .then(function (apiResponse) {
                    const highScore = apiResponse[0];
                    if (highScore != undefined) {
                        const dungTime = Math.round(highScore.TimeTaken * 1000) / 1000;
                        embed.addField(formatDungeonName(dungeon), `${dungTime} secs.`, true);
                    }
                    dungNumber++;
                    if (dungNumber === 19) message.channel.send(embed);

                })
                .catch((err) => {
                    console.error(err);
                });
        });

    },
};