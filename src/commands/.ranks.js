const {
    DEV_ID,
} = require('../util/constants.js');
const Canvas = require('canvas');
const {
    Attachment,
} = require('discord.js');
const rp = require('request-promise');
const c = require('../util/constants.js');
const {
    steamLookup,
} = require('../util/utilities.js');
const {
    formatDungeonName,
} = require('../util/utilities.js');
module.exports = {
    name: 'ranks',
    description: 'Display fastest dungeon times',
    aliases: ['rank', 'dungeon', 'highscore'],
    usage: '\n.ranks [dungeon name] | (shows the best time of any player size)\nor\n.ranks [dungeon name] [qty] | Shows the best time with [1-6] players\n\n' + `DUNGEON NAMES:
butchers_sepulcher, desolate_stockade, abandoned_mine, centaur_arena, wolfs_cave, harpy_peak, dire_sanctuary, satyr_seer, satyr_conjuror, satyr_demon, satyr_lord, ice_lair, underpass, jungle_temple, sunken_city, lost_woods,desert_pyramid, magma_core, trial_of_flame, abyssal_stronghold`,
    cooldown: 5,
    args: true,
    modOnly: false,
    execute(message, args) {
        const dungeonName = args[0];
        let dungQty;
        // Determines parameters for dungeon quantity
        if (!c.DUNGEON_NAMES.includes(dungeonName)) return message.reply('Invalid dungeon name.');
        switch (args[1]) {
            case '1':
                dungQty = '&num_heroes=1';
                break;
            case '2':
                dungQty = '&num_heroes=2';
                break;
            case '3':
                dungQty = '&num_heroes=3';
                break;
            case '4':
                dungQty = '&num_heroes=4';
                break;
            case '5':
                dungQty = '&num_heroes=5';
                break;
            case '6':
                dungQty = '&num_heroes=6';
                break;
            default:
                dungQty = '';
        }

        /** API request options for Dungeon Top 10
         *
         * @param {string} dungeonName - Name of the dungeon to lookup
         */
        const determineReqOptions = () => {
            return {
                uri: `http://reincarnationrpg.com:3000/api/dungeons/top10?dungeon_name=${dungeonName}${dungQty}&json=true`,
                headers: {
                    'User-Agent': 'Request-Promise',
                },
                json: true,
            };
        };

        const applyText = (canvas, size) => {
            const ctx = canvas.getContext('2d');
            ctx.textAlign = 'center';
            ctx.font = `${size}px sans-serif`;
            return ctx.font;
        };

        const applyNameText = (canvas, text) => {
            const textInfo = {};
            const ctx = canvas.getContext('2d');
            let fontSize = 17;
            ctx.textAlign = 'left';
            ctx.font = `${fontSize}px sans-serif`;
            do {
                ctx.font = `${fontSize -= 1}px sans-serif`;
            } while (ctx.measureText(text).width > 95);
            textInfo.font = ctx.font;
            textInfo.width = ctx.measureText(text).width;

            return textInfo;
        };

        rp(determineReqOptions(dungeonName))
            .then(function(apiResponse) {
                const data = apiResponse;
                const highScore = data[0];
                if (highScore === undefined) return (message.reply('No data for that dungeon'));
                const images = [];
                const steamIds = [];
                const playerNames = [];
                const dungTime = Math.round(highScore.TimeTaken * 1000) / 1000;
                highScore.Players.forEach(player => steamIds.push(player.account_id));
                rp(steamLookup(JSON.stringify(steamIds)))
                    .then(async function(steamData) {
                        steamData.forEach(steamPlayer => (playerNames.push(steamPlayer.personaname)));

                        highScore.Players.forEach((player) => {
                            const heroName = c.HERO_LIST[player.hero];
                            images.push(`C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/portraits/${heroName}.png`);
                        });

                        const canvas = Canvas.createCanvas(633, 356);
                        const ctx = canvas.getContext('2d');
                        const background = await Canvas.loadImage('C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/templates/dungeon_ranks_template.png');
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                        ctx.strokeStyle = '#74037b';
                        ctx.strokeRect(0, 0, canvas.width, canvas.height);
                        let xPosition = 0;
                        let iu = 0;
                        const startXpos = (316.5 - ((96.25 * playerNames.length) / 2));
                        ctx.font = applyText(canvas, 50);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(`${formatDungeonName(dungeonName)}`, canvas.width / 2, 90);
                        ctx.font = applyText(canvas, 40);
                        ctx.fillText(`${dungTime} secs`, canvas.width / 2, 313);
                        images.forEach(async (heroPicture) => {
                            const loadedHeroPicture = await Canvas.loadImage(heroPicture);
                            ctx.drawImage(loadedHeroPicture, (startXpos + xPosition), 150, 95, 55);
                            const textInfo = applyNameText(canvas, `${playerNames[iu]}`);
                            ctx.font = textInfo.font;
                            ctx.fillText(`${playerNames[iu]}`, startXpos + xPosition + ((95 - (textInfo.width)) / 2), 220);
                            xPosition += 100;
                            iu++;
                            if(iu === images.length) {
                                const attachment = new Attachment(canvas.toBuffer(), 'ranksImage.png');
                                message.channel.send(attachment);
                            }
                        });

                    });
            })
            .catch((err) => {
                console.error(err);
            });
    },
};