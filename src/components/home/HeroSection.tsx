import { Link } from 'react-router-dom'
import { PageContainer } from '../layout/PageContainer'
import { ProductPreview } from './ProductPreview'

export function HeroSection() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <PageContainer className="home-hero__grid">
        <div className="home-hero__copy">
          <p className="eyebrow">AI-powered resume clarity</p>
          <h1 id="home-title">Make your resume easier to understand — and harder to overlook.</h1>
          <p className="home-hero__description">
            Upload your resume to see what is working, where it is unclear, how it aligns with a target role, and which improvements matter most.
          </p>
          <div className="home-hero__actions">
            <Link className="button button--primary" to="/analyzer">Analyze my resume <span aria-hidden="true">↗</span></Link>
            <Link className="button button--secondary" to="/how-it-works">See how it works</Link>
          </div>
          <p className="home-hero__note"><span className="home-hero__note-dot" aria-hidden="true" />No sign-up required to get started</p>
        </div>
        <ProductPreview />
      </PageContainer>
    </section>
  )
}
