
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'About', href: '#about' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 44)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(255,255,255,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'none',
        borderBottom: scrolled
          ? '1px solid #E2EDE8'
          : '1px solid transparent',
        boxShadow: scrolled
          ? '0 1px 24px rgba(10,92,56,0.06)'
          : 'none',
        transition:
          'background 0.35s, border-color 0.35s, box-shadow 0.35s, backdrop-filter 0.35s',
      }}
    >
      <div className="wrap">
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                background: '#0A5C38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 10px rgba(10,92,56,0.22)',
              }}
            >
              <span
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                B
              </span>
            </div>

            <div style={{ lineHeight: 1 }}>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#0C1A12',
                  letterSpacing: '-0.025em',
                }}
              >
                BlackMont
              </div>

              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#0A5C38',
                  letterSpacing: '0.2em',
                  marginTop: '3px',
                }}
              >
                CONSULTING
              </div>
            </div>
          </a>

          {/* Desktop Links */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  style={{
                    color: '#6B7C74',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                    transition: 'color 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color =
                      '#0A5C38'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color =
                      '#6B7C74'
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="btn-primary"
              style={{ fontSize: '13px', padding: '10px 20px' }}
            >
              Book Consultation
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#374740',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                '#EEF7F2'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              overflow: 'hidden',
              background: '#FFFFFF',
              borderTop: '1px solid #E2EDE8',
            }}
          >
            <div
              className="wrap"
              style={{
                paddingTop: '20px',
                paddingBottom: '24px',
              }}
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block',
                    color: '#374740',
                    fontSize: '15px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    padding: '11px 0',
                    borderBottom: '1px solid #F2F5F2',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color =
                      '#0A5C38'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color =
                      '#374740'
                  }}
                >
                  {link.label}
                </a>
              ))}

              <div style={{ marginTop: '20px' }}>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

