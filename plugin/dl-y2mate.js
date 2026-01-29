import axios from 'axios';

/**
 * @name Y2MATE DOWNLOADER
 * @creator @coderxsa
 */

const handler = async (m, { sock, text }) => {
    if (!text) return m.reply('Example:\n.y2mate https://youtube.com/watch?v=xxxx');

    try {
        await m.reply('⏳ Processing, please wait...');

        // Helper function for API calls
        const fetchMedia = async (url, format) => {
            const apiUrl = `https://ytdl-new.vercel.app/api/ytdl?url=${encodeURIComponent(url)}&format=${format}`;
            const { data } = await axios.get(apiUrl);
            if (!data?.status) throw new Error('API Error');
            return data.result;
        };

        // Concurrent fetching for speed
        const [mp3, mp4] = await Promise.all([
            fetchMedia(text, 'mp3'),
            fetchMedia(text, 'mp4')
        ]);

        // Sending Audio
        await sock.sendMessage(m.chat, {
            audio: { url: mp3.download },
            mimetype: 'audio/mpeg',
            fileName: `${mp3.title}.mp3`
        }, { quoted: m });

        // Sending Video
        await sock.sendMessage(m.chat, {
            video: { url: mp4.download },
            mimetype: 'video/mp4',
            caption: `✅ *Title:* ${mp4.title}\n*Format:* MP4`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Error: Could not retrieve media. Ensure the link is valid.');
    }
};

// Layout Metadata
handler.help = ['y2mate'];
handler.tags = ['downloader'];
handler.command = /^(y2mate|ytmp4|ytmp3)$/i;
handler.group = true;

export default handler;