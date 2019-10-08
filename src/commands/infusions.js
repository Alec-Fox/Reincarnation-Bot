const {
	constructEmbed,
} = require('../util/utilities.js');
const {
	INFUSIONS,
} = require('../util/constants.js');
module.exports = {
	name: 'infusions',
	description: 'Shows the Infusions for cooking.',
	aliases: ['infusion'],
	usage: '',
	cooldown: 5,
	execute(message) {
		message.delete();
		const embed = constructEmbed('', '', INFUSIONS, null);
		return message.channel.send(embed);
	},
};