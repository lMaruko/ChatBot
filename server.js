var express = require("express");
var {
    FB,
    Text,
    Typing,
    Image,
    QuickReplies,
    QuickRepliesOption,
} = require("adathink-sdk-bot");
var app = express();

const {
    crearSession,
    sendMessage,
    deleteSession,
} = require("./controller/app");

app.use(express.json());

FB.config({
    TOKEN_FACEBOOK: "EAADs2bj3R0wBAE7aAZA1IFKe81ZBpKPZBbLwy92AzrFbzuZAo7ZBDjF0ZBH0Dww6tZBvZBD35ZBVvTwi8SaMTagJd7LFsdAsfNFtiXyc8ZCPj20fwpNkQjjmFCDvfV0KoOgKZCepVGoqVO7DhHT4ttlDBwIMSSZBG26ZAw3KSrBjiF9HtEQZDZD",
    KEY_FACEBOOK: "petshop",
});

app.get("/", FB.checkWebhook);

const user = {};

app.post("/", async function(req, res) {
    res.sendStatus(200);

    var FBTools = new FB(req.body);

    let id = FBTools.getId();
    let session_id;

    try {
        if (user[id]) {
            session_id = user[id];
        } else {
            let session = await crearSession();
            session_id = session.result.session_id;
            user[id] = session_id;
        }

        //Obtien el mensaje de texto del usuario
        console.log(FBTools.getMessage());
        let message = FBTools.getMessage();

        let result = await sendMessage(message, session_id);

        let messages_watson = result.result.output.generic;

        messages_watson.forEach(function(item) {
            switch (item.response_type) {
                case "text":
                    FBTools.sendDirect(new Typing());
                    FBTools.addResponse(new Text(item.text));
                    break;
                case "image":
                    FBTools.sendDirect(new Typing());
                    FBTools.addResponse(new Image(item.source));
                    break;
                case "option":
                    let quick_replies = new QuickReplies(item.title);
                    item.options.forEach(function(el) {
                        let label = el.label;
                        let value = el.value.input.text;

                        let opc = new QuickRepliesOption.QuickRepliesOption(
                            QuickRepliesOption.TYPE_TEXT,
                            label,
                            value
                        );
                        quick_replies.addOption(opc);
                    });
                    FBTools.addResponse(quick_replies);
                    break;
            }
        });

        let response_send = await FBTools.sendResponse();
        // await deleteSession(session_id);
    } catch (err) {
        console.log(err);
    }
});

app.listen(80, function() {
    console.log("SERVER ON ");
});