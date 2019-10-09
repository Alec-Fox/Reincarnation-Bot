const {
	constructEmbed,
} = require('../util/utilities.js');
module.exports = {
	name: 'mute',
	description: 'Mutes a member [Mod use only]',
	usage: '[@member] [duration] [reason]',
	cooldown: 5,
	execute(message, args) {
		message.delete();
		const specifiedMember = message.mentions.members.first();
		if (!specifiedMember || args[0] != specifiedMember) return message.reply('You did not submit a valid member to warn.');
		if (args.length < 2) {
			const embed = constructEmbed('You did not provide a duration for the mute.', '', null, null);
			return message.channel.send(embed);
		}
		if (args.length < 3) {
			const embed = constructEmbed('You did not provide a reason for the mute.', '', null, null);
			return message.channel.send(embed);
		}
		if(specifiedMember.hasPermission('MANAGE_MESSAGES')) return message.reply('Can\'t mute this person.');
		const reasonsArray = args.splice(2, args.length);
		let reasons = reasonsArray.toString();
		reasons = reasons.replace(/,/g, ' ');
		message.client.memberinfo[specifiedMember.id].mute(message, specifiedMember, args[1], reasons);
	},
};