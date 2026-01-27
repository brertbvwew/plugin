let handler = async (m, { sock, text, participants }) => {
    let users = participants.map(u => u.id)
    let message = text ? text : 'No message provided'
    
    let menuText = `📢 *TAG ALL*\n\n`
    menuText += `💬 *Message:* ${message}\n\n`
    for (let u of users) {
        menuText += ` @${u.split('@')[0]}\n`
    }

    await sock.sendMessage(m.key.remoteJid, { 
        text: menuText, 
        mentions: users 
    }, { quoted: m })
}

handler.command = /^(tagall|everyone)$/i
handler.tags = ['group']
handler.help = ['tagall <message>']
handler.group = true
handler.admin = true

export default handler