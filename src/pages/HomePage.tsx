import { AnalysisPreview } from '../components/home/AnalysisPreview'
import { ChatbotPreview } from '../components/home/ChatbotPreview'
import { FinalCTASection } from '../components/home/FinalCTASection'
import { HeroSection } from '../components/home/HeroSection'
import { HowItWorksPreview } from '../components/home/HowItWorksPreview'
import { TrustSection } from '../components/home/TrustSection'
import { ValuePropositionSection } from '../components/home/ValuePropositionSection'
import { SeoMetadata } from '../components/layout/SeoMetadata'

export function HomePage() {
  return (
    <div className="home-page">
      <SeoMetadata title="SignalCV — Clear next steps for your resume" description="Analyze your resume, understand its strengths and gaps, compare it with a target role, and get actionable improvement suggestions." />
      <HeroSection />
      <ValuePropositionSection />
      <HowItWorksPreview />
      <AnalysisPreview />
      <ChatbotPreview />
      <TrustSection />
      <FinalCTASection />
    </div>
  )
}
