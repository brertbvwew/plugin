/**
 *   *» Name :* — [ Y2MATE DOWNLOADER ] —
   *» Type :* Plugin - ESM
     *» Creator :* @coderxsa
     **/

     import axios from 'axios'

     async function handler(m, { sock, text }) {
       if (!text) return m.reply('Example:\n.y2mate https://youtube.com/watch?v=xxxx')

         try {
             m.reply('⏳ Processing, please wait...')

                 const fetchVideo = async (url, format) => {
                       const apiUrl = `https://ytdl-new.vercel.app/api/ytdl?url=${encodeURIComponent(url)}&format=${format}`
                             const res = await axios.get(apiUrl)
                                   const data = res.data

                                         if (!data || !data.status) throw new Error('Failed to fetch video')
                                               return {
                                                       title: data.result.title,
                                                               download: data.result.download,
                                                                       format: data.result.format,
                                                                               creator: data.creator,
                                                                                       id: data.result.id
                                                                                             }
                                                                                                 }

                                                                                                     // Download MP3 & MP4
                                                                                                         const mp3 = await fetchVideo(text, 'mp3')
                                                                                                             const mp4 = await fetchVideo(text, 'mp4')

                                                                                                                 // Send MP3
                                                                                                                     await sock.sendMessage(m.chat, {
                                                                                                                           audio: { url: mp3.download },
                                                                                                                                 mimetype: 'audio/mpeg',
                                                                                                                                       fileName: `${mp3.title}.mp3`
                                                                                                                                           }, { quoted: m })

                                                                                                                                               // Send MP4
                                                                                                                                                   await sock.sendMessage(m.chat, {
                                                                                                                                                         video: { url: mp4.download },
                                                                                                                                                               mimetype: 'video/mp4',
                                                                                                                                                                     caption: mp4.title
                                                                                                                                                                         }, { quoted: m })

                                                                                                                                                                           } catch (e) {
                                                                                                                                                                               console.error(e)
                                                                                                                                                                                   m.reply('❌ An error occurred while downloading the video')
                                                                                                                                                                                     }
                                                                                                                                                                                     }

                                                                                                                                                                                     handler.help = ['y2mate <url>']
                                                                                                                                                                                     handler.tags = ['downloader']
                                                                                                                                                                                     handler.command = /^y2mate$/i

                                                                                                                                                                                     handler.group = true 

                                                                                                                                                                                     export default handler
 */