import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { SeoMetadata } from '../components/layout/SeoMetadata'

const workflowSteps = [
  { number: '01', title: 'Upload your resume', description: 'Start with a PDF or supported Word document. The workspace validates the file before doing anything else.' },
  { number: '02', title: 'Resume parsing', description: 'The parser organizes contact details, summary, experience, education, skills, projects, and additional sections for your review.' },
  { number: '03', title: 'Add a job description', description: 'Paste the role context you care about. You can also continue without one when you want a resume-only review.' },
  { number: '04', title: 'Analysis and scoring', description: 'Review a directional score across content, structure, experience, skills, relevance, and readability.' },
  { number: '05', title: 'Keyword matching', description: 'Compare the structured resume with the target role to see matched, missing, and related terms.' },
  { number: '06', title: 'Improvement recommendations', description: 'Turn the review into focused priorities and practical next edits, with strengths and weaknesses in view.' },
  { number: '07', title: 'Resume improvement chatbot', description: 'Ask contextual questions about your summary, bullets, skills, score, relevance, or missing keywords.' },
]

export function HowItWorksPage() {
  return (
    <div className="page how-page">
      <SeoMetadata title="How It Works — SignalCV Resume Analyzer" description="See how SignalCV validates, parses, analyzes, and compares your resume before turning findings into practical next steps." />
      <PageContainer>
        <header className="page-heading how-page__heading" aria-labelledby="how-title">
          <p className="eyebrow">How it works</p>
          <h1 id="how-title">A clearer path from resume to next edit.</h1>
          <p className="page-heading__description">
            SignalCV turns one overwhelming document into a structured review, a focused comparison, and practical questions you can act on.
          </p>
          <div className="how-page__actions">
            <Link className="button button--primary" to="/analyzer">Start with the analyzer <span aria-hidden="true">↗</span></Link>
            <a className="text-link" href="#workflow">See the seven steps <span aria-hidden="true">↓</span></a>
          </div>
        </header>

        <section id="workflow" className="workflow-section" aria-labelledby="workflow-title">
          <div className="section-intro">
            <p className="eyebrow">The workflow</p>
            <h2 id="workflow-title">Understand first. Improve with intent.</h2>
            <p>Each step keeps the next decision visible, so you can review the signal before moving forward.</p>
          </div>
          <ol className="workflow-list">
            {workflowSteps.map((step) => (
              <li key={step.number} className="workflow-item">
                <span className="workflow-item__number" aria-hidden="true">{step.number}</span>
                <Card className="workflow-item__card">
                  <p className="eyebrow">Step {step.number}</p>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section className="how-trust" aria-labelledby="trust-title">
          <div>
            <p className="eyebrow">A deliberate starting point</p>
            <h2 id="trust-title">You stay in control of the review.</h2>
          </div>
          <div className="how-trust__copy">
            <p>Resume content and analysis context stay in this transient workspace. You review the parsed information before analysis, and the product does not save it to browser storage.</p>
            <p><strong>Important:</strong> the current parser, scoring, keyword matching, and chatbot are deterministic mock services for this product phase. They do not connect to a real AI provider or backend.</p>
          </div>
        </section>

        <section className="how-cta" aria-labelledby="how-cta-title">
          <p className="eyebrow">Ready when you are</p>
          <h2 id="how-cta-title">Bring the resume you already have.</h2>
          <p>Start with a structured review, then decide which signal deserves your attention first.</p>
          <Link className="button button--primary" to="/analyzer">Analyze my resume <span aria-hidden="true">↗</span></Link>
        </section>
      </PageContainer>
    </div>
  )
}
