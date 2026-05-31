import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Services from '@/components/Services'
import Industries from '@/components/Industries'
import WhyBlackMont from '@/components/WhyBlackMont'
import Process from '@/components/Process'
import Founder from '@/components/Founder'
import Insights from '@/components/Insights'
import FAQ from '@/components/FAQ'
import CTABanner from '@/components/CTABanner'
import ConsultationForm from '@/components/ConsultationForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <TrustBar />
      <Services />
      <Industries />
      <WhyBlackMont />
      <Process />
      <Founder />
      <Insights />
      <FAQ />
      <CTABanner />
      <ConsultationForm />
      <Footer />
    </main>
  )
}