import { PageContainer } from '../layout/PageContainer'

const capabilities = [
  {
    number: '01',
    title: 'Resume parsing',
    description: 'Extracts your experience, skills, education, and projects into a structured view you can review.',
    tone: 'mint',
  },
  {
    number: '02',
    title: 'AI-powered analysis',
    description: 'Evaluates clarity, structure, content, and readability with feedback shaped around your resume.',
    tone: 'blue',
  },
  {
    number: '03',
    title: 'Keyword matching',
    description: 'Compares your resume with a job description to surface relevant terms and potential gaps.',
    tone: 'sand',
  },
  {
    number: '04',
    title: 'Actionable improvements',
    description: 'Turns observations into prioritized recommendations and suggested wording you can use.',
    tone: 'ink',
  },
]

export function ValuePropositionSection() {
  return (
    <section className="home-section home-section--capabilities" aria-labelledby="capabilities-title">
      <PageContainer>
        <div className="section-intro section-intro--split">
          <div><p className="eyebrow">What you get</p><h2 id="capabilities-title">A resume review built around decisions, not noise.</h2></div>
          <p>Understand the signal in your resume, then focus on the changes most likely to make it clearer and more relevant.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className={`capability-card capability-card--${capability.tone}`} key={capability.number}>
              <span className="capability-card__number">{capability.number}</span>
              <div className="capability-card__icon" aria-hidden="true">{capability.number === '01' ? '▤' : capability.number === '02' ? '◒' : capability.number === '03' ? '⌁' : '↗'}</div>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
