import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { reply }) => {
    const pluginFolder = __dirname // Since this file is inside /plugin
    const files = fs.readdirSync(pluginFolder).filter(v => v.endsWith('.js'))
    
    let success = 0
    let failed = 0

    for (let file of files) {
        try {
            // Force a re-import by adding a timestamp to the URL
            await import(`./${file}?update=${Date.now()}`)
            success++
        } catch (e) {
            console.error(`Error loading ${file}:`, e)
            failed++
        }
    }

    reply(`✅ Plugins Refreshed!\n\nSuccessfully loaded: ${success}\nFailed: ${failed}`)
}

handler.command = /^(reload|refresh)$/i
handler.help = ['reload']
handler.tags = ['owner']
handler.owner = true

export default handler