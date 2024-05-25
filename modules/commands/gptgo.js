const axios = require('axios');

module.exports.config = {
    name: "asking",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "This command automatically answers your question if it ends with a question mark.",
    usePrefix: true,
    commandCategory: "other",
    usages: "",
    cooldowns: 10
};

async function getUserNames(api, uid) {
    const user = await api.getUserInfo(uid);
    return Object.values(user).map(u => u.name);
}

module.exports.handleEvent = async function ({ api, event }) {
    if (event.body !== null && event.isGroup && event.body.endsWith("?")) {
        try {
            const content = encodeURIComponent(event.body);
            const id = event.senderID;
            const apiUrl = `https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/gptconvo?ask=${content}&id=${id}`;

            const response = await axios.get(apiUrl);
            const { response: result } = response.data;

            const userNames = await getUserNames(api, event.senderID);

            const responseMessage = `${result}\n\n👤 Question Asked by: ${userNames.join(', ')}`;

            api.sendMessage(responseMessage, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    }
};

module.exports.run = async function ({ api, event }) {
    api.sendMessage("This command automatically responds if your message ends with a question mark.", event.threadID);
};
