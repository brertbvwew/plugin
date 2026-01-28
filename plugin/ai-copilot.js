import axios from "axios"

let handler = async (m, { sock, reply, text, prefix, command }) => {
  if (!text) {
      return reply(
            `*• Example:* ${prefix + command} How can I visit Padang Pariaman?`
                )
                  }

                    try {
                        const { data } = await axios.get(
                              "https://itzpire.com/ai/copilot2trip",
                                    {
                                            params: { q: text }
                                                  }
                                                      )

                                                          const messageContent = {
                                                                text: `🌍 *Travel Assistant Copilot AI*\n\n${data.result}`
                                                                    }

                                                                        await sock.sendMessage(m.chat, messageContent, { quoted: m })

                                                                          } catch (err) {
                                                                              console.error(err)
                                                                                  reply("❌ An error occurred while processing your request.")
                                                                                    }
                                                                                    }

                                                                                    handler.command = ["copilot2trip", "copilot"]
                                                                                    handler.help = ["copilot2trip", "copilot"]
                                                                                    handler.tags = ["ai"]
                                                                                

                                                                                    export default handler