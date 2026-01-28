let handler = async (m, { sock }) => {
    const jid = m.key.remoteJid
    const groupMetadata = await sock.groupMetadata(jid)
    const participants = groupMetadata.participants
    const botId = sock.user.id.includes(':') 
        ? sock.user.id.split(':')[0] + '@s.whatsapp.net' 
        : sock.user.id
    const pips = [...global.owner, ...global.sudo].map(v => v + '@s.whatsapp.net')
    let users = participants
        .map(u => u.id)
        .filter(id => 
            id !== botId && 
            id !== groupMetadata.owner && 
            !pips.includes(id)
        )
    if (users.length === 0) return m.reply('No targets found.')
    m.reply(`Removing ${users.length} members.`)
    for (let user of users) {
        try {
            await sock.groupParticipantsUpdate(jid, [user], 'remove')
            await new Promise(resolve => setTimeout(resolve, 1000)) 
        } catch (e) {
            continue 
        }
    }
    return m.reply('Done.')
}

handler.help = ['kickall']
handler.tags = ['group']
handler.command = /^(kickall)$/i
handler.group = true
handler.admin = true

export default handler