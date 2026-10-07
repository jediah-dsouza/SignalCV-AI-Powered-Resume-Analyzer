import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import type { ChatMessage, KeywordMatch, ParsedResume, ResumeAnalysis } from '../services/contracts'

type AnalysisStatus = 'idle' | 'analyzing' | 'success' | 'error'
export type KeywordStatus = 'idle' | 'matching' | 'success' | 'empty' | 'error'
export type ChatStatus = 'idle' | 'sending' | 'success' | 'error'

interface AnalysisWorkflowValue {
  resumeFile: File | null
  parsedResume: ParsedResume | null
  jobDescription: string
  analysis: ResumeAnalysis | null
  analysisStatus: AnalysisStatus
  analysisError: string | null
  keywordMatch: KeywordMatch | null
  keywordStatus: KeywordStatus
  keywordError: string | null
  chatMessages: ChatMessage[]
  chatStatus: ChatStatus
  chatError: string | null
  setResumeFile: (file: File | null) => void
  setParsedResume: (resume: ParsedResume | null) => void
  setJobDescription: (value: string) => void
  setAnalysis: (analysis: ResumeAnalysis | null) => void
  setAnalysisStatus: (status: AnalysisStatus) => void
  setAnalysisError: (message: string | null) => void
  setKeywordMatch: (match: KeywordMatch | null) => void
  setKeywordStatus: (status: KeywordStatus) => void
  setKeywordError: (message: string | null) => void
  setChatMessages: (messages: ChatMessage[]) => void
  setChatStatus: (status: ChatStatus) => void
  setChatError: (message: string | null) => void
}

const AnalysisWorkflowContext = createContext<AnalysisWorkflowValue | null>(null)

export function AnalysisWorkflowProvider({ children }: PropsWithChildren) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [keywordMatch, setKeywordMatch] = useState<KeywordMatch | null>(null)
  const [keywordStatus, setKeywordStatus] = useState<KeywordStatus>('idle')
  const [keywordError, setKeywordError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatStatus, setChatStatus] = useState<ChatStatus>('idle')
  const [chatError, setChatError] = useState<string | null>(null)
  const value = useMemo(() => ({ resumeFile, parsedResume, jobDescription, analysis, analysisStatus, analysisError, keywordMatch, keywordStatus, keywordError, chatMessages, chatStatus, chatError, setResumeFile, setParsedResume, setJobDescription, setAnalysis, setAnalysisStatus, setAnalysisError, setKeywordMatch, setKeywordStatus, setKeywordError, setChatMessages, setChatStatus, setChatError }), [resumeFile, parsedResume, jobDescription, analysis, analysisStatus, analysisError, keywordMatch, keywordStatus, keywordError, chatMessages, chatStatus, chatError])
  return <AnalysisWorkflowContext.Provider value={value}>{children}</AnalysisWorkflowContext.Provider>
}

export function useAnalysisWorkflow() {
  const value = useContext(AnalysisWorkflowContext)
  if (!value) throw new Error('useAnalysisWorkflow must be used within AnalysisWorkflowProvider')
  return value
}
