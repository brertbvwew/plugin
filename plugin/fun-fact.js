/**
 * Command Template by @CoderXSA
 * Optimized for ESM - Axios Version
 */

import axios from 'axios'

let handler = async (m, { sock, reply }) => {
    try {
        // 1. Logic: Fetch data from the PopCat Fact API
        const { data } = await axios.get('https://api.popcat.xyz/v2/fact')

        // 2. Action: Extracting the fact from the message object
        const fact = data.message.fact

        await reply(`🧠 *Random Fact* 🧠\n\n${fact}`)

    } catch (e) {
        console.error(e)
        reply('❌ Failed to retrieve a fact. The library might be closed!')
    }
}

// 3. Command Triggers (Regex)
handler.command = /^(fact|randomfact)$/i 

// 4. Menu Metadata
handler.tags = ['fun'] 
handler.help = ['fact'] 

// 5. Requirements (True/False)
handler.group = true 


export default handler