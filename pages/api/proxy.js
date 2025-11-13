// Proxy simples para imagens externas — usado para contornar hotlink/referrer blocks
// Recebe query param `u` com a URL completa codificada.
export default async function handler(req, res) {
  const { u } = req.query

  if (!u) {
    res.status(400).json({ error: 'missing url parameter `u`' })
    return
  }

  let url
  try {
    url = decodeURIComponent(u)
  } catch (e) {
    res.status(400).json({ error: 'invalid url encoding' })
    return
  }

  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname || ''

    // whitelist mínima — ajustar conforme necessário
    const allowedHosts = ['alicdn.com', 'alicdn.com.cn', '1688.com', 'alicdn']
    if (!allowedHosts.some(h => hostname.includes(h))) {
      res.status(403).json({ error: 'domain not allowed' })
      return
    }

    const upstream = await fetch(url)
    if (!upstream.ok) {
      res.status(502).json({ error: 'upstream fetch failed', status: upstream.status })
      return
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await upstream.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.status(200).send(buffer)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}
