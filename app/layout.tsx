export const metadata = { title: "Adresler • Supabase Starter", description: "Betting site search MVP on Next.js + Supabase" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', margin:0, background:'#fafafa'}}>
        <header style={{position:'sticky', top:0, zIndex:9, background:'#fff', borderBottom:'1px solid #eee', padding:'12px 16px'}}>
          <h1 style={{margin:0, fontSize:18}}>Adresler • Canlı Liste</h1>
        </header>
        <main style={{maxWidth:1200, margin:'0 auto', padding:'16px'}}>{children}</main>
        <footer style={{textAlign:'center', padding:'16px', color:'#888', fontSize:12}}>© {new Date().getFullYear()} Adresler</footer>
      </body>
    </html>
  );
}
