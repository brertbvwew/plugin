
let handler = async (m, { sock, prefix, command, reply }) => {

    // 1. Ensure it's a group
    if (!m.isGroup) return reply('❌ This command works in groups only!')

    // 2. Try fetching pending requests
    let pending = await sock.groupRequestParticipantsList(m.chat)

    if (!pending.length) {
        return reply('✅ No pending members to accept!')
    }

    // 3. Accept all pending members
    for (let user of pending) {
        await sock.groupRequestParticipantsUpdate(
            m.chat,
            [user.id],
            "approve"
        )
    }

    // 4. Confirmation
    reply(`✅ Accepted ${pending.length} new member(s) successfully!`)
}

// 5. Command Triggers
handler.command = /^(accept|acceptmembers|approve)$/i

// 6. Menu Metadata
handler.tags = ['group']
handler.help = ['accept']

// 7. Requirements
handler.group = true
handler.admin = true  

export default handler
