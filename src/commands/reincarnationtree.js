module.exports = {
	name: 'reincarnations',
	description: 'Shows the Reincarnation tree.',
	aliases: ['reincarnation', 'tree'],
	usage: '',
	cooldown: 5,
	modOnly: false,
	execute(message) {
		message.delete();
		return message.channel.send({
			file: 'C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/infomatics/reincarnations.png',
		});
	},
};