import { Link } from 'react-router-dom'
import { PageContainer } from '../layout/PageContainer'

export function FinalCTASection() {
  return (
    <section className="home-section home-section--final-cta" aria-labelledby="final-cta-title">
      <PageContainer>
        <div className="final-cta">
          <div><p className="eyebrow">Your next edit can be clearer</p><h2 id="final-cta-title">Start with the resume you already have.</h2><p>Get a structured view of what is strong, what is missing, and what to improve next.</p></div>
          <Link className="button button--accent" to="/analyzer">Analyze my resume <span aria-hidden="true">↗</span></Link>
        </div>
      </PageContainer>
    </section>
  )
}
