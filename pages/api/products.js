import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    // Ler o JSON a partir da pasta `public` do Next.js para quando hospedado
    const dataPath = path.join(process.cwd(), 'public', 'produtos_extraidos.json')
    const raw = fs.readFileSync(dataPath, 'utf-8')
    const produtos = JSON.parse(raw)
    res.status(200).json({ produtos })
  } catch (err) {
    res.status(500).json({ error: 'Não foi possível ler o arquivo de produtos', details: String(err) })
  }
}
