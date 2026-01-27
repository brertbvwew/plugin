/**
 * Command Template by @CoderXSA
 * Optimized for ESM - Axios Version
 */

import axios from 'axios'

let handler = async (m, { sock, reply }) => {
    try {
        // 1. Logic: Fetch data from the PopCat Joke API
        const { data } = await axios.get('https://api.popcat.xyz/v2/joke')

        // 2. Action: Extracting the joke from the message object
        const joke = data.message.joke

        await reply(`😂 *Joke Time* 😂\n\n${joke}`)

    } catch (e) {
        console.error(e)
        reply('❌ Failed to fetch a joke. Maybe the clown is on break?')
    }
}

// 3. Command Triggers (Regex)
handler.command = /^(joke|pun)$/i 

// 4. Menu Metadata
handler.tags = ['fun'] 
handler.help = ['joke'] 

// 5. Requirements (True/False)
handler.group = true

export default handler