'use client'

import { motion } from 'framer-motion'
import {
  Layers, Brain, Users, Globe,
  Target, Shield, ArrowRight
} from 'lucide-react'

const REASONS = [
  {
    icon: Layers,
    title: 'Strategy Plus Execution',
    desc: "We don't stop at recommendations. Every engagement includes implementation support, hands-on guidance, and accountability for results.",
  },
  {
    icon: Brain,
    title: 'AI-Integrated Thinking',
    desc: 'We embed AI and automation considerations into every engagement, ensuring your business is positioned for both present performance and future readiness.',
  },
  {
    icon: Users,
    title: 'Boutique Commitment',
    desc: 'We serve fewer clients to deliver exceptional depth. Your business receives dedicated attention from senior consultants — not a delegated junior team.',
  },
  {
    icon: Globe,
    title: 'GCC Market Expertise',
    desc: 'Deep understanding of GCC business culture, regulatory environments, and market opportunities for companies expanding regionally.',
  },
  {
    icon: Target,
    title: 'Results Accountability',
    desc: 'Every engagement starts with clear KPIs and ends with verified, measurable outcomes. We commit to results you can see on your balance sheet.',
  },
  {
    icon: Shield,
    title: 'Cost-Competitive Quality',
    desc: 'World-class consulting standards delivered from Pakistan — international expertise at a fraction of global consulting firm rates.',
  },
]

const ease = [0.22, 1, 0.36, 1]

export default function WhyBlackMont() {
  return (
    <section id="about" className="section" style={{ background: '#FFFFFF' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px' }} className="lg:grid-cols-[420px_1fr]">

          {/* Left: Sticky */}
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease }}
            className="lg:sticky lg:top-28"
            style={{ alignSelf: 'start' }}
          >
            <span className="section-label">Why BlackMont</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '20px' }}>
              The BlackMont<br />
              <span style={{ color: '#0A5C38' }}>Difference</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7C74', lineHeight: 1.75, marginBottom: '32px' }}>
              We believe businesses deserve consulting that actually delivers — not just reports that collect dust, but strategies that get implemented and results that get measured.
            </p>
            <a href="#contact" className="btn-primary">
              Start a Conversation
              <ArrowRight size={15} />
            </a>

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '36px' }}>
              {[
                { val: '2024', label: 'Founded' },
                { val: 'GCC', label: 'Primary Market' },
                { val: '15+', label: 'Services' },
                { val: '100%', label: 'Execution Focus' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '16px 18px' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#0A5C38', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '3px' }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9BB0A6' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Reasons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {REASONS.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={i}
                  className="card-hover"
                  initial={{ opacity: 0, x: 22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.58, delay: i * 0.08, ease }}
                  style={{ padding: '22px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}
                >
                  <div className="icon-box" style={{ width: '38px', height: '38px', flexShrink: 0 }}>
                    <Icon size={17} color="#0A5C38" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14.5px', color: '#0C1A12', letterSpacing: '-0.015em', marginBottom: '6px' }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#6B7C74', lineHeight: 1.7 }}>
                      {r.desc}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}