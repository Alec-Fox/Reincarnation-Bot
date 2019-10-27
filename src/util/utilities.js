const fs = require('fs');
const {
    RichEmbed,
} = require('discord.js');
const {
    SUGGESTIONS_CHANNEL_ID,
    NEW_MEMBER_DATA,
} = require('./constants.js');
const memberdata = require('../data/memberdata.json');

/**
 * Returns an embed object.
 *
 * @param {string} title - Title for the embed.
 * @param {string} description - Description for the embed.
 * @param {string} image - image URL for the embed.
 * @param {Array} fields - Array of objects for the embed fields.
 */
exports.constructEmbed = (title, description, image, fields, thumbnail) => {
    const embed = new RichEmbed()
        .setColor(3021383)
        .setTitle(title)
        .setDescription(description)
        .setImage(image)
        .setThumbnail(thumbnail);

    if (fields) {
        for (let i = 0; i < fields.length; i++) {
            embed.addField(fields[i].name, fields[i].value, fields[i].inline);
        }
    }
    return embed;

};

/**
 * Returns a random number between min and max.
 *
 * @param {number} min - min range for random number (inclusive)
 * @param {number} max - max range of random number (exclusive)
 */
exports.getRand = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor((Math.random() * max) + min);
};

exports.maybeCreateMemberData = (userID) => {
    if (memberdata[userID]) return;
    memberdata[userID] = Object.assign({}, NEW_MEMBER_DATA);
    this.exportJson(memberdata, 'memberdata');
};

exports.formatDungeonName = (string) => {
    let dungeonName = string.replace('_', ' ');
   return dungeonName = dungeonName.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

};
/**
 * writes content to specified file.
 *
 * @param {object} content - Content to be exported to file.
 * @param {string} filename - Filename to save to.
 */
exports.exportJson = (content, fileName) => {
    fs.writeFileSync(`./src/data/${fileName}.json`, JSON.stringify(content));
};

/**
 * Returns a userID depending if there was a mentioned member or not
 *
 * @param {object} message - Discord message.
 * @param {object} specifiedMember - Discord mentioned member.
 */
exports.decideUser = (message, specifiedMember) => {
    const userID = (specifiedMember) ? specifiedMember.id : message.author.id;
    return userID;
};

exports.persistSuggestions = (message) => {
    if(message.channel.id !== SUGGESTIONS_CHANNEL_ID || message.author.bot) return;
    message.react('👍')
    .then(() => message.react('👎'))
    .then(() => message.react('❌'))
    .catch(() => console.error('One of the emojis failed to react.'));
    if(message.client.info.last_suggestion_message !== '') {
        try {
            message.client.info.last_suggestion_message.delete();
        }
        catch (error) {
            console.log(error);
        }
    }
    const embed = this.constructEmbed('Read pinned messages for instructions on how to post in the suggestions channel', '');
    message.channel.send(embed)
    .then((msg => message.client.info.last_suggestion_message = msg))
    .catch(error => {
        console.log(error);
    });
};