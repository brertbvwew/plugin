let handler = async (m, { text, usedPrefix, command }) => {
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    } else {
        who = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') + '@s.whatsapp.net') : m.chat
    }
    if (!who || who.length < 10) return m.reply(`*Format:* ${usedPrefix + command} @user or reply to their message.`)
    let number = who.split('@')[0]
    if (command === 'addsudo') {
        if (global.sudo.includes(number)) return m.reply(`@${number} is already in the Sudo list.`, null, { mentions: [who] })
        global.sudo.push(number)
        m.reply(`added @${number} to Sudo.`, null, { mentions: [who] })
    } 
    if (command === 'delsudo') {
        if (!global.sudo.includes(number)) return m.reply(`@${number} is not a Sudo user.`, null, { mentions: [who] })
        global.sudo = global.sudo.filter(v => v !== number)
        m.reply(`❌ Removed @${number} from Sudo.`, null, { mentions: [who] })
    }
}

handler.help = ['addsudo', 'delsudo']
handler.tags = ['owner']
handler.command = /^(addsudo|delsudo)$/i
handler.owner = true 

export default handler