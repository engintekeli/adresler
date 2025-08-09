'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Row = { name: string | null; shorturl: string | null; longurl: string | null; clicks: number | null; rank: number | null; };

export default function LogosTable(){
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState<number>(0);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'rank.asc'|'rank.desc'|'clicks.asc'|'clicks.desc'|'name.asc'|'name.desc'>('rank.asc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function parseSort(v:string){ const [col,dir] = v.split('.'); return {col, asc: dir === 'asc'}; }
  function rangeFor(p:number, pp:number){ const from=(p-1)*pp; return {from, to: from+pp-1}; }
  const maxPage = useMemo(() => Math.max(1, Math.ceil(count / perPage)), [count, perPage]);

  async function load(){
    setLoading(true); setError(null);
    const {col, asc} = parseSort(sort);
    const {from, to} = rangeFor(page, perPage);

    let rq = supabase.from(process.env.NEXT_PUBLIC_VIEW_NAME || 'public_logos').select('*', { count: 'exact' });
    if(q.trim()) rq = rq.ilike('name', `%${q.trim()}%`);
    rq = rq.order(col, { ascending: asc, nullsFirst: !asc }).range(from, to);

    const { data, count: c, error } = await rq;
    if(error){ setError(error.message); setRows([]); setCount(0); setLoading(false); return; }
    setRows(data as Row[]); setCount(c || 0); setLoading(false);
  }

  useEffect(() => { load(); }, [q, sort, page, perPage]);

  return (
    <section>
      <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:12}}>
        <input value={q} onChange={(e)=>{ setPage(1); setQ(e.target.value);}}
           placeholder="Ara: site adı..." style={{padding:8, border:'1px solid #ddd', borderRadius:8}}/>
        <select value={sort} onChange={(e)=>{ setPage(1); setSort(e.target.value as any); }}
           style={{padding:8, border:'1px solid #ddd', borderRadius:8}}>
          <option value="rank.asc">Sırala: rank ↑</option>
          <option value="rank.desc">Sırala: rank ↓</option>
          <option value="clicks.desc">Sırala: tıklama ↓</option>
          <option value="clicks.asc">Sırala: tıklama ↑</option>
          <option value="name.asc">Sırala: ad ↑</option>
          <option value="name.desc">Sırala: ad ↓</option>
        </select>
        <select value={perPage} onChange={(e)=>{ setPage(1); setPerPage(parseInt(e.target.value)); }}
           style={{padding:8, border:'1px solid #ddd', borderRadius:8}}>
          <option>25</option><option>50</option><option>100</option>
        </select>
        <button onClick={()=>load()} style={{padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff'}}>Yenile</button>
        <span style={{marginLeft:'auto', fontSize:12, color:'#666'}}>{loading ? 'Yükleniyor...' : `Toplam ${count}`}</span>
      </div>

      {error && <div style={{color:'#c00', marginBottom:8}}>Hata: {error}</div>}

      <table style={{width:'100%', borderCollapse:'collapse', background:'#fff', border:'1px solid #eee', borderRadius:10, overflow:'hidden'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', padding:10, borderBottom:'1px solid #f2f2f2'}}>#</th>
            <th style={{textAlign:'left', padding:10, borderBottom:'1px solid #f2f2f2'}}>Ad</th>
            <th style={{textAlign:'left', padding:10, borderBottom:'1px solid #f2f2f2'}}>Logo (short)</th>
            <th style={{textAlign:'left', padding:10, borderBottom:'1px solid #f2f2f2'}}>Uzun URL</th>
            <th style={{textAlign:'left', padding:10, borderBottom:'1px solid #f2f2f2'}}>Tıklama</th>
            <th style={{textAlign:'left', padding:10, borderBottom:'1px solid #f2f2f2'}}>Rank</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{padding:10, borderBottom:'1px solid #f2f2f2'}}>{(page-1)*perPage + i + 1}</td>
              <td style={{padding:10, borderBottom:'1px solid #f2f2f2'}}>{r.name ?? ''}</td>
              <td style={{padding:10, borderBottom:'1px solid #f2f2f2', maxWidth:420, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                {r.shorturl ? <a href={r.shorturl} target="_blank">{r.shorturl}</a> : ''}
              </td>
              <td style={{padding:10, borderBottom:'1px solid #f2f2f2', maxWidth:420, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                {r.longurl ? <a href={r.longurl} target="_blank">{r.longurl}</a> : ''}
              </td>
              <td style={{padding:10, borderBottom:'1px solid #f2f2f2'}}>{r.clicks ?? 0}</td>
              <td style={{padding:10, borderBottom:'1px solid #f2f2f2'}}>{r.rank ?? ''}</td>
            </tr>
          ))}
          {(!loading && rows.length===0) && (
            <tr><td colSpan={6} style={{padding:16, color:'#777'}}>Kayıt yok.</td></tr>
          )}
        </tbody>
      </table>

      <div style={{display:'flex', gap:8, alignItems:'center', justifyContent:'flex-end', marginTop:12}}>
        <button onClick={()=> setPage(Math.max(1, page-1))} disabled={page<=1} style={{padding:'6px 10px', border:'1px solid #ddd', borderRadius:8, background:'#fff', opacity: page<=1 ? .5 : 1}}>Önceki</button>
        <span>Sayfa {page}/{maxPage}</span>
        <button onClick={()=> setPage(page+1)} disabled={page>=maxPage} style={{padding:'6px 10px', border:'1px solid #ddd', borderRadius:8, background:'#fff', opacity: page>=maxPage ? .5 : 1}}>Sonraki</button>
      </div>
    </section>
  );
}
