'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

// Placeholder sample clips (Google's public HTML5 video test bucket) so the
// player works end-to-end — swap `src` for real reels via the admin uploader.
const REELS = [
  { id: 1, title: 'Morning Ritual', seed: 'reel-morning', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: 2, title: 'Sea Buckthorn 101', seed: 'reel-seabuckthorn', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { id: 3, title: 'Unboxing GLOWW', seed: 'reel-unboxing', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: 4, title: 'Ashwagandha Q&A', seed: 'reel-ashwagandha', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 5, title: 'Studio Tour', seed: 'reel-studio', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
]

export default function WatchLoveSection() {
  const [playingId, setPlayingId] = useState(null)

  return (
    <section className="section" style={{ background: 'var(--ivory)' }}>
      <Reveal>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">From Our Community</div>
          <h2 className="section-title">
            Watch It. <em>Love It.</em>
          </h2>
        </div>
      </Reveal>

      <div className="reel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
        {REELS.map((reel, i) => (
          <Reveal key={reel.id} delay={i * 0.06}>
            <motion.button
              onClick={() => setPlayingId(playingId === reel.id ? null : reel.id)}
              whileHover={{ y: -4 }}
              style={{
                position: 'relative', display: 'block', width: '100%', aspectRatio: '9/16', borderRadius: 'var(--radius)',
                overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer', boxShadow: 'var(--shadow)', background: 'var(--charcoal)',
              }}
            >
              {playingId === reel.id ? (
                <video
                  src={reel.src}
                  autoPlay
                  controls
                  muted
                  loop
                  playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `linear-gradient(180deg, rgba(7,59,38,0.15) 0%, rgba(7,59,38,0.75) 100%), url(https://picsum.photos/seed/${reel.seed}/450/800)`,
                    backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass" style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={17} color="var(--white)" fill="var(--white)" />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '0.9rem', left: '0.9rem', right: '0.9rem', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--white)', fontWeight: 500 }}>
                    {reel.title}
                  </div>
                </>
              )}
            </motion.button>
          </Reveal>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) { .reel-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 560px) { .reel-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  )
}
