import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Christmas AI Photo Editor'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a0505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#F5E6D3',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '4px solid #D4AF37',
            borderRadius: '20px',
            opacity: 0.5,
          }}
        />

        {/* Snowflakes (simple circles) */}
        <div style={{ position: 'absolute', top: '40px', left: '100px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: '80px', right: '150px', width: '15px', height: '15px', borderRadius: '50%', background: '#fff', opacity: 0.4 }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '200px', width: '25px', height: '25px', borderRadius: '50%', background: '#fff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: '100px', right: '80px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', opacity: 0.3 }} />
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '20px',
              color: '#F5E6D3',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Christmas AI
          </h1>
          <h2
            style={{
              fontSize: '40px',
              margin: 0,
              color: '#D4AF37',
              opacity: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '4px',
            }}
          >
            Photo Editor
          </h2>
          <p
            style={{
              fontSize: '28px',
              marginTop: '40px',
              color: '#F5E6D3',
              opacity: 0.8,
              maxWidth: '800px',
            }}
          >
            Transform your photos with festive Christmas magic
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
