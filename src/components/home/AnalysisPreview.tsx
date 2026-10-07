import { PageContainer } from '../layout/PageContainer'
import { Card } from '../ui/Card'

const categories = [
  { label: 'Content', score: 88 },
  { label: 'Structure', score: 76 },
  { label: 'Experience', score: 84 },
  { label: 'Readability', score: 91 },
]

export function AnalysisPreview() {
  return (
    <section className="home-section home-section--analysis" aria-labelledby="analysis-preview-title">
      <PageContainer className="analysis-preview__grid">
        <div className="analysis-preview__copy">
          <p className="eyebrow">A better review surface</p>
          <h2 id="analysis-preview-title">See the whole picture, then know where to start.</h2>
          <p>Instead of a wall of AI-generated text, the future results view will organize your score, strengths, priorities, and recommendations into a report you can act on.</p>
          <ul className="check-list">
            <li><span aria-hidden="true">✓</span> Overall score with context</li>
            <li><span aria-hidden="true">✓</span> Category-level feedback</li>
            <li><span aria-hidden="true">✓</span> Prioritized improvement suggestions</li>
          </ul>
        </div>
        <Card className="analysis-preview-card">
          <div className="analysis-preview-card__header"><div><span className="preview-overline">Sample report</span><h3>Resume analysis</h3></div><span className="preview-badge">Preview</span></div>
          <div className="analysis-preview-card__score"><div className="score-ring score-ring--large" role="img" aria-label="Illustrative score 82 out of 100"><strong>82</strong><span>/100</span></div><div><strong>Good foundation</strong><p>Three focused edits could improve clarity.</p></div></div>
          <div className="analysis-category-grid">
            {categories.map((category) => <div className="analysis-category" key={category.label}><span>{category.label}</span><strong>{category.score}</strong></div>)}
          </div>
          <div className="analysis-preview-card__columns">
            <div><span className="preview-overline">Strengths</span><ul><li>Clear role progression</li><li>Relevant technical skills</li></ul></div>
            <div><span className="preview-overline">Priorities</span><ul><li>Add measurable outcomes</li><li>Tighten summary language</li></ul></div>
          </div>
        </Card>
      </PageContainer>
    </section>
  )
}
