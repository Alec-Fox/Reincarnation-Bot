module.exports = {
	name: 'map',
	description: 'Shows the Reincarnation map.',
	usage: '',
	cooldown: 5,
	modOnly: false,
	execute(message) {
		message.delete();
		return message.channel.send({
			file: 'C:/Users/Alec PC/Documents/GitHub/Reincarnation/Reincarnation-Bot/src/data/images/infomatics/map.png',
		});
	},
};