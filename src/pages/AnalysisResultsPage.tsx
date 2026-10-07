import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { LoadingState } from '../components/ui/LoadingState'
import { StatusMessage } from '../components/ui/StatusMessage'
import { ResultsHeader } from '../components/results/ResultsHeader'
import { OverallScoreCard } from '../components/results/OverallScoreCard'
import { ScoreBreakdown } from '../components/results/ScoreBreakdown'
import { SummarySection, StrengthsSection, WeaknessesSection, RelevanceSection } from '../components/results/InsightSections'
import { ImprovementPrioritiesSection, RecommendationsSection } from '../components/results/ActionSections'
import { NextSteps } from '../components/results/NextSteps'
import { KeywordMatchingSection } from '../components/results/KeywordMatchingSection'
import { ResumeChatbot } from '../components/results/ResumeChatbot'
import { useAnalysisWorkflow } from '../app/analysisWorkflow'
import { keywordMatchingService } from '../services/matching/keywordService'
import { SeoMetadata } from '../components/layout/SeoMetadata'

export function AnalysisResultsPage() {
  const workflow = useAnalysisWorkflow()
  const keywordRetryRequestRef = useRef(0)
  const keywordRetryAbortRef = useRef<AbortController | null>(null)
  useEffect(() => () => keywordRetryAbortRef.current?.abort(), [])
  const retryKeyword = useCallback(async () => {
    if (!workflow.parsedResume || !workflow.jobDescription.trim() || workflow.keywordStatus === 'matching') return
    const requestId = ++keywordRetryRequestRef.current
    keywordRetryAbortRef.current?.abort()
    const controller = new AbortController()
    keywordRetryAbortRef.current = controller
    workflow.setKeywordStatus('matching')
    workflow.setKeywordError(null)
    try {
      const result = await keywordMatchingService.matchResumeToJob(workflow.parsedResume, workflow.jobDescription, controller.signal)
      if (requestId !== keywordRetryRequestRef.current || controller.signal.aborted) return
      workflow.setKeywordMatch(result)
      workflow.setKeywordStatus(result.matched.length || result.missing.length || result.related.length ? 'success' : 'empty')
    } catch (caught) {
      if (requestId !== keywordRetryRequestRef.current || controller.signal.aborted) return
      workflow.setKeywordStatus('error')
      workflow.setKeywordError(caught instanceof Error ? caught.message : 'Keyword matching could not be completed. Please try again.')
    } finally {
      if (requestId === keywordRetryRequestRef.current) keywordRetryAbortRef.current = null
    }
  }, [workflow])
  return <div className="page results-page"><SeoMetadata title="Analysis Results — SignalCV Resume Analyzer" description="Review your resume score, strengths, weaknesses, keyword matches, and practical improvement priorities." /><PageContainer>{workflow.analysisStatus === 'analyzing' && <section className="results-empty" role="status" aria-live="polite"><LoadingState label="Preparing your analysis…" /><h1>Reading the signals in your resume.</h1><p>Keep this workspace open while the review is prepared.</p></section>}{workflow.analysisStatus === 'error' && !workflow.analysis && <section className="results-empty"><StatusMessage tone="error" title="Analysis needs another try"><span>{workflow.analysisError ?? 'The analysis could not be completed.'}</span></StatusMessage><Link className="button button--primary" to="/analyzer">Return to analyzer</Link></section>}{workflow.analysisStatus === 'idle' && !workflow.analysis && <section className="results-empty"><p className="eyebrow">No analysis yet</p><h1>Your results will appear here after a resume review.</h1><p>Upload a resume and complete the structured review before starting analysis.</p><Link className="button button--primary" to="/analyzer">Go to analyzer <span aria-hidden="true">↗</span></Link></section>}{workflow.analysis && <><ResultsHeader /><section className="results-content" aria-labelledby="results-title"><OverallScoreCard analysis={workflow.analysis} /><div className="results-grid"><ScoreBreakdown categories={workflow.analysis.categoryScores} /><SummarySection summary={workflow.analysis.summary} /><StrengthsSection strengths={workflow.analysis.strengths} /><WeaknessesSection weaknesses={workflow.analysis.weaknesses} /><RelevanceSection relevance={workflow.analysis.relevance} /><KeywordMatchingSection jobDescription={workflow.jobDescription} status={workflow.keywordStatus} match={workflow.keywordMatch} error={workflow.keywordError} onRetry={retryKeyword} /><ImprovementPrioritiesSection priorities={workflow.analysis.improvementPriorities} /><RecommendationsSection recommendations={workflow.analysis.recommendations} /><NextSteps /><ResumeChatbot /></div></section></>}</PageContainer></div>
}
