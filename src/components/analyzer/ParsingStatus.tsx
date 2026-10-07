import { LoadingState } from '../ui/LoadingState'
import { StatusMessage } from '../ui/StatusMessage'

interface ParsingStatusProps {
  mode: 'parsing' | 'partial' | 'empty' | 'error'
  onRetry?: () => void
  onReplace?: () => void
}

export function ParsingStatus({ mode, onRetry, onReplace }: ParsingStatusProps) {
  if (mode === 'parsing') return <div className="analyzer-card parsing-status" role="status" aria-live="polite"><LoadingState label="Processing your resume…" /><p>We’re organizing sections and preparing a review. This temporary mock parser takes a moment.</p></div>
  if (mode === 'partial') return <StatusMessage tone="warning" title="Partial extraction"><span>Some sections were not detected. Review what we found, then replace the file if important content is missing.</span><div className="status-actions"><button className="text-link" type="button" onClick={onReplace}>Replace file <span aria-hidden="true">↗</span></button></div></StatusMessage>
  if (mode === 'empty') return <StatusMessage tone="warning" title="No usable resume content found"><span>This document did not provide meaningful resume content. Choose another document and try again.</span><div className="status-actions"><button className="text-link" type="button" onClick={onReplace}>Choose another file <span aria-hidden="true">↗</span></button></div></StatusMessage>
  return <StatusMessage tone="error" title="We couldn’t process this document"><span>The document could not be processed. Try parsing it again or choose another file. Technical details are hidden to keep this workspace clear.</span><div className="status-actions"><button className="text-link" type="button" onClick={onRetry}>Retry parse <span aria-hidden="true">↗</span></button><button className="text-link" type="button" onClick={onReplace}>Replace file <span aria-hidden="true">↗</span></button></div></StatusMessage>
}
