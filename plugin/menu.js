import fs from 'fs'
import os from 'os'
import axios from 'axios'

let handler = async (m, { sock, prefix, isOwner, isPremium }) => {
    const uptime = process.uptime()
    const muptime = clockString(uptime * 1000)
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
    const imageBuffer = (await axios.get(global.thumbmenu, { responseType: 'arraybuffer' })).data
    const pluginFolder = './plugin'
    const files = fs.readdirSync(pluginFolder).filter(v => v.endsWith('.js'))

    let categories = {}
    let totalCommands = 0

    for (let file of files) {
        const module = await import(`./${file}?update=${Date.now()}`)
        const plugin = module.default
        if (!plugin || !plugin.help) continue
        let tag = plugin.tags ? plugin.tags[0].toUpperCase() : 'OTHER'
        if (!categories[tag]) categories[tag] = []
        if (Array.isArray(plugin.help)) {
            plugin.help.forEach(h => {categories[tag].push(h)
                totalCommands++
            })
        } else {
            categories[tag].push(plugin.help)
            totalCommands++
        }
    }

    let menuText = `*Hi, ${m.pushName}!*\n\n`
    menuText += `┌── *ɴᴇᴏ ᴀɪ*\n`
    menuText += `│ Uptime: ${muptime}\n`
    menuText += `│ Commands: ${totalCommands}\n`
    menuText += `│ RAM: ${freeMem}GB / ${totalMem}GB\n`
    menuText += `│ Role: ${isOwner ? 'Creator' : isPremium ? 'Premium' : 'Free'}\n`
    menuText += `└──\n\n`

    Object.keys(categories).sort().forEach(tag => {
        menuText += `┌──⊷ *${tag}*\n`
        let cmds = categories[tag].map(cmd => `\`${cmd}\``).join('  ')
        menuText += `│ ${cmds}\n`
        menuText += `└──────────────┈\n\n`
    })

    menuText += `_Type ${prefix}ping to test bot speed_`

    await sock.sendMessage(m.key.remoteJid, {
        text: menuText,
        contextInfo: {
            mentionedJid: [
                m.key.participant || m.key.remoteJid
            ],
            externalAdReply: {
                title: `${global.namebot}`,
                body: `ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ ᴄᴏᴅᴇʀxꜱᴀ`,
                thumbnail: imageBuffer,
                sourceUrl: 'https://github.com/coderxsa',
                mediaType: 1,
                renderLargerThumbnail: true
            }

        }
    }, { quoted: m })
}

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

handler.command = /^(menu|help|list)$/i
handler.tags = ['main']
handler.help = ['menu']

export default handler