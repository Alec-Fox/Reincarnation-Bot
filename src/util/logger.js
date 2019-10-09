const {
    LOGGER_CHANNEL_ID,
} = require('./constants.js');
// eslint-disable-next-line no-empty-function
function Logger() {}
Logger.prototype.info = function(message, text) {

    message.client.channels.get(LOGGER_CHANNEL_ID).send(new Date().toLocaleString() + ': ' + text);
};
module.exports = new Logger();