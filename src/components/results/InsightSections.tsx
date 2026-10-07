import type { ResumeAnalysis } from '../../services/contracts'

export function SummarySection({ summary }: { summary: string }) { return <section className="results-card" aria-labelledby="summary-title"><div className="results-section-heading"><p className="eyebrow">The signal</p><h2 id="summary-title">Summary</h2></div><p className="results-copy">{summary}</p></section> }

export function StrengthsSection({ strengths }: { strengths: string[] }) { return <section className="results-card" aria-labelledby="strengths-title"><div className="results-section-heading"><p className="eyebrow">Keep building on</p><h2 id="strengths-title">Strengths</h2></div><ul className="insight-list insight-list--strengths">{strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul></section> }

export function WeaknessesSection({ weaknesses }: { weaknesses: string[] }) { return <section className="results-card" aria-labelledby="weaknesses-title"><div className="results-section-heading"><p className="eyebrow">Watch for</p><h2 id="weaknesses-title">Weaknesses</h2></div><ul className="insight-list insight-list--weaknesses">{weaknesses.map((weakness) => <li key={weakness}>{weakness}</li>)}</ul></section> }

export function RelevanceSection({ relevance }: { relevance: ResumeAnalysis['relevance'] }) { return <section className="results-card" aria-labelledby="relevance-title"><div className="results-section-heading"><p className="eyebrow">Context</p><h2 id="relevance-title">Job relevance</h2></div><p className="results-copy">{relevance.headline}</p><ul className="insight-list">{relevance.observations.map((observation) => <li key={observation}>{observation}</li>)}</ul></section> }
