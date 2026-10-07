import { Card } from '../ui/Card'

const categoryScores = [
  { label: 'Content', score: 88 },
  { label: 'Structure', score: 76 },
  { label: 'Relevance', score: 68 },
]

export function ProductPreview() {
  return (
    <div className="product-preview" role="img" aria-label="Illustrative product preview, not an actual user analysis">
      <div className="product-preview__glow" aria-hidden="true" />
      <Card className="product-preview__card">
        <div className="preview-label-row">
          <span className="preview-label">Illustrative analysis preview</span>
          <span className="preview-status"><span aria-hidden="true" />Ready to improve</span>
        </div>
        <div className="preview-score-row">
          <div className="score-ring score-ring--preview" aria-hidden="true"><strong>82</strong><span>/100</span></div>
          <div>
            <p className="preview-overline">Overall resume signal</p>
            <h2>Strong foundation</h2>
            <p className="preview-muted">A sample of how feedback can be organized.</p>
          </div>
        </div>
        <div className="preview-category-list" role="list" aria-label="Sample category scores">
          {categoryScores.map((category) => (
            <div className="preview-category" role="listitem" key={category.label}>
              <div><span>{category.label}</span><strong>{category.score}</strong></div>
              <div className="preview-bar" aria-hidden="true"><span style={{ width: `${category.score}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="preview-priority">
          <span className="preview-priority__icon" aria-hidden="true">↗</span>
          <div><span className="preview-overline">Top priority</span><strong>Make two experience bullets more specific.</strong></div>
        </div>
      </Card>
      <div className="preview-float preview-float--keyword" aria-hidden="true"><span>Keywords</span><strong>14 matched</strong></div>
      <div className="preview-float preview-float--insight" aria-hidden="true"><span>AI insight</span><strong>Clearer wins, next</strong></div>
    </div>
  )
}
