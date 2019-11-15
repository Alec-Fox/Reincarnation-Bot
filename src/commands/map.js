const {
	constructEmbed,
} = require('../util/utilities.js');
const {
	MAP,
} = require('../util/constants.js');
module.exports = {
	name: 'map',
	description: 'Shows the Reincarnation map.',
	usage: '',
	cooldown: 5,
	modOnly: false,
	execute(message) {
		message.delete();
		const embed = constructEmbed('', '', MAP, null);
		return message.channel.send(embed);
	},
};