/**
 * Command Template by @CoderXSA
 * Optimized for ESM - Axios Version
 */

import axios from 'axios'

let handler = async (m, { sock, reply }) => {
    try {
        // 1. Logic: Fetch data from the API using axios
        const { data } = await axios.get('https://api.popcat.xyz/v2/pickuplines')

        // 2. Action: Extracting the string from the message object
        const pickupline = data.message.pickupline

        await reply(`💘 *Pickup Line* 💘\n\n${pickupline}`)

    } catch (e) {
        // Handling specific axios errors or general failures
        console.error(e)
        reply('❌ Failed to fetch a pickup line. Please try again later.')
    }
}

// 3. Command Triggers (Regex)
handler.command = /^(pickupline|pickup|line)$/i 

// 4. Menu Metadata
handler.tags = ['fun'] 
handler.help = ['pickupline'] 

// 5. Requirements (True/False)
handler.group = true

export default handler