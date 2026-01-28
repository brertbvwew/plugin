/**
 * Command: Generate Deline Image (Axios version)
 */

import axios from 'axios';

let handler = async (m, { sock, text, prefix, command, reply }) => {
    // 1. Check for text input
    if (!text) return reply(`❌ Usage: ${prefix + command} <name>\nExample: ${prefix + command} Agas`)

    try {
        // 2. Construct API URL
        const encodedText = encodeURIComponent(text)
        const apiUrl = `https://api.deline.web.id/maker/qc?text=${encodedText}&color=white&avatar=https%3A%2F%2Fapi.deline.web.id%2FEu3BVf3K4x.jpg&nama=${encodedText}`

        // 3. Fetch image with axios
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data)

        // 4. Send image
        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `✅ Here's your Deline image: ${text}`
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        await reply(`❌ Failed to generate image.`)
    }
}

// 5. Command triggers
handler.command = /^(deline|delineimg|qc)$/i 

// 6. Menu metadata
handler.tags = ['maker']
handler.help = ['deline <text>']

// 7. Requirements
handler.group = false
handler.admin = false
handler.owner = false
handler.premium = false
handler.private = false

export default handler
