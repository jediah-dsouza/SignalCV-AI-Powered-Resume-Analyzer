import { PageContainer } from '../layout/PageContainer'

const trustPoints = [
  { label: 'Clear by design', detail: 'Structured feedback instead of an opaque wall of text.' },
  { label: 'Actionable by default', detail: 'Recommendations point to the next useful edit.' },
  { label: 'Privacy-conscious', detail: 'Resume information is treated as sensitive and transient.' },
  { label: 'Transparent workflow', detail: 'See how your document moves from upload to insight.' },
]

export function TrustSection() {
  return (
    <section className="home-section home-section--trust" aria-labelledby="trust-title">
      <PageContainer>
        <div className="trust-section__intro"><p className="eyebrow">Built for clarity</p><h2 id="trust-title">Useful intelligence, without the black box.</h2><p>The analyzer is designed to help you make informed edits — not promise a hiring outcome.</p></div>
        <div className="trust-grid">
          {trustPoints.map((point) => <div className="trust-point" key={point.label}><span className="trust-point__mark" aria-hidden="true">✓</span><div><h3>{point.label}</h3><p>{point.detail}</p></div></div>)}
        </div>
      </PageContainer>
    </section>
  )
}
