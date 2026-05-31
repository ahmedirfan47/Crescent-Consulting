'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, TrendingUp, Settings2, Activity, Users, BarChart2,
  Brain, Layers, Zap, Monitor, LineChart, Database,
  Truck, GitMerge, Building2, ArrowUpRight
} from 'lucide-react'

type Category = 'consulting' | 'technology' | 'operations'

const CATEGORIES: { key: Category; label: string; desc: string }[] = [
  { key: 'consulting', label: 'Business Consulting', desc: 'Strategy, growth, and operational excellence' },
  { key: 'technology', label: 'Technology & AI', desc: 'AI integration, automation, and digital solutions' },
  { key: 'operations', label: 'Operations', desc: 'Logistics, systems, and technology advisory' },
]

const SERVICES: Record<Category, { icon: React.ElementType; title: string; desc: string; duration: string }[]> = {
  consulting: [
    { icon: Target, title: 'Business Strategy Consulting', desc: 'Comprehensive strategy aligned with goals, market opportunities, competitive positioning, and long-term growth.', duration: '6–12 weeks' },
    { icon: TrendingUp, title: 'Growth Strategy Development', desc: 'Actionable plans to increase revenue, market share, and customer acquisition with clear execution roadmaps.', duration: '4–8 weeks' },
    { icon: Settings2, title: 'Business Process Optimization', desc: 'Analysis and redesign of workflows to improve efficiency, productivity, and operational scalability.', duration: '4–8 weeks' },
    { icon: Activity, title: 'Operational Excellence Consulting', desc: 'Better systems, governance, accountability, and performance management for consistent business outcomes.', duration: '8–16 weeks' },
    { icon: Users, title: 'Organizational Development', desc: 'Improve structure, leadership alignment, communication, and organizational effectiveness for scaling teams.', duration: '6–12 weeks' },
    { icon: BarChart2, title: 'Performance Improvement Consulting', desc: 'Identify performance gaps and implement targeted initiatives to improve productivity and profitability.', duration: '4–10 weeks' },
  ],
  technology: [
    { icon: Brain, title: 'AI Integration Consulting', desc: 'Assess and implement practical AI opportunities across operations, decision-making, and customer engagement.', duration: '4–8 weeks' },
    { icon: Layers, title: 'AI Workflow Design', desc: 'Design intelligent AI-powered workflows that automate repetitive tasks and improve operational scalability.', duration: '4–6 weeks' },
    { icon: Zap, title: 'Business Process Automation', desc: 'Streamline operations using AI and modern automation to reduce manual work and improve consistency.', duration: '6–16 weeks' },
    { icon: Monitor, title: 'Corporate Website Development', desc: 'Premium corporate websites that strengthen brand credibility, improve engagement, and generate leads.', duration: '4–12 weeks' },
    { icon: Activity, title: 'Website Performance Optimization', desc: 'Improve website speed, UX, conversion effectiveness, and technical performance.', duration: '4–6 weeks' },
    { icon: LineChart, title: 'Website Analytics & Reporting', desc: 'Analytics systems providing clear visibility into website performance, customer behavior, and lead generation.', duration: '4–6 weeks' },
  ],
  operations: [
    { icon: Truck, title: 'Logistics Process Improvement', desc: 'Optimize transportation, warehousing, inventory management, and supply chain for maximum operational performance.', duration: '6–12 weeks' },
    { icon: Database, title: 'Systems Integration Consulting', desc: 'Connect business systems, software platforms, and operational tools into a unified and efficient ecosystem.', duration: '6–12 weeks' },
    { icon: Building2, title: 'Technology Consulting', desc: 'Expert guidance on technology investments, software selection, digital transformation, and modernization strategy.', duration: '4–8 weeks' },
  ],
}

const ease = [0.22, 1, 0.36, 1]

export default function Services() {
  const [active, setActive] = useState<Category>('consulting')

  return (
    <section id="services" className="section" style={{ background: '#FFFFFF' }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: '52px' }}
        >
          <span className="section-label">Our Capabilities</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px', letterSpacing: '-0.03em' }}>
            15 Specialized Services.<br />
            <span style={{ color: '#0A5C38' }}>One Strategic Partner.</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7C74', maxWidth: '520px', lineHeight: 1.72 }}>
            From strategic planning and AI integration to operational transformation and technology consulting — all under one firm, with a single focus on your results.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px',
            marginBottom: '40px',
            borderBottom: '1px solid #E2EDE8',
            paddingBottom: '0',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: active === cat.key ? '2.5px solid #0A5C38' : '2.5px solid transparent',
                marginBottom: '-1px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: active === cat.key ? 600 : 500,
                color: active === cat.key ? '#0A5C38' : '#6B7C74',
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Service Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {SERVICES[active].map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.title}
                  className="card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease }}
                  style={{ padding: '26px' }}
                >
                  <div className="icon-box" style={{ marginBottom: '18px' }}>
                    <Icon size={20} color="#0A5C38" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: '#0C1A12', letterSpacing: '-0.02em', lineHeight: 1.3, flex: 1 }}>
                      {s.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: '13.5px', color: '#6B7C74', lineHeight: 1.7, marginBottom: '18px' }}>
                    {s.desc}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px',
                      fontWeight: 500, color: '#9BB0A6', letterSpacing: '0.03em',
                    }}>
                      {s.duration}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#0A5C38', transition: 'gap 0.2s' }}>
                      Learn More <ArrowUpRight size={13} />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <a href="#contact" className="btn-ghost">
            Discuss Your Requirements
            <ArrowUpRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}