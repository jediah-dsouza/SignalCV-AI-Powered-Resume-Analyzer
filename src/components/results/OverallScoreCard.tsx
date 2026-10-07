import type { ResumeAnalysis } from '../../services/contracts'

export function OverallScoreCard({ analysis }: { analysis: ResumeAnalysis }) {
  return <section className="results-card overall-score-card" aria-labelledby="overall-score-title"><div><p className="eyebrow">Overall resume score</p><h2 id="overall-score-title"><span>{analysis.overallScore}</span><small>/ 100</small></h2><p className="overall-score-card__context">A directional score across content, structure, experience, skills, relevance, and readability. It is guidance for your next revision, not a promise of an outcome.</p></div><div className="score-ring" aria-label={`Overall resume score ${analysis.overallScore} out of 100`}><span>{analysis.overallScore}</span><small>out of 100</small></div></section>
}
