const {
	constructEmbed,
} = require('../util/utilities.js');
const {
	REINCARNATIONS,
} = require('../util/constants.js');
module.exports = {
	name: 'reincarnations',
	description: 'Shows the Reincarnation tree.',
	aliases: ['reincarnation', 'tree'],
	usage: '',
	cooldown: 5,
	execute(message) {
		message.delete();
		const embed = constructEmbed('', '', REINCARNATIONS, null);
		return message.channel.send(embed);
	},
};