
    let handler = async (m, { sock, text, prefix, command, reply }) => {
      try {
          let groupMetadata = await sock.groupMetadata(m.chat)
              let admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id.split('@')[0])
                  reply(`📝 Group Admins:\n${admins.join('\n')}`)
                    } catch (e) {
                        reply('❌ Error fetching admins')
                            console.error(e)
                              }
                              }

                              handler.command = /^(checkadmins|admins|groupadmins)$/i
                              handler.tags = ['group']
                              handler.help = ['checkadmins']
                              handler.group = true
                              handler.admin = false
                              handler.owner = false
                              handler.premium = false
                              handler.private = false

                              export default handler
    

