import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Full Stack Developer';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: 'monospace',
          }}
        >
          {/* Logo / Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '10px 20px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '50px',
            marginBottom: '40px'
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00f0ff' }} />
            <span style={{ color: '#00f0ff', fontSize: 24, fontWeight: 'bold' }}>DIDG_PORTFOLIO</span>
          </div>

          {/* Título Principal */}
          <div style={{ 
            color: 'white', 
            fontSize: 70, 
            fontWeight: 900, 
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '20px',
            textShadow: '0 0 20px rgba(255,255,255,0.2)'
          }}>
            BUILDING SOFTWARE
          </div>
          <div style={{ 
            backgroundImage: 'linear-gradient(90deg, #00f0ff, #7000ff)', 
            backgroundClip: 'text', 
            color: 'transparent', 
            fontSize: 60, 
            fontWeight: 900 
          }}>
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}