import useSWR from 'swr'
import Image from 'next/image'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function Home() {
  const { data, error } = useSWR('/api/products', fetcher)

  if (error) return <div>Erro ao carregar produtos</div>
  if (!data) return <div>Carregando...</div>

  const produtos = data.produtos || []

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>Produtos extraídos</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:20}}>
        {produtos.map((p, idx) => (
          <div key={idx} style={{border:'1px solid #ddd',borderRadius:6,padding:12}}>
            {p.imagem && p.imagem !== 'N/A' ? (
              // Carrega via proxy para contornar hotlink/referrer blocking em hosts externos
              <img src={`/api/proxy?u=${encodeURIComponent(p.imagem)}`} alt={p.nome || ''} style={{width:'100%',height:180,objectFit:'cover',borderRadius:4}} />
            ) : (
              <div style={{width:'100%',height:180,background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center'}}>Sem imagem</div>
            )}
            <h3 style={{fontSize:16,margin:'8px 0'}}>{p.nome_pt || p.nome}</h3>
            <p style={{margin:0,color:'#666'}}>Preço: {p.preco_cny ? ('¥' + p.preco_cny) : 'N/A'} {p.preco_brl ? (' → R$' + p.preco_brl) : ''}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
