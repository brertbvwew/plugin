import axios from 'axios'

let handler = async (m, { sock, text, prefix, command, reply }) => {
    if (!text) return reply(`❌ Usage: ${prefix + command} <song name>\nExample: ${prefix + command} kill yourself 3`)

    await reply(global.mess.wait)

    try {
        const response = await axios.get(`https://api.deline.web.id/downloader/ytplay?q=${encodeURIComponent(text)}`)
        const data = response.data
        if (!data.status) return reply(`❌ Video not found.`)
        const { title, thumbnail, dlink } = data.result
        const { size, ext } = data.result.pick
        let caption = `🎵 *YOUTUBE PLAY*\n\n`
        caption += `📝 *Title:* ${title}\n`
        caption += `⚖️ *Size:* ${size}\n`
        caption += `📦 *Extension:* ${ext}\n\n`
        caption += `_Sending as document..._`

        await sock.sendMessage(m.key.remoteJid, {
            document: { url: dlink },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: caption,
            jpegThumbnail: (await axios.get(thumbnail, { responseType: 'arraybuffer' })).data
        }, { quoted: m })

    } catch (e) {
        reply(`❌ Error: ${e.message}`)
    }
}

handler.help = ['play <song>']
handler.tags = ['downloader']
handler.command = /^(play|ytplay)$/i

export default handler