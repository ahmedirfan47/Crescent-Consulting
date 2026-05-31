
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: 'How can AI actually improve my business operations?',
    a: 'AI improves businesses in three primary ways: automation (replacing repetitive tasks with intelligent systems), analytics (uncovering patterns and insights in operational data), and optimization (enabling faster, more accurate decisions). At BlackMont, we identify the specific AI applications most relevant to your industry and implement practical solutions — not theoretical concepts — that deliver measurable ROI.',
  },
  {
    q: 'How long does a typical BlackMont engagement last?',
    a: 'Our minimum engagement period is four weeks. Meaningful business transformation requires proper discovery, analysis, implementation, and validation. Most engagements run between 4 and 16 weeks depending on scope — from focused process improvement projects (4–8 weeks) to comprehensive transformations with full technology implementation (8–16 weeks).',
  },
  {
    q: 'Do you work with businesses in Saudi Arabia and the GCC?',
    a: 'Yes. GCC market expansion is central to our strategy. We actively serve clients in Saudi Arabia and across the GCC, offering both remote and on-site consulting. Our team brings deep understanding of GCC business culture, regulatory environments, and market dynamics — combined with Pakistan-based delivery that makes our services highly cost-competitive.',
  },
  {
    q: 'What industries does BlackMont specialize in?',
    a: 'Our strongest expertise is in logistics and transportation, supply chain and distribution, food and beverage operations, and wholesale businesses. We also serve manufacturing companies, warehousing operations, professional service firms, family-owned businesses, and growth-stage companies. If your industry is not listed, we encourage you to reach out and discuss how our capabilities apply.',
  },
  {
    q: 'How does BlackMont help reduce operational costs?',
    a: 'We approach cost reduction through three lenses: process optimization (eliminating waste and bottlenecks in workflows), automation (replacing manual processes with intelligent technology), and systems consolidation (connecting fragmented tools into a unified ecosystem). Our clients typically achieve measurable reductions in labor costs, process overhead, and resource waste.',
  },
  {
    q: 'What makes BlackMont different from other consulting firms?',
    a: 'Three things distinguish us: (1) We combine strategy with implementation — every recommendation comes with execution support, not just a report. (2) We embed AI and modern technology thinking into every engagement, making recommendations that are future-ready. (3) We take on fewer clients to deliver deeper, higher-impact work — your business receives senior consultant attention throughout.',
  },
]

const ease = [0.22, 1, 0.36, 1]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section" style={{ background: '#FFFFFF' }}>
      <div className="wrap">
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '56px' }}
          className="lg:grid-cols-[340px_1fr]"
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="lg:sticky lg:top-28"
            style={{ alignSelf: 'start' }}
          >
            <span className="section-label">FAQ</span>

            <h2
              style={{
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                marginBottom: '16px',
              }}
            >
              Frequently Asked Questions
            </h2>

            <p
              style={{
                fontSize: '15.5px',
                color: '#6B7C74',
                lineHeight: 1.75,
                marginBottom: '28px',
              }}
            >
              Have a different question? Our team is available to answer
              anything about our services, process, or how we can help your
              business.
            </p>

            <a
              href="#contact"
              className="btn-primary"
              style={{ fontSize: '13px' }}
            >
              Ask Us Directly
            </a>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
          >
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: '1px solid #E2EDE8',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '22px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 600,
                      fontSize: '15px',
                      color: open === i ? '#0A5C38' : '#0C1A12',
                      letterSpacing: '-0.015em',
                      lineHeight: 1.4,
                      transition: 'color 0.22s',
                      flex: 1,
                    }}
                  >
                    {faq.q}
                  </span>

                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: open === i ? '#0A5C38' : '#EEF7F2',
                      border: `1px solid ${
                        open === i ? '#0A5C38' : '#E2EDE8'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition:
                        'background 0.22s, border-color 0.22s',
                    }}
                  >
                    {open === i ? (
                      <Minus size={14} color="#FFFFFF" />
                    ) : (
                      <Plus size={14} color="#0A5C38" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          paddingBottom: '22px',
                          paddingRight: '44px',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '14.5px',
                            color: '#6B7C74',
                            lineHeight: 1.78,
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

