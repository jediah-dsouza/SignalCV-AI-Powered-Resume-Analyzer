import { Link } from 'react-router-dom'

export function ResultsHeader() {
  return <header className="results-header page-heading" aria-labelledby="results-title"><p className="eyebrow">Analysis results</p><h1 id="results-title">A clearer view of your resume’s next move.</h1><p className="page-heading__description">Use this review as practical guidance. It highlights what is already working and where a focused edit can make the biggest difference.</p><Link className="text-link" to="/analyzer">← Back to analyzer workspace</Link></header>
}
