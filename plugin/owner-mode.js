let handler = async (m, { reply, command }) => {
    if (command === 'self') {
        global.selfmode = true
        reply('successfully changed the bot to self mode.')
    } else if (command === 'public') {
        global.selfmode = false
        reply('successfully changed the bot to public mode.')
    }
}

handler.command = /^(self|public)$/i
handler.tags = ['owner']
handler.help = ['self', 'public']
handler.owner = true

export default handler
    