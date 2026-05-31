'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, Brain, TrendingUp, Settings2 } from 'lucide-react'

const POSTS = [
  {
    icon: Brain,
    category: 'AI & Technology',
    title: 'How AI Is Transforming Logistics Operations in the GCC',
    excerpt: 'As GCC logistics companies face increasing pressure to reduce costs and improve delivery performance, AI-powered systems are providing a clear competitive advantage.',
    readTime: '7 min read',
    date: 'May 2026',
  },
  {
    icon: TrendingUp,
    category: 'Business Strategy',
    title: 'The 5 Most Common Growth Bottlenecks Holding SMEs Back',
    excerpt: "Most growing businesses hit the same walls. Understanding these five common growth bottlenecks — and how to address them systematically — can accelerate your trajectory significantly.",
    readTime: '6 min read',
    date: 'May 2026',
  },
  {
    icon: Settings2,
    category: 'Operations',
    title: 'Why Operational Excellence Is the Foundation of Scalable Growth',
    excerpt: 'Revenue growth without operational maturity creates fragile businesses. Here is why operational excellence must come before aggressive expansion — and how to build it.',
    readTime: '8 min read',
    date: 'April 2026',
  },
]

const ease = [0.22, 1, 0.36, 1]

export default function Insights() {
  return (
    <section id="insights" className="section" style={{ background: '#F8FAF8' }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', marginBottom: '44px' }}
        >
          <div>
            <span className="section-label">Thought Leadership</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
              Executive Insights
            </h2>
          </div>
          <a href="#" className="btn-ghost" style={{ fontSize: '13px', alignSelf: 'flex-end' }}>
            View All Insights
            <ArrowUpRight size={14} />
          </a>
        </motion.div>

        {/* Cards */}
        <div
          style={{ display: 'grid', gap: '16px' }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {POSTS.map((post, i) => {
            const Icon = post.icon
            return (
              <motion.article
                key={i}
                className="card-hover"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.58, delay: i * 0.1, ease }}
                style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                {/* Top area */}
                <div style={{
                  height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#EEF7F2', borderBottom: '1px solid #E2EDE8',
                  flexShrink: 0,
                }}>
                  <div className="icon-box" style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#FFFFFF' }}>
                    <Icon size={24} color="#0A5C38" />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{
                    display: 'inline-block', marginBottom: '12px',
                    padding: '3px 10px', borderRadius: '999px', fontSize: '10.5px',
                    fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
                    background: 'rgba(10,92,56,0.06)', color: '#0A5C38',
                    border: '1px solid rgba(10,92,56,0.14)',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    width: 'fit-content',
                  }}>
                    {post.category}
                  </span>

                  <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: '15.5px', color: '#0C1A12',
                    letterSpacing: '-0.02em', lineHeight: 1.38,
                    marginBottom: '12px', flex: 1,
                  }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#6B7C74', lineHeight: 1.72, marginBottom: '20px' }}>
                    {post.excerpt}
                  </p>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '14px', borderTop: '1px solid #E2EDE8',
                    marginTop: 'auto',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9BB0A6' }}>
                      <Clock size={12} />
                      {post.readTime} · {post.date}
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#0A5C38' }}>
                      Read <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}