let handler = async (m, { sock, text, command }) => {
    let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
                || (text ? text.replace(/[@ ]/g, '') + '@s.whatsapp.net' : null)

    if (!users) return m.reply('Tag or type the number of the user')

    if (command === 'kick') {
        await sock.groupParticipantsUpdate(m.key.remoteJid, [users], 'remove')
        m.reply('User removed successfully.')
    } else if (command === 'add') {
        await sock.groupParticipantsUpdate(m.key.remoteJid, [users], 'add')
        m.reply('User added successfully.')
    }
}

handler.command = /^(kick|add)$/i
handler.tags = ['group']
handler.help = ['kick @user', 'add 27xxx']
handler.group = true
handler.admin = true

export default handler