const {
	MOD_ROLE_ID,
} = require('../util/constants.js');
module.exports = {
	name: 'warnings',
	description: 'Displays the warnings for a member.',
	usage: '',
	cooldown: 5,
	modOnly: false,
	execute(message, args) {
		message.delete();
		if (!args[0]) {
			message.client.memberinfo[message.member.id].displayWarnings(message, message.member);
		}
		else {
			if(message.member.highestRole.comparePositionTo(message.guild.roles.find(role => role.id === MOD_ROLE_ID)) < 0) return message.reply('You are not authorized to look up other player\'s warnings.');
			const specifiedMember = message.mentions.members.first();
			if (!specifiedMember || args[0] != specifiedMember) return message.reply('You did not submit a valid member view warnings.');
			message.client.memberinfo[specifiedMember.id].displayWarnings(message, specifiedMember);
		}
	},
};