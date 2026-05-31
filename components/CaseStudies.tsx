'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react'

const CASES = [
  {
    tag: 'Global Logistics',
    client: 'Fortune 500 Logistics Provider',
    challenge: 'Inefficient route planning generating 30% excess fuel costs with persistent delivery delays across a fleet of 200+ vehicles.',
    solution: 'AI-powered route optimization engine with predictive maintenance and real-time demand forecasting capabilities.',
    results: [
      { icon: DollarSign, metric: '$45M', label: 'Annual Savings' },
      { icon: TrendingUp, metric: '35%', label: 'Efficiency Gain' },
      { icon: Clock, metric: '22%', label: 'Faster Deliveries' },
    ],
    quote: 'BlackMont transformed our operations from the ground up. ROI exceeded all projections within six months.',
    author: 'Chief Operations Officer',
  },
  {
    tag: 'Restaurant Chain',
    client: 'Multi-Unit Restaurant Group',
    challenge: 'Food waste consuming 25% of gross revenue with inconsistent operational standards across 48 locations nationwide.',
    solution: 'Integrated inventory management platform with AI-driven ordering, kitchen display systems, and operational standardization.',
    results: [
      { icon: DollarSign, metric: '$8.2M', label: 'Cost Reduction' },
      { icon: TrendingUp, metric: '60%', label: 'Waste Reduced' },
      { icon: Users, metric: '4.8/5', label: 'Guest Satisfaction' },
    ],
    quote: 'Our margins improved dramatically without touching quality. A genuinely game-changing partnership.',
    author: 'CEO, Restaurant Group',
  },
  {
    tag: 'Manufacturing',
    client: 'Global Enterprise Manufacturer',
    challenge: 'Supply chain disruptions causing production stoppages and $40M+ in excess inventory holding costs annually.',
    solution: 'End-to-end supply chain visibility platform with AI demand forecasting and proactive supplier risk management.',
    results: [
      { icon: DollarSign, metric: '$120M', label: 'Value Created' },
      { icon: TrendingUp, metric: '40%', label: 'Inventory Reduced' },
      { icon: Clock, metric: '95%', label: 'On-Time Delivery' },
    ],
    quote: 'BlackMont gave us the supply chain resilience we had been seeking for years. Exceptional execution.',
    author: 'VP of Global Operations',
  },
]

export default function CaseStudies() {
  return (
    <section id="casestudies" style={{ padding: '128px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.2 }} />

      <div className="max-w-site mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ marginBottom: '56px' }}
        >
          <span className="badge" style={{ marginBottom: '20px', display: 'inline-flex' }}>Client Success</span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Transformation Stories
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.72, color: '#52525b', maxWidth: '500px' }}>
            Real outcomes from enterprise partnerships that redefined operational excellence 
            and competitive positioning.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {CASES.map((c, i) => (
            <motion.article
              key={i}
              className="card-interactive"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
              style={{ padding: '40px 36px', position: 'relative', overflow: 'hidden' }}
            >
              {/* Gold left accent bar */}
              <div style={{
                position: 'absolute', left: 0, top: '20px', bottom: '20px', width: '2px', borderRadius: '0 2px 2px 0',
                background: 'linear-gradient(180deg, #C9A84C 0%, rgba(201,168,76,0.15) 100%)',
              }} />

              <div className="grid lg:grid-cols-2 gap-8" style={{ paddingLeft: '18px' }}>
                {/* Left */}
                <div>
                  <div style={{
                    display: 'inline-block', marginBottom: '18px', padding: '4px 12px', borderRadius: '999px',
                    background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', fontWeight: 500,
                    color: '#C9A84C', letterSpacing: '0.06em',
                  }}>
                    {c.tag}
                  </div>

                  <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: 'clamp(18px, 2.2vw, 24px)', letterSpacing: '-0.025em',
                    color: '#fafafa', marginBottom: '24px', lineHeight: 1.2,
                  }}>
                    {c.client}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Challenge', text: c.challenge },
                      { label: 'Solution', text: c.solution },
                    ].map((block) => (
                      <div key={block.label}>
                        <div className="section-label" style={{ marginBottom: '6px' }}>{block.label}</div>
                        <p style={{ fontSize: '14px', lineHeight: 1.72, color: '#52525b' }}>{block.text}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderLeft: '2px solid rgba(201,168,76,0.24)', paddingLeft: '16px' }}>
                    <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#d4d4d8', fontStyle: 'italic', marginBottom: '6px' }}>
                      "{c.quote}"
                    </p>
                    <p style={{ fontSize: '12px', color: '#52525b' }}>— {c.author}</p>
                  </div>
                </div>

                {/* Right: results */}
                <div>
                  <div className="section-label" style={{ marginBottom: '18px' }}>Measurable Results</div>
                  <div className="grid grid-cols-3 gap-3">
                    {c.results.map((r, ri) => {
                      const Icon = r.icon
                      return (
                        <div key={ri} className="card" style={{ padding: '20px 12px', textAlign: 'center' }}>
                          <Icon size={15} color="#C9A84C" style={{ margin: '0 auto 12px' }} />
                          <div className="text-gold" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.03em', marginBottom: '4px' }}>
                            {r.metric}
                          </div>
                          <div style={{ fontSize: '11px', color: '#52525b' }}>{r.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}