import type { AnalyzerState } from '../../services/contracts'

const steps = [
  { id: 'upload', label: 'Upload' },
  { id: 'parse', label: 'Parse' },
  { id: 'review', label: 'Review' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'results', label: 'Results' },
] as const

const stateIndex: Record<AnalyzerState, number> = {
  INITIAL: 0,
  FILE_SELECTED: 0,
  UPLOAD_ERROR: 0,
  PARSING: 1,
  PARSING_ERROR: 1,
  PARSED: 2,
  PARTIAL_PARSE: 2,
  EMPTY_PARSE: 2,
  READY_TO_ANALYZE: 2,
  ANALYZING: 3,
  ANALYZED: 4,
  ANALYSIS_ERROR: 2,
}

export function AnalyzerProgress({ state }: { state: AnalyzerState }) {
  const activeIndex = stateIndex[state]
  return (
    <nav className="analyzer-progress" aria-label="Analyzer progress">
      <ol>
        {steps.map((step, index) => {
          const status = index < activeIndex ? 'complete' : index === activeIndex ? 'current' : 'upcoming'
          return <li className={`analyzer-progress__step analyzer-progress__step--${status}`} key={step.id} aria-current={status === 'current' ? 'step' : undefined}><span>{index < activeIndex ? '✓' : String(index + 1).padStart(2, '0')}</span><strong>{step.label}</strong></li>
        })}
      </ol>
    </nav>
  )
}
