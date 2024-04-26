const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "EDUCATIONAL",
    usePrefix: false,
    commandCategory: "other",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const id = event.senderID;

    const apiUrl = `https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/gptconvo?ask=${content}&id=${id}`;

    if (!content) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", event.threadID, event.messageID);

    try {
        const waitMessage = await api.sendMessage("Typing......", event.threadID);

        const response = await axios.get(apiUrl);
        const { response: result } = response.data;

        const userNames = await getUserNames(api, event.senderID);
        const responseMessage = `${result}\n\n👤 𝖰𝗎𝖾𝗌𝗍𝗂𝗈𝗇 𝖠𝗌𝗄𝖾𝖽 𝖻𝗒: ${userNames.join(', ')}`;

        api.editMessage(responseMessage, waitMessage.messageID, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

async function getUserNames(api, uid) {
    const user = await api.getUserInfo(uid);
    return Object.values(user).map(u => u.name);
}
