'use client'

import { motion } from 'framer-motion'

const STATS = [
  { value: '$2.4B+', label: 'Enterprise Value Created', detail: 'Measured across all client engagements globally' },
  { value: '200+', label: 'Enterprise Clients', detail: 'From high-growth startups to Fortune 500' },
  { value: '45+', label: 'Countries Served', detail: 'With deep local market expertise' },
  { value: '98%', label: 'Client Satisfaction', detail: 'Measured post-engagement across all projects' },
]

export default function Statistics() {
  return (
    <section style={{ padding: '80px 0', position: 'relative' }}>
      <div className="max-w-site mx-auto px-6">
        <div className="divider" style={{ marginBottom: '56px', maxWidth: '640px' }} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              className="card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              style={{ padding: '28px 24px' }}
            >
              <div
                className="text-gold"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '42px', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '8px' }}
              >
                {s.value}
              </div>
              <div style={{ color: '#fafafa', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.015em', marginBottom: '5px' }}>
                {s.label}
              </div>
              <div style={{ color: '#52525b', fontSize: '12px', lineHeight: 1.6 }}>
                {s.detail}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="divider" style={{ marginTop: '56px', maxWidth: '640px' }} />
      </div>
    </section>
  )
}