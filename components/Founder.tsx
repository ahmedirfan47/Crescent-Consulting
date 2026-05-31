'use client'

import { motion } from 'framer-motion'
import { Brain, Target, Zap, Globe, Building2, LineChart } from 'lucide-react'

const EXPERTISE = [
  'Business Strategy', 'Growth Planning', 'Operational Excellence',
  'Artificial Intelligence', 'Business Automation', 'Technology Consulting',
  'Digital Transformation', 'Systems Integration',
]

const ease = [0.22, 1, 0.36, 1]

export default function Founder() {
  return (
    <section className="section" style={{ background: '#FFFFFF' }}>
      <div className="wrap">
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '56px', alignItems: 'center' }}
          className="lg:grid-cols-2"
        >
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.78, ease }}
          >
            <div style={{ position: 'relative' }}>
              {/* Main founder card */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #0A5C38 0%, #0D7A4A 100%)',
                  borderRadius: '20px',
                  padding: '48px 40px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Pattern overlay */}
                <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />

                {/* Initials */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '20px',
                    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px',
                  }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px', color: '#FFFFFF', letterSpacing: '-0.04em' }}>AI</span>
                  </div>

                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '6px' }}>
                    Ahmed Irfan
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', letterSpacing: '0.01em' }}>
                    Founder & Chief Executive Officer
                  </div>

                  {/* Quote */}
                  <blockquote style={{
                    borderLeft: '2px solid rgba(255,255,255,0.25)',
                    paddingLeft: '16px',
                    fontSize: '14.5px', lineHeight: 1.72,
                    color: 'rgba(255,255,255,0.82)', fontStyle: 'italic',
                  }}>
                    "BlackMont was built on a simple belief: businesses deserve consulting that actually delivers — strategies that get implemented and results that get measured."
                  </blockquote>
                </div>
              </div>

              {/* Floating expertise tags */}
              <div style={{
                position: 'absolute', bottom: '-20px', right: '-16px',
                background: '#FFFFFF', border: '1px solid #E2EDE8',
                borderRadius: '12px', padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0A5C38', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                  Core Expertise
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '200px' }}>
                  {['AI', 'Strategy', 'Operations', 'Automation'].map((tag) => (
                    <span key={tag} style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '11.5px',
                      fontWeight: 500, background: '#EEF7F2',
                      color: '#0A5C38', border: '1px solid rgba(10,92,56,0.14)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.78, delay: 0.12, ease }}
          >
            <span className="section-label">Leadership</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', marginBottom: '20px' }}>
              Built on Expertise.<br />
              <span style={{ color: '#0A5C38' }}>Driven by Results.</span>
            </h2>

            <p style={{ fontSize: '16px', color: '#6B7C74', lineHeight: 1.78, marginBottom: '20px' }}>
              Ahmed Irfan founded BlackMont Consulting with a vision to help organizations unlock growth through a combination of strategic thinking, operational excellence, and practical technology adoption.
            </p>
            <p style={{ fontSize: '15.5px', color: '#6B7C74', lineHeight: 1.78, marginBottom: '32px' }}>
              With a background in Artificial Intelligence and Business Operations, Ahmed combines technical expertise with practical business understanding — delivering consulting that bridges strategy and execution across industries in Pakistan and the GCC.
            </p>

            {/* Expertise grid */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9BB0A6', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', fontFamily: 'JetBrains Mono, monospace' }}>
                Areas of Expertise
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {EXPERTISE.map((e) => (
                  <span key={e} style={{
                    padding: '6px 14px', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 500,
                    background: '#F8FAF8', color: '#374740',
                    border: '1px solid #E2EDE8',
                  }}>
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {/* BlackMont mission */}
            <div style={{
              padding: '20px 22px',
              background: '#EEF7F2',
              border: '1px solid rgba(10,92,56,0.14)',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A5C38', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                Company Mission
              </div>
              <div style={{ fontSize: '14px', color: '#374740', lineHeight: 1.7 }}>
                To help businesses across Pakistan and the GCC achieve sustainable growth through strategic consulting, AI integration, and operational excellence — delivering real results, not just recommendations.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}