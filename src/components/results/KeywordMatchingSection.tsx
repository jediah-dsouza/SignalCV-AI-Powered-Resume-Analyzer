import type { KeywordMatch } from '../../services/contracts'
import type { KeywordStatus } from '../../app/analysisWorkflow'

interface KeywordMatchingSectionProps {
  jobDescription: string
  status: KeywordStatus
  match: KeywordMatch | null
  error: string | null
  onRetry: () => void
}

function KeywordList({ label, values, tone }: { label: string; values: string[]; tone: 'matched' | 'missing' | 'related' }) {
  return <section className={`keyword-group keyword-group--${tone}`} aria-labelledby={`keyword-${tone}-title`}><h3 id={`keyword-${tone}-title`}>{label} <span>({values.length})</span></h3>{values.length ? <ul>{values.map((value) => <li key={value}>{value}</li>)}</ul> : <p>No keywords in this group were returned.</p>}</section>
}

export function KeywordMatchingSection({ jobDescription, status, match, error, onRetry }: KeywordMatchingSectionProps) {
  return <section className="results-card keyword-matching" aria-labelledby="keyword-matching-title"><div className="results-section-heading"><p className="eyebrow">Targeted comparison</p><h2 id="keyword-matching-title">Keyword matching</h2><p>{jobDescription.trim() ? 'A focused comparison between the job description and the structured resume review.' : 'Add a job description to compare the resume against a specific role.'}</p></div>{!jobDescription.trim() && <p className="keyword-state">Job-specific keyword matching requires a target job description. Your resume score above remains available without one.</p>}{jobDescription.trim() && status === 'idle' && !match && <p className="keyword-state" role="status">Keyword matching is ready when a target job description is available.</p>}{status === 'matching' && <p className="keyword-state" role="status" aria-live="polite">Matching resume signals to the job description…</p>}{status === 'error' && <div className="keyword-state keyword-state--error" role="alert"><p>{error ?? 'Keyword matching could not be completed.'}</p><button className="text-link" type="button" onClick={onRetry}>Retry keyword matching <span aria-hidden="true">↗</span></button></div>}{status === 'empty' && match && <p className="keyword-state">No comparable keyword terms were returned for this job description.</p>}{(status === 'success' || status === 'empty') && match && <><div className="keyword-summary"><strong>{match.score}/100</strong><p>{match.summary}</p></div><div className="keyword-groups"><KeywordList label="Matched keywords" values={match.matched} tone="matched" /><KeywordList label="Missing keywords" values={match.missing} tone="missing" /><KeywordList label="Related keywords" values={match.related} tone="related" /></div><ul className="keyword-insights">{match.insights.map((insight) => <li key={insight}>{insight}</li>)}</ul><p className="keyword-disclaimer">{match.explanation}</p></>}</section>
}
