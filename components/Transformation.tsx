'use client'

import { motion } from 'framer-motion'
import { Search, Lightbulb, Settings2, Rocket, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { num: '01', icon: Search, title: 'Discovery & Diagnosis', desc: 'Deep assessment of operations, challenges, and market opportunities through data analysis and executive-level interviews.', duration: '2–4 Weeks' },
  { num: '02', icon: Lightbulb, title: 'Strategic Blueprint', desc: 'Tailored transformation roadmap with precise milestones, resource requirements, and measurable KPIs agreed upon upfront.', duration: '3–5 Weeks' },
  { num: '03', icon: Settings2, title: 'Precision Execution', desc: 'Agile deployment of solutions with embedded change management, stakeholder alignment, and real-time performance tracking.', duration: '8–16 Weeks' },
  { num: '04', icon: Rocket, title: 'Scale & Optimize', desc: 'Performance monitoring, continuous optimization, and enterprise-wide expansion with complete knowledge transfer.', duration: 'Ongoing' },
]

const OUTCOMES = [
  'Measurable ROI within 12 months',
  'Real-time executive KPI dashboards',
  'Full knowledge transfer to your team',
]

export default function Transformation() {
  return (
    <section style={{ padding: '128px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 55% at 92% 50%, rgba(201,168,76,0.035) 0%, transparent 60%)',
      }} />

      <div className="max-w-site mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ marginBottom: '56px' }}
        >
          <span className="badge" style={{ marginBottom: '20px', display: 'inline-flex' }}>Our Methodology</span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            How We Transform Businesses
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.72, color: '#52525b', maxWidth: '500px' }}>
            A proven, repeatable framework that delivers measurable results while building 
            lasting internal capabilities for sustained excellence.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '16px' }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: 'easeOut' }}
                style={{ padding: '28px 24px', position: 'relative', overflow: 'hidden' }}
              >
                {/* Ghost step number */}
                <div style={{
                  position: 'absolute', top: '12px', right: '16px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: '64px', lineHeight: 1, letterSpacing: '-0.04em',
                  color: 'rgba(255,255,255,0.022)', userSelect: 'none',
                }}>
                  {step.num}
                </div>

                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #C9A84C, #E8C878)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '18px', boxShadow: '0 4px 16px rgba(201,168,76,0.2)',
                }}>
                  <Icon size={18} color="#0A0A0A" />
                </div>

                <div style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: '6px', marginBottom: '14px',
                  background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.14)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                  color: '#C9A84C', letterSpacing: '0.06em', fontWeight: 500,
                }}>
                  {step.duration}
                </div>

                <div style={{
                  color: '#fafafa', fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: '15px', letterSpacing: '-0.02em', marginBottom: '10px',
                }}>
                  {step.title}
                </div>

                <div style={{ color: '#52525b', fontSize: '13px', lineHeight: 1.72 }}>
                  {step.desc}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Outcomes strip */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
          style={{ padding: '24px 28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}
        >
          <div style={{ minWidth: '200px', flex: '0 0 auto' }}>
            <div style={{ color: '#fafafa', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.02em', marginBottom: '3px' }}>
              Guaranteed Outcomes
            </div>
            <div style={{ color: '#52525b', fontSize: '12px' }}>Every engagement built around measurable delivery.</div>
          </div>
          <div className="divider" style={{ height: '40px', width: '1px', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.065), transparent)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', flex: 1 }}>
            {OUTCOMES.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', color: '#a1a1aa', flexShrink: 0 }}>
                <CheckCircle2 size={15} color="#C9A84C" style={{ flexShrink: 0, marginTop: '1px' }} />
                {o}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}