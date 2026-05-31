
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

export default function CTABanner() {
  return (
    <section
      style={{
        background: '#0A5C38',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="section-sm"
    >
      {/* Pattern */}
      <div
        className="dot-pattern"
        style={{ position: 'absolute', inset: 0, opacity: 0.1 }}
      />

      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-40px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }}
      />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Ready to Transform Your Business?
            </div>

            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(26px, 3.8vw, 44px)',
                color: '#FFFFFF',
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              Let's Build Something
              <br />
              Exceptional Together
            </h2>

            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.7,
              }}
            >
              Join ambitious businesses across Pakistan and the GCC that trust
              BlackMont to deliver real strategic, operational, and technology
              transformation.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                background: '#FFFFFF',
                color: '#0A5C38',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                borderRadius: '9px',
                textDecoration: 'none',
                transition:
                  'background 0.22s, box-shadow 0.22s, transform 0.18s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  '#F0F0F0'
                ;(e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  '#FFFFFF'
                ;(e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(0)'
              }}
            >
              Book Free Consultation
              <ArrowRight size={16} />
            </a>

            <a
              href="https://wa.me/923235663592"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                background: 'transparent',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                borderRadius: '9px',
                border: '1.5px solid rgba(255,255,255,0.3)',
                textDecoration: 'none',
                transition:
                  'border-color 0.22s, background 0.22s, transform 0.18s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(255,255,255,0.6)'
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(255,255,255,0.3)'
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  'transparent'
                ;(e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(0)'
              }}
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

