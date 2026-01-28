let handler = async (m, { conn, text }) => {
  m.reply('Hello World!')
}

handler.command = ['tools-id']
handler.group = false   
handler.admin = false   
handler.owner = false   
handler.premium = false 
handler.private = false 

export default handler