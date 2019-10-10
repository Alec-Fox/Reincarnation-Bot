module.exports = {
	name: 'warnings',
	description: 'Displays the warnings for a member.',
	usage: '[@member]',
	args: true,
	cooldown: 5,
	execute(message, args) {
		message.delete();
		const specifiedMember = message.mentions.members.first();
		if (!specifiedMember || args[0] != specifiedMember) return message.reply('You did not submit a valid member view warnings.');
		message.client.memberinfo[specifiedMember.id].displayWarnings(message, specifiedMember);
	},
};