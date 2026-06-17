export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };
    try {
      const resp = await fetch('https://www.contabeis.com.br/rss/', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const xml = await resp.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 6).map(m => {
        const get = (tag) => m[1].match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))?.[1]
                          || m[1].match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1] || '';
        const img = m[1].match(/url="([^"]+\.(jpg|png|webp))"/i)?.[1] || '';
        return { title: get('title'), link: get('link'), date: get('pubDate'), img };
      });
      return new Response(JSON.stringify(items), { headers: cors });
    } catch(e) {
      return new Response(JSON.stringify([]), { headers: cors });
    }
  }
}
