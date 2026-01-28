/**
 * Command Template by @CoderXSA
 * Travel Assistant Copilot AI
 */

import axios from "axios"

let handler = async (m, { sock, reply, text, prefix, command }) => {
    // 1. Logic: Check input
    if (!text) 
        return reply(`❌ Usage: ${prefix + command} <question>\nExample: ${prefix + command} How can I visit Padang Pariaman?`)

    // 2. Action: Call API
    try {
        const { data } = await axios.get("https://itzpire.com/ai/copilot2trip", {
            params: { q: text }
        })

        const messageContent = {
            text: `🌍 *Travel Assistant Copilot AI*\n\n${data.result}`
        }

        await sock.sendMessage(m.chat, messageContent, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("❌ An error occurred while processing your request.")
    }
}

handler.command = /^(copilot2trip|copilot)$/i
handler.tags = ['ai']
handler.help = ['copilot2trip <question>', 'copilot <question>'] 

// 5. Requirements (True/False)
handler.group = true
handler.admin = false
handler.owner = false 
handler.premium = false 
handler.private = false 

export default handler
