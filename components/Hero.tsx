'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const TRUST = [
  '15+ Specialized Services',
  'Pakistan & GCC Focus',
  'AI-Powered Approach',
  'Strategy + Execution',
]

const ease = [0.22, 1, 0.36, 1]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.78, delay, ease },
})

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative', minHeight: '100vh', display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        overflow: 'hidden', paddingTop: '72px',
        background: '#FFFFFF',
      }}
    >
      {/* Dot pattern background */}
      <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />

      {/* Subtle green glow */}
      <div style={{
        position: 'absolute', top: '15%', right: '8%',
        width: '520px', height: '520px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10,92,56,0.055) 0%, transparent 65%)',
        filter: 'blur(48px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: '360px', height: '360px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10,92,56,0.04) 0%, transparent 65%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1, paddingTop: '80px', paddingBottom: '96px' }}>
        <div style={{ maxWidth: '840px' }}>

          {/* Badge */}
          <motion.div {...fade(0)} style={{ marginBottom: '28px' }}>
            <span className="badge">
              <CheckCircle2 size={11} />
              Pakistan &amp; GCC Business Consulting
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fade(0.12)}
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(44px, 7.5vw, 88px)',
              lineHeight: 1.0, letterSpacing: '-0.04em',
              color: '#0C1A12', marginBottom: '26px',
            }}
          >
            Where{' '}
            <span style={{ color: '#0A5C38' }}>Strategy</span>
            <br />
            Meets{' '}
            <span style={{ color: '#0A5C38' }}>Execution</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            {...fade(0.24)}
            style={{
              fontSize: 'clamp(16px, 2.2vw, 19px)', lineHeight: 1.72,
              color: '#6B7C74', maxWidth: '580px', marginBottom: '40px',
              fontWeight: 400,
            }}
          >
            BlackMont Consulting helps CEOs, founders, and operations leaders in
            Pakistan and the GCC build stronger businesses through strategic
            consulting, AI integration, and proven operational transformation.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fade(0.34)}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '60px' }}
          >
            <a href="#contact" className="btn-primary" style={{ fontSize: '15px', padding: '14px 28px' }}>
              Book Free Consultation
              <ArrowRight size={16} />
            </a>
            <a href="#services" className="btn-secondary" style={{ fontSize: '15px', padding: '14px 28px' }}>
              Explore Services
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            {...fade(0.46)}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '20px',
              paddingTop: '28px',
              borderTop: '1px solid #E2EDE8',
            }}
          >
            {TRUST.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6B7C74' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0A5C38', flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)' }}>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{ width: '1px', height: '44px', background: 'linear-gradient(to bottom, transparent, rgba(10,92,56,0.45), transparent)', margin: '0 auto' }}
        />
      </div>
    </section>
  )
}