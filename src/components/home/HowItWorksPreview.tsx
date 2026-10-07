import { Link } from 'react-router-dom'
import { PageContainer } from '../layout/PageContainer'

const steps = [
  { number: '01', title: 'Upload', description: 'Bring your PDF or supported Word resume.' },
  { number: '02', title: 'Parse', description: 'See your experience and skills in a clear structure.' },
  { number: '03', title: 'Analyze', description: 'Get scores, strengths, gaps, and relevant keywords.' },
  { number: '04', title: 'Improve', description: 'Use prioritized suggestions to make your next edit count.' },
]

export function HowItWorksPreview() {
  return (
    <section className="home-section home-section--workflow" aria-labelledby="workflow-title">
      <PageContainer>
        <div className="section-intro">
          <p className="eyebrow">How it works</p>
          <h2 id="workflow-title">From document to direction in four steps.</h2>
        </div>
        <ol className="home-workflow">
          {steps.map((step) => (
            <li className="home-workflow__step" key={step.number}>
              <span className="home-workflow__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        <Link className="text-link" to="/how-it-works">Explore the full workflow <span aria-hidden="true">↗</span></Link>
      </PageContainer>
    </section>
  )
}
