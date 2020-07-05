const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

const service = new AssistantV2({
    version: "2019-02-28",
    authenticator: new IamAuthenticator({
        apikey: "L5Yw3SNC8VWqUjqsQ2whY_g7g5_dk-XPnD_Jy1GlFegc",
    }),
    url: "https://api.us-south.assistant.watson.cloud.ibm.com/instances/84e9e795-4d40-4200-ba01-1b05f0079aa4",
});

function crearSession() {
    return service.createSession({
        assistantId: "ccdfc3b0-41ef-4b9c-bb66-ef04260b7831",
    });
}

function sendMessage(input, id_session) {
    return service.message({
        assistantId: "ccdfc3b0-41ef-4b9c-bb66-ef04260b7831",
        sessionId: id_session,

        input: {
            message_type: "text",
            text: input,
        },
    });
}

function deleteSession(id_session) {
    return service.deleteSession({
        assistantId: "ccdfc3b0-41ef-4b9c-bb66-ef04260b7831",
        sessionId: id_session,
    });
}
module.exports = {
    crearSession,
    sendMessage,
    deleteSession,
};