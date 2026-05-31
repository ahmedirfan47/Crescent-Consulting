'use client'

import { motion } from 'framer-motion'
import { Layers, Target, Globe, Zap } from 'lucide-react'

const METRICS = [
  { icon: Layers, value: '15+', label: 'Expert Services', sub: 'Across all practice areas' },
  { icon: Target, value: '4', label: 'Phase Framework', sub: 'Proven delivery methodology' },
  { icon: Globe, value: 'GCC', label: 'Market Expansion', sub: 'Saudi Arabia to Oman' },
  { icon: Zap, value: '100%', label: 'Execution Focus', sub: 'Strategy + implementation' },
]

export default function TrustBar() {
  return (
    <section style={{ padding: '0', background: '#F8FAF8', borderTop: '1px solid #E2EDE8', borderBottom: '1px solid #E2EDE8' }}>
      <div className="wrap" style={{ padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0',
          }}
          className="sm:grid-cols-4"
        >
          {METRICS.map((m, i) => {
            const Icon = m.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
                style={{
                  padding: '28px 24px',
                  borderRight: i < 3 ? '1px solid #E2EDE8' : 'none',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}
              >
                <div className="icon-box" style={{ width: '40px', height: '40px' }}>
                  <Icon size={18} color="#0A5C38" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', color: '#0C1A12', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374740', marginTop: '3px' }}>{m.label}</div>
                  <div style={{ fontSize: '11.5px', color: '#9BB0A6', marginTop: '2px' }}>{m.sub}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}