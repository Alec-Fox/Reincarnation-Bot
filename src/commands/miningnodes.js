const {
	constructEmbed,
} = require('../util/utilities.js');
const {
	MINING_NODES,
} = require('../util/constants.js');
module.exports = {
	name: 'mining',
	description: 'Shows the Mining nodes.',
	aliases: ['nodes', 'ore', 'ores', 'mine'],
	usage: '',
	cooldown: 5,
	execute(message) {
		message.delete();
		const embed = constructEmbed('', '', MINING_NODES, null);
		return message.channel.send(embed);
	},
};