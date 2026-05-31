'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle2, Sparkles, User, Building2, Globe, Phone, Mail, MapPin, MessageSquare, Briefcase, Users } from 'lucide-react'

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  companyName: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  website: z.union([z.string().url('Enter a valid URL (include https://)'), z.literal('')]).optional(),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  whatsapp: z.string().min(7, 'WhatsApp number is required'),
  industry: z.string().min(1, 'Please select your industry'),
  employees: z.string().optional(),
  revenue: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  description: z.string().min(20, 'Please provide at least 20 characters describing your requirements'),
})

type FormData = z.infer<typeof schema>

const INDUSTRIES = [
  'Logistics & Transportation', 'Supply Chain & Distribution', 'Restaurants & Food Service',
  'Wholesale & Retail', 'Manufacturing', 'Warehousing & 3PL',
  'Family-Owned Business', 'Growth-Stage Company', 'Technology / Startup', 'Other',
]

const SERVICES = [
  'Business Strategy Consulting', 'Growth Strategy Development', 'Business Process Optimization',
  'Operational Excellence Consulting', 'Organizational Development', 'Performance Improvement Consulting',
  'AI Integration Consulting', 'AI Workflow Design', 'Business Process Automation',
  'Corporate Website Development', 'Website Performance Optimization', 'Website Analytics & Reporting',
  'Logistics Process Improvement', 'Systems Integration Consulting', 'Technology Consulting',
  'Not sure — need guidance',
]

const EMPLOYEES = ['Under 20', '20–50', '51–100', '101–250', '251–500', '500+']
const REVENUE = ['Under $1M', '$1M – $5M', '$5M – $20M', '$20M – $50M', '$50M – $100M', '$100M+']

const ease = [0.22, 1, 0.36, 1]

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
      {children}
      {required && <span style={{ color: '#0A5C38', marginLeft: '3px' }}>*</span>}
    </label>
  )
}

export default function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    // Replace with your actual form submission logic (API route, email service, CRM, etc.)
    console.log('Form data:', data)
    await new Promise((r) => setTimeout(r, 1600))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="contact" className="section" style={{ background: '#F8FAF8' }}>
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="card"
            style={{ maxWidth: '460px', margin: '0 auto', padding: '56px 40px', textAlign: 'center' }}
          >
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#0A5C38',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 6px 24px rgba(10,92,56,0.25)',
            }}>
              <CheckCircle2 size={28} color="#FFFFFF" />
            </div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: '#0C1A12', letterSpacing: '-0.025em', marginBottom: '12px' }}>
              Request Submitted
            </h3>
            <p style={{ fontSize: '15px', color: '#6B7C74', lineHeight: 1.7, marginBottom: '28px' }}>
              Thank you for reaching out. Our team will review your request and contact you within 24 hours to schedule your consultation.
            </p>
            <a href="https://wa.me/923235663592" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
              Continue on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="section" style={{ background: '#F8FAF8' }}>
      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: '48px' }}
        >
          <span className="section-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={11} /> Book Your Consultation
            </span>
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
            Start the Conversation
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7C74', maxWidth: '500px', lineHeight: 1.72 }}>
            Tell us about your business and goals. We will review your request and reach out within
            24 hours to schedule a focused strategy discussion.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ padding: '36px 32px' }}>

              {/* Section: You */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #E2EDE8' }}>
                  <User size={14} color="#0A5C38" />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', fontWeight: 600, color: '#0A5C38', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Your Information
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <FieldLabel required>Full Name</FieldLabel>
                    <input {...register('fullName')} className={`form-input ${errors.fullName ? 'form-input-err' : ''}`} placeholder="Ahmed Al-Rashidi" />
                    {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
                  </div>
                  <div className="form-group">
                    <FieldLabel required>Job Title</FieldLabel>
                    <input {...register('jobTitle')} className={`form-input ${errors.jobTitle ? 'form-input-err' : ''}`} placeholder="Chief Executive Officer" />
                    {errors.jobTitle && <span className="form-error">{errors.jobTitle.message}</span>}
                  </div>
                  <div className="form-group">
                    <FieldLabel required>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={11} /> Email Address</span>
                    </FieldLabel>
                    <input {...register('email')} type="email" className={`form-input ${errors.email ? 'form-input-err' : ''}`} placeholder="you@company.com" />
                    {errors.email && <span className="form-error">{errors.email.message}</span>}
                  </div>
                  <div className="form-group">
                    <FieldLabel required>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={11} /> WhatsApp Number</span>
                    </FieldLabel>
                    <input {...register('whatsapp')} className={`form-input ${errors.whatsapp ? 'form-input-err' : ''}`} placeholder="+966 50 000 0000" />
                    {errors.whatsapp && <span className="form-error">{errors.whatsapp.message}</span>}
                  </div>
                </div>
              </div>

              {/* Section: Company */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #E2EDE8' }}>
                  <Building2 size={14} color="#0A5C38" />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', fontWeight: 600, color: '#0A5C38', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Company Details
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <FieldLabel required>Company Name</FieldLabel>
                    <input {...register('companyName')} className={`form-input ${errors.companyName ? 'form-input-err' : ''}`} placeholder="Acme Logistics Co." />
                    {errors.companyName && <span className="form-error">{errors.companyName.message}</span>}
                  </div>
                  <div className="form-group">
                    <FieldLabel>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Globe size={11} /> Website</span>
                    </FieldLabel>
                    <input {...register('website')} type="url" className={`form-input ${errors.website ? 'form-input-err' : ''}`} placeholder="https://yourcompany.com" />
                    {errors.website && <span className="form-error">{errors.website.message}</span>}
                  </div>
                  <div className="form-group">
                    <FieldLabel required>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={11} /> Industry</span>
                    </FieldLabel>
                    <select {...register('industry')} className={`form-input ${errors.industry ? 'form-input-err' : ''}`}>
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    {errors.industry && <span className="form-error">{errors.industry.message}</span>}
                  </div>
                  <div className="form-group">
                    <FieldLabel>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={11} /> Number of Employees</span>
                    </FieldLabel>
                    <select {...register('employees')} className="form-input">
                      <option value="">Select range</option>
                      {EMPLOYEES.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <FieldLabel>Annual Revenue (USD)</FieldLabel>
                    <select {...register('revenue')} className="form-input">
                      <option value="">Select range</option>
                      {REVENUE.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <FieldLabel>Phone Number</FieldLabel>
                    <input {...register('phone')} className="form-input" placeholder="+966 50 000 0000" />
                  </div>
                </div>
              </div>

              {/* Section: Requirements */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #E2EDE8' }}>
                  <MessageSquare size={14} color="#0A5C38" />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', fontWeight: 600, color: '#0A5C38', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Project Requirements
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <FieldLabel required>Service of Interest</FieldLabel>
                    <select {...register('service')} className={`form-input ${errors.service ? 'form-input-err' : ''}`}>
                      <option value="">Select a service</option>
                      {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.service && <span className="form-error">{errors.service.message}</span>}
                  </div>
                  <div className="form-group">
                    <FieldLabel required>Describe Your Business Challenge or Goal</FieldLabel>
                    <textarea
                      {...register('description')}
                      rows={5}
                      className={`form-input ${errors.description ? 'form-input-err' : ''}`}
                      style={{ resize: 'none' }}
                      placeholder="Tell us about your current challenges, what you want to achieve, and any specific requirements or context that will help us understand your situation..."
                    />
                    {errors.description && <span className="form-error">{errors.description.message}</span>}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: '100%', fontSize: '15px', padding: '15px 28px',
                  opacity: submitting ? 0.75 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  justifyContent: 'center',
                }}
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '17px', height: '17px', borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.25)',
                        borderTopColor: '#FFFFFF', flexShrink: 0,
                      }}
                    />
                    Submitting Request...
                  </>
                ) : (
                  <>Submit Consultation Request <Send size={16} /></>
                )}
              </button>

              <p style={{ fontSize: '12px', color: '#9BB0A6', textAlign: 'center', marginTop: '14px', lineHeight: 1.6 }}>
                By submitting this form, you agree to be contacted by BlackMont Consulting. We respond within 24 hours on business days.
              </p>
            </form>
          </motion.div>

          {/* Side Info */}
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Contact info */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: '#0C1A12', marginBottom: '18px' }}>
                Direct Contact
              </div>
              {[
                { icon: Mail, label: 'Email', val: 'contactahmadirfan66@gmail.com', href: 'mailto:contactahmadirfan66@gmail.com' },
                { icon: Phone, label: 'WhatsApp', val: '+92 323 5663592', href: 'https://wa.me/923235663592' },
                { icon: MapPin, label: 'Location', val: 'Lahore, Pakistan', href: '#' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: i < 2 ? '14px' : '0' }}>
                  <div className="icon-box" style={{ width: '34px', height: '34px', flexShrink: 0 }}>
                    <c.icon size={15} color="#0A5C38" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#9BB0A6', marginBottom: '2px' }}>{c.label}</div>
                    <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ fontSize: '13.5px', color: '#374740', textDecoration: 'none', fontWeight: 500, wordBreak: 'break-all', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#0A5C38' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#374740' }}
                    >
                      {c.val}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* What to expect */}
            <div className="card" style={{ padding: '24px', background: '#EEF7F2', border: '1px solid rgba(10,92,56,0.14)' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: '#0C1A12', marginBottom: '16px' }}>
                What Happens Next
              </div>
              {[
                'We review your submission within 24 hours',
                'A senior consultant contacts you to discuss',
                'We schedule a focused discovery call',
                'You receive a tailored proposal',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: i < 3 ? '12px' : '0' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: '#0A5C38', color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '13.5px', color: '#374740', lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>

            {/* Confidentiality */}
            <div className="card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={16} color="#0A5C38" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0C1A12', marginBottom: '4px' }}>
                    Confidentiality Assured
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#6B7C74', lineHeight: 1.65 }}>
                    All information shared is treated with strict confidentiality. NDAs available upon request.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}