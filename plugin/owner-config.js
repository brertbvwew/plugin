import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

let handler = async (m, { text, command, reply }) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const configPath = path.join(__dirname, '../config.js')
    if (command === 'sudolist' || command === 'getsudo') {
        const sudoList = global.sudo.filter(v => v !== "" && v !== null)
        if (sudoList.length === 0) return reply("No sudo users found in config.")
        let txt = `SUDO PRIVILEGE LIST\n\n`
        sudoList.forEach((num, i) => {
            txt += `${i + 1}. @${num}\n`
        })
        return reply(txt, null, { mentions: sudoList.map(v => v + '@s.whatsapp.net') })
    }
    if (command === 'listconfig' || command === 'listvar') {
        try {
            let configContent = fs.readFileSync(configPath, 'utf8')
            const matches = [...configContent.matchAll(/global\.(\w+)\s*=\s*(.*)/g)]
            let txt = `SYSTEM CONFIGURATION\n\n`
            matches.forEach(([_, key, value], index) => {
                let val = value.replace(/,$/, '').trim()
                txt += `${index + 1}. ${key}: ${val}\n`
            })
            return reply(txt)
        } catch (err) {
            return reply(`Error reading config: ${err.message}`)
        }
    }

    // --- COMMAND: UPDATE CONFIG ---
    if (command === 'setconfig' || command === 'cfg') {
        if (!text.includes('|')) return reply(`Usage: .${command} key | value\nExample: .setconfig namebot | "Neo-Bot"`)
        let [key, ...val] = text.split('|')
        key = key.trim()
        let value = val.join('|').trim()
        try {
            let configContent = fs.readFileSync(configPath, 'utf8')
            if (!configContent.includes(`global.${key}`)) return reply(`Variable global.${key} not found.`)
            const regex = new RegExp(`global\\.${key}\\s*=\\s*.*`)
            let newContent = configContent.replace(regex, `global.${key} = ${value}`)
            fs.writeFileSync(configPath, newContent)
            reply(`Updated ${key} to: ${value}`)
        } catch (e) {
            reply(`Error: ${e.message}`)
        }
    }
}

handler.help = ['sudolist', 'listconfig', 'setconfig']
handler.tags = ['owner']
handler.command = /^(sudolist|getsudo|listconfig|listvar|setconfig|cfg)$/i
handler.owner = true 

export default handler