const { Alpha, mode } = require('../lib/');

Alpha({
    pattern: 'vv ?(.*)',
    fromMe: mode,
    desc: 'Forward viewOnce message',
    type: 'misc',
}, async (message) => {
    /*if (!message.quoted || !message.quoted.message.viewOnceMessage) {
        return await message.send('Reply to a viewOnce message.');
    }*/
    
    const quotedMessageContent = message.reply_message.viewOnceMessage.message;
    
    // Define options for forwarding
    const options = {
        linkPreview: {
            title: "anti view-once",
        },
        viewOnce: false, // Ensure viewOnce is set to false
    };

    // Forward the message
    await message.forwardMessage(message.from, quotedMessageContent, options);
});
