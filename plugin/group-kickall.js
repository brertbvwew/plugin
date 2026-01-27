let handler = async (m, { sock, text, command, participants }) => {
    if (command === 'kickall') {
        let users = participants.map(u => u.id).filter(v => v !== sock.user.jid)
        for (let user of users) {
            await sock.groupParticipantsUpdate(m.chat, [user], 'remove')
        }
        return m.reply('Clean sweep complete. Everyone has been removed.')
    }
    let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
                || (text ? text.replace(/[@ ]/g, '') + '@s.whatsapp.net' : null)

    if (!users) return m.reply('Tag or type the number of the user')

    if (command === 'kick') {
        await sock.groupParticipantsUpdate(m.chat, [users], 'remove')
        m.reply('Removed.')
    } else if (command === 'add') {
        await sock.groupParticipantsUpdate(m.chat, [users], 'add')
        m.reply('Added.')
    }
}

handler.command = /^(kick|add|kickall)$/i
handler.tags = ['group']
handler.help = ['kick @user', 'add 27xxx', 'kickall']
handler.group = true
handler.admin = true
handler.botAdmin = true 

export default handler