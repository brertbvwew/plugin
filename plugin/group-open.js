let handler = async (m, { sock, command }) => {
    const isClose = command === 'close'
    await sock.groupSettingUpdate(m.key.remoteJid, isClose ? 'announcement' : 'not_announcement')
    
    m.reply(`Successfully ${isClose ? 'closed' : 'opened'} the group!`)
}

handler.command = /^(open|close)$/i
handler.tags = ['group']
handler.help = ['open', 'close']
handler.group = true
handler.admin = true

export default handler