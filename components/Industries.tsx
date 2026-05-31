'use client'

import { motion } from 'framer-motion'
import {
  Truck, Package, Coffee, ShoppingBag,
  Factory, Warehouse, Building2, Rocket
} from 'lucide-react'

const INDUSTRIES = [
  { icon: Truck, name: 'Logistics & Transportation', desc: 'Route optimization, fleet management, and delivery transformation for logistics companies.' },
  { icon: Package, name: 'Supply Chain & Distribution', desc: 'End-to-end supply chain visibility, demand planning, and distribution efficiency.' },
  { icon: Coffee, name: 'Restaurants & Cafés', desc: 'Kitchen operations, inventory management, and multi-location expansion systems.' },
  { icon: ShoppingBag, name: 'Wholesale & Retail', desc: 'Inventory optimization, demand forecasting, and omnichannel distribution.' },
  { icon: Factory, name: 'Manufacturing', desc: 'Production optimization, quality systems, and technology integration for manufacturers.' },
  { icon: Warehouse, name: 'Warehousing & 3PL', desc: 'Warehouse automation, throughput optimization, and operational technology.' },
  { icon: Building2, name: 'Family-Owned Businesses', desc: 'Governance structures, modernization roadmaps, and growth planning for family enterprises.' },
  { icon: Rocket, name: 'Growth-Stage Companies', desc: 'Scaling infrastructure, market expansion, and operational foundations for rapid growth.' },
]

const ease = [0.22, 1, 0.36, 1]

export default function Industries() {
  return (
    <section id="industries" className="section" style={{ background: '#F8FAF8' }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: '52px' }}
        >
          <span className="section-label">Industries We Serve</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
            Deep Industry Expertise
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7C74', maxWidth: '500px', lineHeight: 1.72 }}>
            We bring specialized knowledge to each sector we serve, combining cross-industry
            innovation with deep operational understanding.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{ display: 'grid', gap: '14px' }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon
            return (
              <motion.div
                key={i}
                className="card-hover"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.07, ease }}
                style={{ padding: '24px', background: '#FFFFFF' }}
              >
                <div className="icon-box" style={{ marginBottom: '16px' }}>
                  <Icon size={19} color="#0A5C38" />
                </div>

                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  fontSize: '14.5px', color: '#0C1A12',
                  letterSpacing: '-0.015em', lineHeight: 1.3, marginBottom: '10px',
                }}>
                  {ind.name}
                </h3>

                <p style={{ fontSize: '13px', color: '#6B7C74', lineHeight: 1.7 }}>
                  {ind.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* GCC Note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className="card"
          style={{ marginTop: '32px', padding: '22px 28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
        >
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: '#0C1A12', marginBottom: '4px' }}>
              Serving Pakistan & the GCC
            </div>
            <div style={{ fontSize: '13.5px', color: '#6B7C74' }}>
              Currently operating in Pakistan with active expansion into Saudi Arabia, UAE, Qatar, Bahrain, Kuwait, and Oman.
            </div>
          </div>
          <a href="#contact" className="btn-primary" style={{ fontSize: '13px', flexShrink: 0 }}>
            Start a Conversation
          </a>
        </motion.div>
      </div>
    </section>
  )
}