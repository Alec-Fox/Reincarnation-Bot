const {
    constructEmbed,
    exportJson,
} = require('../util/utilities.js');
const ms = require('ms');
module.exports = class MemberInfo {
    constructor(data) {
        Object.keys(data).forEach(key => this[key] = data[key]);
    }
    setSteamId(message, args) {
        this.steamid = args[0];
        const embed = constructEmbed(`${this.name}, your steam ID has been set: ${args[0]}`, '', null, null);
        exportJson(message.client.memberinfo, 'memberdata');
        return message.channel.send(embed);
    }
    giveWarning(message, reason) {
        this.warnings++;
        this.warningreasons = this.warningreasons.concat(`${message.member.displayName} issued a WARNING:\n*${reason}*  (${new Date().toLocaleString()})`);
        const embed = constructEmbed(`${this.name}, you received a warning.`, `Reason: ${reason}`, null, null);
        exportJson(message.client.memberinfo, 'memberdata');
        return message.channel.send(embed);
    }
    displayWarnings(message, member) {
        let reasons = '';
        let n = 1;
        this.warningreasons.forEach(function(reason) {
            reasons += `**[${n++}]** ${reason}\n`;
        });
        const embedFields = [];
        embedFields.push({
            name: 'Times muted:',
            value: `${this.mutecount}`,
            img: null,
            inline: false,
        });
        let muteHistoryDisplay = this.mutehistory.toString();
        muteHistoryDisplay = muteHistoryDisplay.replace(/,/g, '\n');
        embedFields.push({
            name: 'Mute History:',
            value: `${muteHistoryDisplay}`,
            img: null,
            inline: false,
        });
        const embed = constructEmbed(`${this.name}'s Warnings (${this.warnings}):`, reasons, null, embedFields, member.user.displayAvatarURL);
        embed.setFooter(`Steam ID: ${this.steamid}`);
        exportJson(message.client.memberinfo, 'memberdata');
        return message.channel.send(embed);

    }
    async mute(message, specifiedMember, mutetime, reason) {
        this.mutecount++;
        this.mutehistory = this.mutehistory.concat(`**[${this.mutecount}]** ${message.member.displayName} issued a MUTE: \nDuration: ${ms(ms(mutetime))} - *${reason}* (${new Date().toLocaleString()})`);
        let muterole = message.guild.roles.find(role => role.name === 'muted');
        if (!muterole) {
            try {
                // eslint-disable-next-line require-atomic-updates
                muterole = await message.guild.createRole({
                    name: 'muted',
                    color: '#000000',
                    permissions: [],
                });
                // eslint-disable-next-line no-unused-vars
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    });
                });
                // eslint-disable-next-line brace-style
            } catch (e) {
                console.log(e.stack);
            }
        }
        await (specifiedMember.addRole(muterole.id));
        try {
            let embed = constructEmbed('', `<@${specifiedMember.id}> has been muted for ${ms(ms(mutetime))} for ${reason}`, null, null);
            message.channel.send(embed);

            setTimeout(function() {
                specifiedMember.removeRole(muterole.id);
                embed = constructEmbed('', `<@${specifiedMember.id}> has been unmuted.`, null, null);
                message.channel.send(embed);
            }, ms(mutetime));
        }
        catch(e) {
            console.log(e.stack);
        }
        exportJson(message.client.memberinfo, 'memberdata');
    }
};