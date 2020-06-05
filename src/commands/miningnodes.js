module.exports = {
	name: 'mining',
	description: 'Shows the Mining nodes.',
	aliases: ['nodes', 'ore', 'ores', 'mine'],
	usage: '',
	cooldown: 5,
	modOnly: false,
	execute(message) {
		message.delete();
		return message.channel.send({
			file: 'C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/infomatics/mining.png',
		});
	},
};