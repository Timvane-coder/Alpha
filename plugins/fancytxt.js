const { Alpha } = require("../lib");

Alpha(
  {
    pattern: "button",
    fromMe: true,
    desc: "send a button message",
    usage: "#button",
    type: "message",
  },
  async (message, match, m) => {
    let data = {
      button: [{ type: "reply", params: { label: "Button Text", id: ".menu" } }],
      body: { displayText: "Your menu text here" },
      footer: { buttonText: "Button Text", id: ".menu" }
    };
    const { createInteractiveMessage } = require("../lib/utils")
    const interactiveMessage = await createInteractiveMessage(data);
    return await message.client.sendMessage(interactiveMessage);
  }
);
