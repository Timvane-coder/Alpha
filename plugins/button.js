const { alpha, isPrivate } = require("../lib");

alpha(
  {
    pattern: "button",
    fromMe: true,
    desc: "send a button message",
    usage: "#button",
    type: "message",
  },
  async (message, match, m) => {
    let data = {
      jid: message.jid,
      button: [
        {
          type: "list",
          params: {
            title: "Button 1",
            sections: [
              {
                title: "Button 1",
                rows: [
                  {
                    header: "title",
                    title: "Button 1",
                    description: "Description 1",
                    id: "#menu",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "reply",
          params: {
            display_text: "MENU",
            id: "#menu",
          },
        },
        {
          type: "url",
          params: {
            display_text: "Neeraj-x0",
            url: "https://www.mediafire.com/file/i5zexdry1qnz250/Avatar_3.mp4/file",
            merchant_url: "https://www.mediafire.com/file/i5zexdry1qnz250/Avatar_3.mp4/file/",
          },
        },
        {
          type: "address",
          params: {
            display_text: "Address",
            id: "message",
          },
        },
        {
          type: "location",
          params: {},
        },
        {
          type: "copy",
          params: {
            display_text: "copy",
            id: "123456789",
            copy_code: "https://gist.github.com/Primi373-creator/13cb4af738701cf8a9f9e74223164ff3",
          },
        },
        {
          type: "call",
          params: {
            display_text: "Call",
            phone_number: "123456789",
          },
        },
      ],
      header: {
        title: "alpha",
        subtitle: "WhatsApp Bot",
        hasMediaAttachment: false,
      },
      footer: {
        text: "Interactive Native Flow Message",
      },
      body: {
        text: "Interactive Message",
      },
    };
    return await message.sendMessage(message.jid, data, {}, "interactive");
  },
);
