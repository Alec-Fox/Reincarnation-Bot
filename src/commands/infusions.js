module.exports = {
	name: 'infusions',
	description: 'Shows the Infusions for cooking.',
	aliases: ['infusion'],
	usage: '',
	cooldown: 5,
	modOnly: false,
	execute(message) {
		message.delete();
		return message.channel.send({
			file: 'C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/infomatics/infusions.png',
		});
	},
};