import { Link } from 'react-router-dom'

export function NextSteps() { return <section className="results-card next-steps" aria-labelledby="next-steps-title"><p className="eyebrow">Keep momentum</p><h2 id="next-steps-title">Turn one priority into your next edit.</h2><p>Return to the workspace when you are ready to revise the resume or provide a different target job description.</p><Link className="button button--primary" to="/analyzer">Back to analyzer <span aria-hidden="true">↗</span></Link></section> }
