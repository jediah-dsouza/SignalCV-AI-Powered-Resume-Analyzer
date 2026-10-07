import type { CategoryScore } from '../../services/contracts'

export function ScoreBreakdown({ categories }: { categories: CategoryScore[] }) {
  return <section className="results-card" aria-labelledby="score-breakdown-title"><div className="results-section-heading"><p className="eyebrow">Six signals</p><h2 id="score-breakdown-title">Score breakdown</h2><p>Each score is a directional view of one part of the resume, with the returned interpretation beside it.</p></div><div className="score-list">{categories.map((category) => <div className="score-row" key={category.id}><div className="score-row__label"><strong>{category.label}</strong><span>{category.score}/100</span></div><progress max="100" value={category.score} aria-label={`${category.label} score ${category.score} out of 100`}>{category.score}</progress><p>{category.interpretation}</p></div>)}</div></section>
}
