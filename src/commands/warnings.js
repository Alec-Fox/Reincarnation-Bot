module.exports = {
	name: 'warnings',
	description: 'Displays the warnings for a member.',
	usage: '[@member]',
	cooldown: 5,
	execute(message, args) {
		message.delete();
		const specifiedMember = message.mentions.members.first();
		if (!specifiedMember || args[0] != specifiedMember) return message.reply('You did not submit a valid member to warn.');
		message.client.memberinfo[specifiedMember.id].displayWarnings(message);
	},
};