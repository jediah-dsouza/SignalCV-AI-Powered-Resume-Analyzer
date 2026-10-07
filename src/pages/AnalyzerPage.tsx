import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { AnalyzerProgress } from '../components/analyzer/AnalyzerProgress'
import { JobDescriptionInput } from '../components/analyzer/JobDescriptionInput'
import { ParsedResumeReview } from '../components/analyzer/ParsedResumeReview'
import { ParsingStatus } from '../components/analyzer/ParsingStatus'
import { ResumeFilePreview } from '../components/analyzer/ResumeFilePreview'
import { ResumeUploadCard } from '../components/analyzer/ResumeUploadCard'
import type { AnalyzerError } from '../services/parser/analyzerTypes'
import { resumeParserService } from '../services/parser/resumeParser'
import { createResumeFile, validateResumeFile } from '../services/parser/uploadConfig'
import { resumeAnalysisService } from '../services/analysis/analysisService'
import { keywordMatchingService } from '../services/matching/keywordService'
import type { AnalyzerState, ParsedResume, UploadState } from '../services/contracts'
import { StatusMessage } from '../components/ui/StatusMessage'
import { useAnalysisWorkflow } from '../app/analysisWorkflow'
import { SeoMetadata } from '../components/layout/SeoMetadata'

function isMeaningfulResume(resume: ParsedResume) {
  return Boolean(resume.candidate.name || resume.summary || resume.experience.length || resume.education.length || resume.skills.length || resume.projects.length || resume.additionalSections.length)
}

function initialAnalyzerState(resume: ParsedResume | null): AnalyzerState {
  if (!resume) return 'INITIAL'
  return resume.parsingMeta.warnings.length ? 'PARTIAL_PARSE' : 'READY_TO_ANALYZE'
}

export function AnalyzerPage() {
  const navigate = useNavigate()
  const workflow = useAnalysisWorkflow()
  const [analyzerState, setAnalyzerState] = useState<AnalyzerState>(() => initialAnalyzerState(workflow.parsedResume))
  const [uploadState, setUploadState] = useState<UploadState>('EMPTY')
  const [file, setFile] = useState<File | null>(() => workflow.resumeFile)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(workflow.parsedResume)
  const [error, setError] = useState<AnalyzerError | null>(null)
  const [jobDescription, setJobDescription] = useState(workflow.jobDescription)
  const parseRequestRef = useRef(0)
  const analysisRequestRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const analysisAbortRef = useRef<AbortController | null>(null)
  const keywordRequestRef = useRef(0)
  const keywordAbortRef = useRef<AbortController | null>(null)
  const validationTimerRef = useRef<number | null>(null)
  const validationRequestRef = useRef(0)
  const inputResetRef = useRef(0)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      analysisAbortRef.current?.abort()
      keywordAbortRef.current?.abort()
      validationRequestRef.current += 1
      if (validationTimerRef.current !== null) window.clearTimeout(validationTimerRef.current)
    }
  }, [])

  const resetToEmpty = useCallback(() => {
    parseRequestRef.current += 1
    analysisRequestRef.current += 1
    keywordRequestRef.current += 1
    abortRef.current?.abort()
    analysisAbortRef.current?.abort()
    keywordAbortRef.current?.abort()
    validationRequestRef.current += 1
    if (validationTimerRef.current !== null) window.clearTimeout(validationTimerRef.current)
    abortRef.current = null
    analysisAbortRef.current = null
    keywordAbortRef.current = null
    setFile(null)
    setParsedResume(null)
    setError(null)
    setJobDescription('')
    setUploadState('REMOVED')
    setAnalyzerState('INITIAL')
    workflow.setParsedResume(null)
    workflow.setResumeFile(null)
    workflow.setJobDescription('')
    workflow.setAnalysis(null)
    workflow.setAnalysisStatus('idle')
    workflow.setAnalysisError(null)
    workflow.setKeywordMatch(null)
    workflow.setKeywordStatus('idle')
    workflow.setKeywordError(null)
    workflow.setChatMessages([])
    workflow.setChatStatus('idle')
    workflow.setChatError(null)
    inputResetRef.current += 1
  }, [workflow])

  const parseFile = useCallback(async (nextFile: File) => {
    const requestId = ++parseRequestRef.current
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setAnalyzerState('PARSING')
    setUploadState('VALID')
    setParsedResume(null)
    setError(null)
    try {
      const result = await resumeParserService.parse(nextFile, controller.signal)
      if (requestId !== parseRequestRef.current || controller.signal.aborted) return
      if (!isMeaningfulResume(result)) {
        setParsedResume(null)
        setAnalyzerState('EMPTY_PARSE')
        return
      }
      setParsedResume(result)
      workflow.setParsedResume(result)
      if (result.parsingMeta.warnings.length) setAnalyzerState('PARTIAL_PARSE')
      else {
        setAnalyzerState('PARSED')
        window.setTimeout(() => {
          if (requestId === parseRequestRef.current && !controller.signal.aborted) setAnalyzerState('READY_TO_ANALYZE')
        }, 0)
      }
    } catch (caught) {
      if (requestId !== parseRequestRef.current || controller.signal.aborted) return
      setParsedResume(null)
      setAnalyzerState('PARSING_ERROR')
      setError({ kind: 'parsing', title: 'Parsing failed', message: caught instanceof Error ? caught.message : 'The document could not be processed.' })
    } finally {
      if (requestId === parseRequestRef.current) abortRef.current = null
    }
  }, [workflow])

  const handleFile = useCallback((nextFile: File | undefined) => {
    if (!nextFile) return
    const validationRequestId = ++validationRequestRef.current
    setUploadState('SELECTING')
    setAnalyzerState('FILE_SELECTED')
    setError(null)
    if (validationTimerRef.current !== null) window.clearTimeout(validationTimerRef.current)
    validationTimerRef.current = window.setTimeout(async () => {
      setUploadState('VALIDATING')
      const validation = await validateResumeFile(nextFile)
      validationTimerRef.current = null
      if (validationRequestId !== validationRequestRef.current) return
      if (validation.state !== 'VALID') {
        setFile(null)
        setParsedResume(null)
        setUploadState(validation.state)
        setAnalyzerState('UPLOAD_ERROR')
        setError({ kind: 'upload', title: 'This file needs attention', message: validation.message })
        return
      }
      setFile(nextFile)
      workflow.setResumeFile(nextFile)
      setUploadState('VALID')
      void parseFile(nextFile)
    }, 0)
  }, [parseFile, workflow])

  const runKeywordAnalysis = useCallback(async (resume: ParsedResume, description: string) => {
    if (!description.trim()) {
      workflow.setKeywordMatch(null)
      workflow.setKeywordStatus('idle')
      workflow.setKeywordError(null)
      navigate('/analysis')
      return true
    }
    const requestId = ++keywordRequestRef.current
    keywordAbortRef.current?.abort()
    const controller = new AbortController()
    keywordAbortRef.current = controller
    workflow.setKeywordStatus('matching')
    workflow.setKeywordError(null)
    try {
      const result = await keywordMatchingService.matchResumeToJob(resume, description, controller.signal)
      if (requestId !== keywordRequestRef.current || controller.signal.aborted) return false
      workflow.setKeywordMatch(result)
      workflow.setKeywordStatus(result.matched.length || result.missing.length || result.related.length ? 'success' : 'empty')
      navigate('/analysis')
      return true
    } catch (caught) {
      if (requestId !== keywordRequestRef.current || controller.signal.aborted) return false
      const message = caught instanceof Error && !caught.message.includes('Abort') ? caught.message : 'Keyword matching could not be completed. Please try again.'
      workflow.setKeywordStatus('error')
      workflow.setKeywordError(message)
      setError({ kind: 'analysis', title: 'Keyword matching needs another try', message })
      setAnalyzerState('ANALYSIS_ERROR')
      return false
    } finally {
      if (requestId === keywordRequestRef.current) keywordAbortRef.current = null
    }
  }, [navigate, workflow])

  const analyze = useCallback(async (isRetry = false) => {
    if (!parsedResume || (analyzerState !== 'READY_TO_ANALYZE' && !(isRetry && analyzerState === 'ANALYSIS_ERROR' && !workflow.analysis))) return
    const requestId = ++analysisRequestRef.current
    analysisAbortRef.current?.abort()
    const controller = new AbortController()
    analysisAbortRef.current = controller
    setAnalyzerState('ANALYZING')
    setError(null)
    workflow.setAnalysisStatus('analyzing')
    workflow.setAnalysisError(null)
    workflow.setParsedResume(parsedResume)
    workflow.setJobDescription(jobDescription)
    workflow.setKeywordMatch(null)
    workflow.setKeywordStatus(jobDescription.trim() ? 'matching' : 'idle')
    workflow.setKeywordError(null)
    try {
      const result = await resumeAnalysisService.analyzeResume(parsedResume, jobDescription, controller.signal)
      if (requestId !== analysisRequestRef.current || controller.signal.aborted) return
      workflow.setAnalysis(result)
      workflow.setAnalysisStatus('success')
      const keywordCompleted = await runKeywordAnalysis(parsedResume, jobDescription)
      if (keywordCompleted) setAnalyzerState('ANALYZED')
    } catch (caught) {
      if (requestId !== analysisRequestRef.current || controller.signal.aborted) return
      setAnalyzerState('ANALYSIS_ERROR')
      const message = caught instanceof Error && !caught.message.includes('Abort') ? caught.message : 'The analysis could not be completed. Please try again.'
      setError({ kind: 'analysis', title: 'Analysis needs another try', message })
      workflow.setAnalysisStatus('error')
      workflow.setAnalysisError(message)
    } finally {
      if (requestId === analysisRequestRef.current) analysisAbortRef.current = null
    }
  }, [analyzerState, jobDescription, parsedResume, runKeywordAnalysis, workflow])

  const retryAnalysis = useCallback(() => {
    if (analyzerState !== 'ANALYSIS_ERROR') return
    if (workflow.analysis && workflow.keywordStatus === 'error' && parsedResume) void runKeywordAnalysis(parsedResume, jobDescription)
    else void analyze(true)
  }, [analyze, analyzerState, jobDescription, parsedResume, runKeywordAnalysis, workflow.analysis, workflow.keywordStatus])

  const retryParse = useCallback(() => {
    if (file) void parseFile(file)
  }, [file, parseFile])

  const uploadErrorMessage = error?.kind === 'upload' ? error.message : undefined
  const isParsing = analyzerState === 'PARSING'
  const isAnalyzing = analyzerState === 'ANALYZING'
  const isKeywordMatching = isAnalyzing && workflow.analysisStatus === 'success'
  const hasReview = Boolean(parsedResume && (analyzerState === 'READY_TO_ANALYZE' || analyzerState === 'PARTIAL_PARSE' || analyzerState === 'ANALYSIS_ERROR'))
  const parsingMode = analyzerState === 'PARSING' ? 'parsing' : analyzerState === 'PARTIAL_PARSE' ? 'partial' : analyzerState === 'EMPTY_PARSE' ? 'empty' : analyzerState === 'PARSING_ERROR' ? 'error' : null

  return <div className="page analyzer-page">
    <SeoMetadata title="Analyzer Workspace — SignalCV Resume Analyzer" description="Upload a PDF or Word resume, review the structured extraction, and prepare a focused resume analysis." />
    <PageContainer>
      <header className="page-heading analyzer-page__heading">
        <p className="eyebrow">Analyzer workspace</p>
        <h1 id="analyzer-title">Turn your resume into clear next steps.</h1>
        <p className="page-heading__description">Upload a resume, review what we can structure from it, and prepare for a future analysis. You stay in control before anything else happens.</p>
      </header>
      <AnalyzerProgress state={analyzerState} />
      <div className="analyzer-layout">
        <section className="analyzer-main" aria-labelledby="analyzer-title">
          {!file && <ResumeUploadCard key={inputResetRef.current} uploadState={uploadState} onSelect={handleFile} onDragState={(isOver) => setUploadState(isOver ? 'DRAG_OVER' : 'EMPTY')} errorMessage={uploadErrorMessage} />}
          {file && <ResumeFilePreview file={file} status={isAnalyzing ? 'Analyzing' : isParsing ? 'Processing' : hasReview ? 'Ready for review' : 'Selected'} onReplace={resetToEmpty} onRemove={resetToEmpty} busy={isParsing || isAnalyzing} />}
          {parsingMode && <ParsingStatus mode={parsingMode} onRetry={retryParse} onReplace={resetToEmpty} />}
          {analyzerState === 'UPLOAD_ERROR' && <StatusMessage tone="info" title="Try again"><span>Choose a supported PDF or Word document (.docx). Your previous resume content is not being kept.</span></StatusMessage>}
          {hasReview && parsedResume && <ParsedResumeReview resume={parsedResume} />}
          {isAnalyzing && <section className="analyzer-card analysis-progress" role="status" aria-live="polite" aria-labelledby="analysis-progress-title"><p className="eyebrow">Step 4 · Analyze</p><h2 id="analysis-progress-title">{isKeywordMatching ? 'Comparing your resume to the job description.' : 'Reading the signals in your resume.'}</h2><p>{isKeywordMatching ? 'We’re identifying matched, missing, and related terms. This deterministic mock comparison takes a moment.' : 'We’re turning the structured review into clear, practical guidance. This mock analysis takes a moment.'}</p><div className="analysis-progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuetext={isKeywordMatching ? 'Keyword matching in progress' : 'Analysis in progress'}><span /></div></section>}
          {analyzerState === 'ANALYSIS_ERROR' && error && <StatusMessage tone="error" title={error.title}><span>{error.message}</span><button className="text-link" type="button" onClick={retryAnalysis}>{workflow.keywordStatus === 'error' ? 'Retry keyword matching' : 'Retry analysis'} <span aria-hidden="true">↗</span></button></StatusMessage>}
          {hasReview && parsedResume && !isAnalyzing && <JobDescriptionInput value={jobDescription} onChange={(value) => { setJobDescription(value); workflow.setJobDescription(value) }} onClear={() => { setJobDescription(''); workflow.setJobDescription('') }} ready={analyzerState === 'READY_TO_ANALYZE'} onAnalyzePlaceholder={analyze} />}
        </section>
        <aside className="analyzer-aside" aria-label="Analyzer guidance">
          <section className="analyzer-aside__card"><p className="eyebrow">Privacy-conscious by design</p><h2>Your resume stays in this workspace.</h2><p>Raw resume text is treated as transient parser data. It is not saved to browser storage or shown in the interface.</p></section>
          <section className="analyzer-aside__card analyzer-aside__card--muted"><p className="eyebrow">What happens next</p><ol><li>We organize detected sections.</li><li>You review the extracted information.</li><li>Analysis turns the review into priorities.</li></ol></section>
        </aside>
      </div>
    </PageContainer>
  </div>
}
