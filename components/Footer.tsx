'use client'

import { Mail, Phone, MapPin, Linkedin, MessageCircle } from 'lucide-react'

const SERVICES_LINKS = [
  'Business Strategy Consulting',
  'Growth Strategy Development',
  'AI Integration Consulting',
  'Business Process Automation',
  'Logistics Process Improvement',
  'Technology Consulting',
]

const COMPANY_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Insights', href: '#insights' },
  { label: 'Book Consultation', href: '#contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: '#0C1A12',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="dot-pattern"
        style={{ position: 'absolute', inset: 0, opacity: 0.06 }}
      />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main footer grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '40px',
            padding: '72px 0 48px',
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
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
                }}
              >
                <span
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '15px',
                    color: '#FFFFFF',
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
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
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
            </div>

            <p
              style={{
                fontSize: '13.5px',
                color: '#52655A',
                lineHeight: 1.75,
                marginBottom: '22px',
                maxWidth: '240px',
              }}
            >
              Premium business consulting for Pakistan and GCC markets.
              Strategy, AI, and operations.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                {
                  icon: MessageCircle,
                  href: 'https://wa.me/923235663592',
                  label: 'WhatsApp',
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#52655A',
                    textDecoration: 'none',
                    transition:
                      'background 0.22s, color 0.22s, border-color 0.22s',
                  }}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                marginBottom: '18px',
              }}
            >
              Services
            </h4>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {SERVICES_LINKS.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    style={{
                      fontSize: '13px',
                      color: '#52655A',
                      textDecoration: 'none',
                    }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                marginBottom: '18px',
              }}
            >
              Company
            </h4>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={{
                      fontSize: '13px',
                      color: '#52655A',
                      textDecoration: 'none',
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                marginBottom: '18px',
              }}
            >
              Contact
            </h4>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {[
                {
                  icon: Mail,
                  label: 'Email',
                  val: 'contactahmadirfan66@gmail.com',
                  href: 'mailto:contactahmadirfan66@gmail.com',
                },
                {
                  icon: Phone,
                  label: 'WhatsApp',
                  val: '+92 323 5663592',
                  href: 'https://wa.me/923235663592',
                },
                {
                  icon: MapPin,
                  label: 'Office',
                  val: 'Lahore, Pakistan',
                  href: '#',
                },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <c.icon
                    size={14}
                    color="#0A5C38"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />

                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#3A4F42',
                        marginBottom: '1px',
                        fontFamily: 'JetBrains Mono, monospace',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {c.label}
                    </div>

                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '13px',
                        color: '#52655A',
                        textDecoration: 'none',
                        wordBreak: 'break-all',
                      }}
                    >
                      {c.val}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '22px',
                padding: '12px 14px',
                borderRadius: '9px',
                background: 'rgba(10,92,56,0.12)',
                border: '1px solid rgba(10,92,56,0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#4DB877',
                  marginBottom: '4px',
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                GCC Expansion
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: '#52655A',
                  lineHeight: 1.6,
                }}
              >
                Serving Saudi Arabia, UAE, Qatar, Bahrain, Kuwait &amp; Oman
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.055)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            padding: '22px 0 28px',
          }}
        >
          <p style={{ fontSize: '12.5px', color: '#3A4F42' }}>
            © {year} BlackMont Consulting. All rights reserved. Lahore,
            Pakistan.
          </p>

          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service'].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: '12px',
                  color: '#3A4F42',
                  textDecoration: 'none',
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}