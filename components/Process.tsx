'use client'

import { motion } from 'framer-motion'
import { Search, Lightbulb, Settings2, Rocket, CheckCircle2 } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: Search,
    phase: 'Discovery & Assessment',
    desc: 'Stakeholder interviews, business assessment, process review, and opportunity identification across your organization.',
    activities: ['Stakeholder interviews', 'Business assessment', 'Process evaluation', 'Data collection'],
  },
  {
    num: '02',
    icon: Lightbulb,
    phase: 'Strategy & Planning',
    desc: 'Root cause analysis, strategic recommendations, KPI development, and roadmap creation with executive alignment.',
    activities: ['Root cause analysis', 'Strategic roadmap', 'KPI development', 'Executive alignment'],
  },
  {
    num: '03',
    icon: Settings2,
    phase: 'Implementation & Transformation',
    desc: 'Solution design, process optimization, technology implementation, and change management with hands-on support.',
    activities: ['Solution design', 'Process optimization', 'Tech implementation', 'Change management'],
  },
  {
    num: '04',
    icon: Rocket,
    phase: 'Optimization & Results',
    desc: 'KPI monitoring, performance measurement, continuous improvement, and transparent executive reporting.',
    activities: ['KPI monitoring', 'Performance tracking', 'Continuous improvement', 'Executive reporting'],
  },
]

const ease = [0.22, 1, 0.36, 1]

export default function Process() {
  return (
    <section className="section" style={{ background: '#F8FAF8' }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: '56px', textAlign: 'center' }}
        >
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>Our Methodology</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
            The BlackMont Growth Framework™
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7C74', maxWidth: '520px', margin: '0 auto', lineHeight: 1.72 }}>
            A proven four-phase methodology that delivers measurable results while building lasting internal capabilities for your organization.
          </p>
        </motion.div>

        {/* Steps */}
        <div
          style={{ display: 'grid', gap: '16px' }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.62, delay: i * 0.1, ease }}
                style={{ padding: '28px 26px', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}
              >
                {/* Ghost number */}
                <div style={{
                  position: 'absolute', top: '10px', right: '16px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: '60px', lineHeight: 1, color: 'rgba(10,92,56,0.04)',
                  letterSpacing: '-0.04em', userSelect: 'none',
                }}>
                  {step.num}
                </div>

                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '11px',
                  background: '#0A5C38',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px', boxShadow: '0 4px 14px rgba(10,92,56,0.2)',
                }}>
                  <Icon size={20} color="#FFFFFF" />
                </div>

                {/* Phase label */}
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                  fontWeight: 600, color: '#0A5C38', letterSpacing: '0.08em',
                  marginBottom: '10px', textTransform: 'uppercase',
                }}>
                  Phase {step.num}
                </div>

                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: '15.5px', color: '#0C1A12',
                  letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.3,
                }}>
                  {step.phase}
                </h3>

                <p style={{ fontSize: '13.5px', color: '#6B7C74', lineHeight: 1.7, marginBottom: '18px' }}>
                  {step.desc}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {step.activities.map((a, ai) => (
                    <li key={ai} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#6B7C74' }}>
                      <CheckCircle2 size={12} color="#0A5C38" style={{ flexShrink: 0 }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45, ease }}
          style={{
            marginTop: '28px', padding: '20px 28px',
            background: '#EEF7F2', border: '1px solid rgba(10,92,56,0.16)',
            borderRadius: '12px', display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', gap: '12px',
          }}
        >
          <CheckCircle2 size={18} color="#0A5C38" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0C1A12' }}>Minimum 4-week engagement. </span>
            <span style={{ fontSize: '14px', color: '#6B7C74' }}>
              Meaningful transformation requires proper discovery, implementation, and validation. We don't offer quick fixes — we build lasting results.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}