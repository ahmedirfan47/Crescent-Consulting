'use client'

import { motion } from 'framer-motion'

const EXPERTISE = [
  'Business Strategy', 'Growth Planning', 'Operational Excellence',
  'Artificial Intelligence', 'Business Automation', 'Technology Consulting',
  'Digital Transformation', 'Systems Integration',
]

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Founder() {
  return (
    <section className="section" style={{ background: '#FFFFFF' }}>
      <div className="wrap">
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '56px', alignItems: 'center' }}
          className="lg:grid-cols-2"
        >
          {/* Left: Visual card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.78, ease }}
          >
            <div style={{ position: 'relative' }}>
              {/* Main card */}
              <div
                style={{
                  background: 'linear-gradient(150deg, #0A5C38 0%, #073D27 100%)',
                  borderRadius: '20px',
                  padding: '52px 44px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />

                {/* Large decorative crescent */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-40px',
                    right: '-40px',
                    width: '200px',
                    height: '200px',
                    opacity: 0.07,
                  }}
                >
                  <svg viewBox="0 0 200 200" fill="none">
                    <path
                      d="M100 10C50.3 10 10 50.3 10 100S50.3 190 100 190c20.9 0 40.1-6.7 55.8-17.9A72 72 0 0 1 100 100a72 72 0 0 1 55.8-72.1A89.7 89.7 0 0 0 100 10z"
                      fill="white"
                    />
                  </svg>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Initials */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '28px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontWeight: 600,
                        fontSize: '34px',
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      AI
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: '28px',
                      color: '#FFFFFF',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                      marginBottom: '6px',
                    }}
                  >
                    Ahmed Irfan
                  </div>

                  <div
                    style={{
                      fontSize: '13.5px',
                      color: 'rgba(255,255,255,0.55)',
                      marginBottom: '32px',
                    }}
                  >
                    Founder &amp; Chief Executive Officer
                  </div>

                  <blockquote
                    style={{
                      borderLeft: '2px solid rgba(184,150,46,0.5)',
                      paddingLeft: '18px',
                      fontSize: '14.5px',
                      lineHeight: 1.72,
                      color: 'rgba(255,255,255,0.78)',
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                      fontWeight: 400,
                    }}
                  >
                    "Crescent was built on a simple belief: businesses deserve consulting
                    that actually delivers — strategies that get implemented and results
                    that get measured."
                  </blockquote>
                </div>
              </div>

              {/* Floating expertise card */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-16px',
                  background: '#FFFFFF',
                  border: '1px solid #DDE8E2',
                  borderRadius: '12px',
                  padding: '18px 22px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="section-label"
                  style={{ marginBottom: '10px', fontSize: '9px' }}
                >
                  Core Focus
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '200px' }}>
                  {['AI', 'Strategy', 'Operations', 'GCC'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11.5px',
                        fontWeight: 500,
                        background: '#EAF5EE',
                        color: '#0A5C38',
                        border: '1px solid rgba(10,92,56,0.14)',
                      }}
                    >
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
            <span className="section-label-serif">Leadership</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', marginBottom: '20px' }}>
              Built on Expertise.
              <br />
              <span style={{ color: '#0A5C38' }}>Driven by Results.</span>
            </h2>

            <p style={{ fontSize: '16px', color: '#6B7C74', lineHeight: 1.78, marginBottom: '20px' }}>
              Ahmed Irfan founded Crescent Consulting with a vision to help organizations
              unlock growth through strategic thinking, operational excellence, and practical
              technology adoption.
            </p>
            <p style={{ fontSize: '15.5px', color: '#6B7C74', lineHeight: 1.78, marginBottom: '32px' }}>
              With a background in Artificial Intelligence and Business Operations, Ahmed
              combines technical expertise with practical business understanding — delivering
              consulting that bridges strategy and execution across industries in Pakistan
              and the GCC.
            </p>

            {/* Expertise tags */}
            <div style={{ marginBottom: '32px' }}>
              <div
                className="section-label"
                style={{ marginBottom: '14px' }}
              >
                Areas of Expertise
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {EXPERTISE.map((e) => (
                  <span
                    key={e}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      background: '#F4FAF6',
                      color: '#3D4D45',
                      border: '1px solid #DDE8E2',
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {/* Mission */}
            <div
              style={{
                padding: '22px 24px',
                background: '#EAF5EE',
                border: '1px solid rgba(10,92,56,0.14)',
                borderRadius: '12px',
              }}
            >
              <div className="section-label" style={{ marginBottom: '8px', fontSize: '9.5px' }}>
                Company Mission
              </div>
              <div style={{ fontSize: '14px', color: '#3D4D45', lineHeight: 1.7 }}>
                To help businesses across Pakistan and the GCC achieve sustainable growth
                through strategic consulting, AI integration, and operational excellence —
                delivering real results.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}