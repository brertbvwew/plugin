import { promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { sock, text, prefix, command, reply, participants }) => {
    // 1. Logic: Advanced group member management
    const groupMetadata = await sock.groupMetadata(m.chat)
    const participantList = groupMetadata.participants
    
    // Quick permission checks
    if (!groupMetadata) return reply('❌ This command only works in groups!')
    
    const senderId = m.sender || m.participant
    const senderParticipant = participantList.find(p => p.id === senderId)
    if (!senderParticipant?.admin) return reply('❌ Only group admins can use this command!')
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botParticipant = participantList.find(p => p.id === botId)
    if (!botParticipant?.admin) return reply('❌ I need to be a group admin to use this command!')
    
    // 2. Command arguments parsing
    const args = text.trim().toLowerCase().split(' ')
    
    switch(args[0]) {
        case 'list':
            return await showMemberList(participantList, reply)
            
        case 'stats':
            return await showGroupStats(participantList, reply)
            
        case 'backup':
            return await backupGroupData(groupMetadata, participantList, reply)
            
        case 'confirm':
            return await executeKickAll(sock, m, participantList, botId, reply)
            
        default:
            return await showConfirmation(prefix, command, participantList, reply)
    }
}

// Helper function to show member list
async function showMemberList(participants, reply) {
    let adminList = []
    let memberList = []
    
    participants.forEach(p => {
        const user = p.admin ? `👑 @${p.id.split('@')[0]}` : `👤 @${p.id.split('@')[0]}`
        if (p.admin) adminList.push(user)
        else memberList.push(user)
    })
    
    const message = 
        `📊 *Group Member List*\n\n` +
        `👑 *Admins (${adminList.length}):*\n${adminList.join('\n') || 'None'}\n\n` +
        `👤 *Members (${memberList.length}):*\n${memberList.join('\n') || 'None'}\n\n` +
        `📈 Total: ${participants.length} participants`
    
    await reply(message)
}

// Helper function to show group statistics
async function showGroupStats(participants, reply) {
    const adminCount = participants.filter(p => p.admin).length
    const nonAdminCount = participants.length - adminCount
    
    const message = 
        `📈 *Group Statistics*\n\n` +
        `• Total Participants: ${participants.length}\n` +
        `• Group Admins: ${adminCount}\n` +
        `• Regular Members: ${nonAdminCount}\n\n` +
        `⚠️ *Warning:* If you use kickall, ${nonAdminCount} members will be removed!`
    
    await reply(message)
}

// Helper function for confirmation
async function showConfirmation(prefix, command, participants, reply) {
    const adminCount = participants.filter(p => p.admin).length
    const nonAdminCount = participants.length - adminCount
    
    const message = 
        `🔧 *KickAll Command*\n\n` +
        `*Available Options:*\n` +
        `• ${prefix + command} list - Show all members\n` +
        `• ${prefix + command} stats - Show group statistics\n` +
        `• ${prefix + command} confirm - Execute mass removal\n\n` +
        `📊 *Quick Stats:*\n` +
        `- Total: ${participants.length}\n` +
        `- Admins: ${adminCount}\n` +
        `- To remove: ${nonAdminCount}\n\n` +
        `⚠️ *Use with caution!*`
    
    await reply(message)
}

// Helper function to backup group data
async function backupGroupData(groupMetadata, participants, reply) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupData = {
            group: {
                id: groupMetadata.id,
                subject: groupMetadata.subject,
                creation: groupMetadata.creation,
                owner: groupMetadata.owner
            },
            participants: participants.map(p => ({
                id: p.id,
                admin: p.admin,
                backupDate: new Date().toISOString()
            })),
            backupDate: new Date().toISOString()
        }
        
        const backupPath = path.join(process.cwd(), 'backups', `group-backup-${timestamp}.json`)
        await fs.mkdir(path.dirname(backupPath), { recursive: true })
        await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2))
        
        await reply(`✅ Backup created!\n📁 Path: ${backupPath}\n\n⚠️ This backup contains member information only.`)
        
    } catch (error) {
        console.error('Backup error:', error)
        await reply('❌ Failed to create backup!')
    }
}

// Main execution function
async function executeKickAll(sock, m, participants, botId, reply) {
    try {
        await reply('🚀 *Starting KickAll Process...*\n\n⏳ This will take some time. Please be patient.')
        
        let removed = 0
        let failed = 0
        const progressMsg = await reply(`⏳ Progress: 0/${participants.length}`)
        
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i]
            
            // Update progress
            if (i % 3 === 0) {
                try {
                    await sock.sendMessage(m.chat, {
                        text: `⏳ Progress: ${i}/${participants.length}\n✓ Removed: ${removed}\n✗ Failed: ${failed}`,
                        edit: progressMsg.key
                    }, { quoted: m })
                } catch (e) {}
            }
            
            // Skip admins and bot
            if (participant.admin || participant.id === botId) continue
            
            try {
                await sock.groupParticipantsUpdate(
                    m.chat,
                    [participant.id],
                    'remove'
                )
                removed++
                
                // Adaptive delay based on success rate
                const delay = failed > 3 ? 3000 : 1500
                await new Promise(resolve => setTimeout(resolve, delay))
                
            } catch (error) {
                console.error(`Failed to remove ${participant.id}:`, error.message)
                failed++
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }
        
        // Final report
        const report = 
            `✅ *KickAll Process Complete!*\n\n` +
            `📊 *Final Report:*\n` +
            `┌─────────────────────┐\n` +
            `│ ✓ Success: ${removed.toString().padEnd(4)} │\n` +
            `│ ✗ Failed:  ${failed.toString().padEnd(4)} │\n` +
            `│ 👑 Admins: ${participants.filter(p => p.admin).length.toString().padEnd(4)} │\n` +
            `└─────────────────────┘\n\n` +
            `⏰ Completed at: ${new Date().toLocaleTimeString()}\n` +
            `📅 Date: ${new Date().toLocaleDateString()}\n\n` +
            `⚠️ *Note:* Group admins and bot were preserved.`
        
        await reply(report)
        
    } catch (error) {
        console.error('KickAll execution error:', error)
        await reply('❌ An unexpected error occurred during the process!')
    }
}

// 3. Command Triggers (Regex)
handler.command = /^(kickall|purgegroup|resetgroup|massremove)$/i

// 4. Menu Metadata
handler.command = /^(kickall)$/i
handler.tags = ['group']
handler.help = ['kickall']
handler.group = true
handler.admin = true

export default handler