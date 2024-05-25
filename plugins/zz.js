const { connect } = require("pm2");
const { Alpha, PREFIX } = require("../lib");

Alpha(
  {
    pattern: "btn",
    fromMe: true,
    desc: "send a button message",
    usage: "#button",
    type: "message",
  },
  async ( m) => {
    let data = {
      jid: conn.user.jid,
      button: [
        {
          type: "reply",
          params: {
            display_text: `${PREFIX}menu`, // No need to include PREFIX here
            id: `menu`, // Include PREFIX here if needed
          },
        },
      ],
      header: {
        title: "X-Asena",
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
 return await m.send(data, {}, 'interactive');
  }
);