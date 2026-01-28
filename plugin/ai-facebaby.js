/**
 * Command Template by @CoderXSA
 * Facebaby generator command
 */

import axios from "axios"

let handler = async (m, { sock, text, prefix, command, reply }) => {
    // 1. Logic: Check input
    if (!text) 
        return reply(`❌ Usage: ${prefix + command} <gender> <url1,url2>\nExample: ${prefix + command} boy https://url1.com,https://url2.com`)

    let [gender, urls] = text.split(" ")

    if (!gender || !["boy", "girl"].includes(gender.toLowerCase()))
        return reply("❌ Please choose a gender: 'boy' or 'girl'.")

    if (!urls) 
        return reply("❌ Make sure you provide two valid image URLs separated by a comma.")

    let [url1, url2] = urls.split(",").map(v => v.trim())

    if (!url1 || !url2)
        return reply("❌ You must enter two valid URLs, separated by a comma.")

    const apiKey = "FanzOffc"
    let attempt = 0
    const maxAttempts = 20
    let errorLogs = []

    await reply("⌛ Creating your baby... 😂👶")

    // 2. Action: Call API and retry if fails
    while (attempt < maxAttempts) {
        attempt++
        try {
            const { data } = await axios.get("https://api.fanzoffc.eu.org/api/facebaby", {
                params: {
                    bapak: url1,
                    emak: url2,
                    gender,
                    apikey: apiKey
                }
            })

            if (data.status && data.resultImageUrl) {
                await sock.sendMessage(m.chat, {
                    image: { url: data.resultImageUrl },
                    mimetype: "image/jpeg"
                }, { quoted: m })
                return
            } else {
                throw new Error(data.message || "Failed to generate baby image.")
            }
        } catch (err) {
            errorLogs.push(`Attempt ${attempt}: ${err.message}`)
            console.error(`Error on attempt ${attempt}:`, err)
            if (attempt === maxAttempts) {
                reply("❌ An error occurred after multiple attempts. Please try again later.")
                console.log("Error logs:", errorLogs)
            }
        }
    }
}

handler.command = /^(facebaby)$/i
handler.tags = ['ai'] 
handler.help = ['facebaby <gender> <url1,url2>']

// 5. Requirements (True/False)
handler.group = false 
handler.admin = false
handler.owner = false 
handler.premium = false 
handler.private = false 

export default handler
