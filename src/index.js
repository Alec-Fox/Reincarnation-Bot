require('dotenv').config();
const {
    readdirSync,
} = require('fs');
const {
    join,
} = require('path');
const AlecClient = require('./struct/Client');
const {
    Collection,
} = require('discord.js');
const client = new AlecClient({
    token: process.env.DISCORD_TOKEN,
    prefix: process.env.DISCORD_PREFIX,
});
const u = require('./util/utilities.js');
const {
    maybeCreateMemberData,
} = require('./util/utilities.js');
const memberdata = require('./data/memberdata.json');
const MembersInfo = require('./struct/MembersInfo.js');

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(join(__dirname, 'commands', `${file}`));
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`${client.user.username} READY!`);
    // eslint-disable-next-line no-unused-vars
    function generateAllMembersInfo(member, memberId, allMembersInfoMap) {
        maybeCreateMemberData(memberId);
        Object.assign(client.memberinfo, { [memberId]: new MembersInfo(memberdata[memberId]) });
        client.memberinfo[memberId].name = member.displayName;
    }
    const guild = client.guilds.first();
    const allMembersInfoMap = guild.members;
    allMembersInfoMap.forEach(generateAllMembersInfo);
});


client.on('message', message => {
    u.persistSuggestions(message);
    if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.args && !args.length) {
        message.delete();
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) reply += `\nThe proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``;
        return message.channel.send(reply);
    }
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            message.delete();
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${client.config.prefix}${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});
client.on('error', (error) => {
    console.error(error);

});
client.on('disconnect', (error) => {
    console.error(error);
    client.login(client.config.token);

});

client.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
client.login(client.config.token);