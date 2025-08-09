import dynamic from 'next/dynamic';
const LogosTable = dynamic(() => import('../components/LogosTable'), { ssr: false });
export default function Page(){
  return (
    <div>
      <p style={{color:'#555', marginTop:0}}>Supabase VIEW: <code>{process.env.NEXT_PUBLIC_VIEW_NAME || 'public_logos'}</code></p>
      <LogosTable />
      <p style={{fontSize:12, color:'#888', marginTop:12}}>Env: <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, opsiyonel <code>NEXT_PUBLIC_VIEW_NAME</code></p>
    </div>
  );
}
