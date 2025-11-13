import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const dataPath = path.join(process.cwd(), '..', 'produtos_extraidos.json')
    const raw = fs.readFileSync(dataPath, 'utf-8')
    const produtos = JSON.parse(raw)
    res.status(200).json({ produtos })
  } catch (err) {
    res.status(500).json({ error: 'Não foi possível ler o arquivo de produtos', details: String(err) })
  }
}
