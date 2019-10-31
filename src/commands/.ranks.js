const Jimp = require("jimp");
const rp = require('request-promise');
const c = require('../util/constants.js')
const {
    steamLookup
} = require('../util/utilities.js');
const {
    formatDungeonName,
} = require('../util/utilities.js');
module.exports = {
    name: 'ranks',
    description: 'Display fastest dungeon times',
    aliases: ['rank', 'dungeon', 'highscore'],
    usage: '\n\n**.ranks [dungeon name]**\n(shows the best time of any player size)\n\nor\n\n**.ranks [dungeon name] [qty]**\n([qty] must be between 1-6)\n(Shows the fastest time with [qty] players in [dungeon name]\n\n' + `DUNGEON NAMES:

    butchers_sepulcher
    desolate_stockade
    abandoned_mine
    centaur_arena
    wolfs_cave
    harpy_peak
    dire_sanctuary
    satyr_seer
    satyr_conjuror
    satyr_demon
    satyr_lord
    ice_lair
    underpass
    jungle_temple
    sunken_city
    lost_woods
    desert_pyramid
    magma_core
    trial_of_flame
    abyssal_stronghold`,
    cooldown: 5,
    args: true,
    execute(message, args) {
        message.delete();
        const dungeonName = args[0];

        //Determins parameters for dungeon quantity
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

        /** Sends image to channel
         * 
         * @param {obejct} msg 
         */
        sendStats = msg => {
            msg.channel.send({
                file: "C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/templates/templatenew.png"
            });
        }

        /**API request options for Dungeon Top 10
         * 
         * @param {string} dungeonName - Name of the dungeon to lookup
         */
        determineReqOptions = dungeonName => {
            return {
                uri: `http://reincarnationrpg.com:3000/api/dungeons/top10?dungeon_name=${dungeonName}${dungQty}&json=true`,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true,
            }
        }

        rp(determineReqOptions(dungeonName))
            .then(function (apiResponse) {
                const data = apiResponse
                const highScore = data[0];
                let images = [];
                let jimps = [];
                let fonts = [Jimp.FONT_SANS_128_WHITE, Jimp.FONT_SANS_32_WHITE, Jimp.FONT_SANS_16_WHITE];
                let jimpFonts = [];
                steamIds = [];
                playerNames = [];
                const dungTime = Math.round(highScore.TimeTaken * 1000) / 1000;
                highScore.Players.forEach(player => steamIds.push(player.account_id));
                rp(steamLookup(JSON.stringify(steamIds)))
                    .then(function (steamData) {
                        steamData.forEach(steamPlayer => (playerNames.push(steamPlayer.personaname)));

                        template = 'C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/templates/dungeon_ranks_template.png';
                        Jimp.read(template)
                            .then((loadedImage) => {
                                fonts.forEach(font => jimpFonts.push(Jimp.loadFont(font)));
                                Promise.all(jimpFonts).then((fonts) => {
                                        return Promise.all(jimpFonts);
                                    }).then((fonts) => {
                                        loadedImage.print( //prints dungeon name onto template image
                                            fonts[0],
                                            15,
                                            33, {
                                                text: formatDungeonName(dungeonName),
                                                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                                            },
                                            640,
                                            400
                                        );
                                        loadedImage.print( //prints dungeon name onto template image
                                            fonts[1],
                                            1,
                                            273, { //old y = 130
                                                text: `${dungTime.toString()} secs`,
                                                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                                            },
                                            640,
                                            400
                                        );
                                        loadedImage.write('C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/templates/templatenew.png', () => {

                                            images.push('C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/templates/templatenew.png');
                                            highScore.Players.forEach((player) => {
                                                let heroName = c.HERO_LIST[player.hero];
                                                images.push(`C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/portraits/${heroName}.png`);
                                            });
                                            images.forEach(image => jimps.push(Jimp.read(image)));
                                            Promise.all(jimps).then((data) => {
                                                return Promise.all(jimps);
                                            }).then((data) => {
                                                let xPosition = 0;
                                                let iu = 0;
                                                baseImage = data[0];
                                                heroImages = data.splice(1);
                                                const startXpos = (316.5 - ((96.25 * playerNames.length) / 2))
                                                heroImages.forEach((jimpPromises) => {
                                                    jimpPromises.resize(87, 50);
                                                    baseImage.composite(jimpPromises, (startXpos + xPosition), 160); // old y - 227
                                                    baseImage.print(
                                                        fonts[2],
                                                        startXpos + xPosition + ((87 - (playerNames[iu].length * 8.7)) / 2),
                                                        218, //old y = 285 
                                                        {
                                                            text: playerNames[iu].toString(),
                                                        });
                                                    iu++;
                                                    tester = 0;
                                                    xPosition += 100;
                                                });
                                                baseImage.write('C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/templates/templatenew.png', () => {
                                                    sendStats(message);
                                                });
                                            });
                                        });
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                    });
                            })
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    },
};