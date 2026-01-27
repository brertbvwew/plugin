let handler = async (m, { sock }) => {
    const groupMetadata = await sock.groupMetadata(m.key.remoteJid)
    const participants = groupMetadata.participants
    const admins = participants.filter(p => p.admin !== null).length
    
    let info = `📌 *GROUP INFORMATION*\n\n`
    info += `📝 *Name:* ${groupMetadata.subject}\n`
    info += `🆔 *ID:* ${groupMetadata.id}\n`
    info += `👥 *Members:* ${participants.length}\n`
    info += `🛡️ *Admins:* ${admins}\n`
    info += `📅 *Created:* ${new Date(groupMetadata.creation * 1000).toDateString()}\n\n`
    info += `📜 *Description:* \n${groupMetadata.desc || 'No description'}`

    await sock.sendMessage(m.key.remoteJid, { text: info }, { quoted: m })
}

handler.command = /^(groupinfo|infogp|gc)$/i
handler.tags = ['group']
handler.help = ['groupinfo']
handler.group = true

export default handler