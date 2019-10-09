const {
	constructEmbed,
} = require('../util/utilities.js');
module.exports = {
	name: 'warn',
	description: 'Gives a member a warning [Mod use only]',
	usage: '[@member] [warning reason]',
	cooldown: 5,
	execute(message, args) {
		message.delete();
		const specifiedMember = message.mentions.members.first();
		if (!specifiedMember || args[0] != specifiedMember) return message.reply('You did not submit a valid member to warn.');
		if (args.length < 2) {
			const embed = constructEmbed('You did not provide a reason for the warning.', '', null, null);
			return message.channel.send(embed);
		}
		const reasonsArray = args.splice(1, args.length);
		let reasons = reasonsArray.toString();
		reasons = reasons.replace(/,/g, ' ');
		return message.client.memberinfo[specifiedMember.id].giveWarning(message, reasons);
	},
};