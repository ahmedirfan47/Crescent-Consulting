'use client'

import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Send, CheckCircle2, Sparkles, User, Building, Globe, Briefcase, MapPin, MessageSquare, Mail, Phone } from 'lucide-react'

const SERVICE_OPTIONS = [
  'AI Transformation', 'Workflow Automation', 'Supply Chain Optimization',
  'Logistics Excellence', 'Restaurant Operations', 'Enterprise Growth Strategy',
  'Business Infrastructure', 'Digital Transformation',
]

const INDUSTRY_OPTIONS = [
  'Logistics & Transportation', 'Supply Chain & Distribution', 'Restaurants & Food Service',
  'Wholesale & Retail', 'Manufacturing', 'Warehousing & 3PL',
  'Startup / Scale-up', 'Enterprise / Fortune 500', 'Other',
]

interface FormState {
  fullName: string; companyName: string; position: string; website: string;
  email: string; whatsapp: string; industry: string; country: string;
  services: string[]; comments: string;
}

const INIT: FormState = {
  fullName: '', companyName: '', position: '', website: '',
  email: '', whatsapp: '', industry: '', country: '', services: [], comments: '',
}

export default function ExecutiveForm() {
  const [form, setForm] = useState<FormState>(INIT)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const toggleService = (s: string) =>
    setForm((p) => ({
      ...p,
      services: p.services.includes(s) ? p.services.filter((x) => x !== s) : [...p.services, s],
    }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="consultation" style={{ padding: '128px 0' }}>
        <div className="max-w-site mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="card"
            style={{ maxWidth: '420px', margin: '0 auto', padding: '56px 40px', textAlign: 'center' }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #C9A84C, #E8C878)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(201,168,76,0.25)',
            }}>
              <CheckCircle2 size={26} color="#0A0A0A" />
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.025em', color: '#fafafa', marginBottom: '12px' }}>
              Request Received
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#52525b' }}>
              Our executive team will review your inquiry and contact you within 24 hours to schedule your consultation.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  const SectionHeader = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <Icon size={14} color="#C9A84C" />
      <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
    </div>
  )

  return (
    <section id="consultation" style={{ padding: '128px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.26 }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,168,76,0.045) 0%, transparent 58%)',
      }} />

      <div className="max-w-site mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ marginBottom: '56px' }}
        >
          <span className="badge" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <Sparkles size={11} />
            Exclusive Access
          </span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Book Executive Consultation
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.72, color: '#52525b', maxWidth: '480px' }}>
            Schedule a confidential strategy session with our senior consulting team to 
            explore how BlackMont can transform your enterprise.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
          style={{ maxWidth: '680px' }}
        >
          <form onSubmit={handleSubmit} className="card" style={{ padding: '40px 36px' }}>

            {/* Personal */}
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader icon={User} label="Personal Information" />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name <span style={{ color: '#C9A84C' }}>*</span></label>
                  <input required className="form-input" placeholder="John Smith" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Current Position <span style={{ color: '#C9A84C' }}>*</span></label>
                  <input required className="form-input" placeholder="Chief Executive Officer" value={form.position} onChange={(e) => set('position', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={11} /> Professional Email <span style={{ color: '#C9A84C' }}>*</span>
                    </span>
                  </label>
                  <input required type="email" className="form-input" placeholder="john@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Phone size={11} /> WhatsApp Number <span style={{ color: '#C9A84C' }}>*</span>
                    </span>
                  </label>
                  <input required className="form-input" placeholder="+1 (555) 000-0000" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="divider" style={{ marginBottom: '32px' }} />

            {/* Company */}
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader icon={Building} label="Company Details" />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Company Name <span style={{ color: '#C9A84C' }}>*</span></label>
                  <input required className="form-input" placeholder="Acme Corporation" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Globe size={11} /> Website URL
                    </span>
                  </label>
                  <input type="url" className="form-input" placeholder="https://yourcompany.com" value={form.website} onChange={(e) => set('website', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Briefcase size={11} /> Industry <span style={{ color: '#C9A84C' }}>*</span>
                    </span>
                  </label>
                  <select required className="form-input" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
                    <option value="">Select Industry</option>
                    {INDUSTRY_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                  </select>
                </div>
                <div>
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={11} /> Country / Region <span style={{ color: '#C9A84C' }}>*</span>
                    </span>
                  </label>
                  <input required className="form-input" placeholder="United States" value={form.country} onChange={(e) => set('country', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="divider" style={{ marginBottom: '32px' }} />

            {/* Services */}
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader icon={Sparkles} label="Services of Interest" />
              <p style={{ fontSize: '12px', color: '#3f3f46', marginBottom: '14px' }}>Select all that apply to your business needs</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SERVICE_OPTIONS.map((s) => {
                  const active = form.services.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      style={{
                        padding: '9px 11px', borderRadius: '9px', fontSize: '12px',
                        fontWeight: 500, textAlign: 'left', cursor: 'pointer',
                        transition: 'all 0.22s ease',
                        border: active ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.07)',
                        background: active ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.025)',
                        color: active ? '#C9A84C' : '#52525b',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="divider" style={{ marginBottom: '32px' }} />

            {/* Comments */}
            <div style={{ marginBottom: '32px' }}>
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MessageSquare size={11} /> Business Requirements & Goals
                </span>
              </label>
              <textarea
                rows={4}
                className="form-input"
                style={{ resize: 'none' }}
                placeholder="Describe your business challenges, goals, or areas where you are seeking transformation..."
                value={form.comments}
                onChange={(e) => set('comments', e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                width: '100%', fontSize: '14px', padding: '14px 24px',
                opacity: submitting ? 0.75 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      border: '2px solid rgba(10,10,10,0.25)',
                      borderTopColor: '#0A0A0A', flexShrink: 0,
                    }}
                  />
                  Submitting Request...
                </>
              ) : (
                <>Submit Consultation Request <Send size={15} /></>
              )}
            </button>

            <p style={{ fontSize: '12px', color: '#3f3f46', textAlign: 'center', marginTop: '16px' }}>
              Protected by enterprise-grade confidentiality protocols. We respond within 24 hours.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}