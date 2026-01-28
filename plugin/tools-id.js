
let handler = async (m, { sock, text, prefix, command, reply }) => {
    const sender = m.key.participant || m.key.remoteJid
    const userId = sender.split('@')[0]
    await reply(`*Your ID:* ${userId}\n\nCopy this number and put it in your config.js owner array.`)
}

handler.command = /^(getid)$/i 
handler.tags = ['tools']
handler.help = ['getid']

// 5. Requirements (True/False)
handler.group = false   
handler.admin = false   
handler.owner = false 
handler.premium = false 
handler.private = false 

export default handler