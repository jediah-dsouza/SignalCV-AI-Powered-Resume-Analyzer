import { Button } from '../ui/Button'

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  ready: boolean
  onAnalyzePlaceholder: () => void
}

export function JobDescriptionInput({ value, onChange, onClear, ready, onAnalyzePlaceholder }: JobDescriptionInputProps) {
  return <section className="analyzer-card job-description" aria-labelledby="job-description-title">
    <div className="analyzer-card__heading"><div><p className="eyebrow">Optional context</p><h2 id="job-description-title">Add a target job description.</h2><p>This will help a future analysis compare relevance and keywords. You can continue without it.</p></div><span className="job-description__icon" aria-hidden="true">⌁</span></div>
    <label htmlFor="job-description">Job description <span>(optional)</span></label>
    <textarea id="job-description" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Paste a target job description here…" maxLength={3000} aria-describedby="job-description-help job-description-count" />
    <div className="textarea-footer"><span id="job-description-help">Up to 3,000 characters. Nothing is sent anywhere in this phase.</span><span id="job-description-count">{value.length}/3000</span></div>
    <div className="job-description__actions">{value && <Button variant="ghost" type="button" onClick={onClear}>Clear description</Button>}<Button variant="primary" type="button" disabled={!ready} onClick={onAnalyzePlaceholder} title={ready ? 'Analyze this resume' : 'Complete the resume review first'}>{ready ? 'Analyze my resume' : 'Complete your review'} <span aria-hidden="true">↗</span></Button></div>
    <p className="analysis-placeholder" role="status">{ready ? 'Your resume is ready for analysis. The review remains in this workspace while it runs.' : 'Complete the resume review to enable the next step.'}</p>
  </section>
}
