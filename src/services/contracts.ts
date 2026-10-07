export interface ResumeFile {
  id: string
  name: string
  type: string
  size: number
}

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  links: string[]
}

export interface ExperienceEntry {
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export interface ProjectEntry {
  name: string
  description: string
  technologies: string[]
  link?: string
}

export interface AdditionalSection {
  title: string
  items: string[]
}

export interface ParsedResume {
  id: string
  file: ResumeFile
  candidate: PersonalInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  projects: ProjectEntry[]
  certifications: string[]
  languages: string[]
  additionalSections: AdditionalSection[]
  rawText: string
  parsingMeta: {
    parser: string
    parsedAt: string
    warnings: string[]
  }
}

export type ParsingOutcome = 'SUCCESS' | 'PARTIAL' | 'EMPTY' | 'ERROR'
export type AnalyzerState = 'INITIAL' | 'FILE_SELECTED' | 'PARSING' | 'PARSED' | 'READY_TO_ANALYZE' | 'ANALYZING' | 'ANALYZED' | 'ANALYSIS_ERROR' | 'UPLOAD_ERROR' | 'PARSING_ERROR' | 'PARTIAL_PARSE' | 'EMPTY_PARSE'
export type UploadState = 'EMPTY' | 'DRAG_OVER' | 'SELECTING' | 'VALIDATING' | 'VALID' | 'INVALID_TYPE' | 'TOO_LARGE' | 'CORRUPTED' | 'REMOVED'

export interface ResumeAnalysis {
  overallScore: number
  categoryScores: CategoryScore[]
  summary: string
  strengths: string[]
  weaknesses: string[]
  improvementPriorities: ImprovementPriority[]
  recommendations: Recommendation[]
  relevance: RelevanceInsight
  analyzedAt: string
}

export interface CategoryScore {
  id: 'content' | 'structure' | 'experience' | 'skills' | 'relevance' | 'readability'
  label: string
  score: number
  interpretation: string
}

export interface ImprovementPriority {
  id: string
  issue: string
  whyItMatters: string
  suggestedAction: string
}

export interface Recommendation {
  id: string
  priority: 'high' | 'medium' | 'low'
  section: string
  text: string
}

export interface RelevanceInsight {
  hasJobDescription: boolean
  headline: string
  observations: string[]
}

export interface LegacyResumeAnalysisShape {
  priorities: string[]
  categories: Array<{
    id: string
    label: string
    score: number
    summary: string
    strengths: string[]
    issues: string[]
    recommendations: string[]
  }>
  suggestions: Array<{
    id: string
    priority: 'high' | 'medium' | 'low'
    section: string
    issue: string
    reason: string
    recommendation: string
    suggestedText?: string
  }>
}

export interface KeywordMatch {
  score: number
  matched: string[]
  missing: string[]
  related: string[]
  summary: string
  insights: string[]
  explanation: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  status: 'sent' | 'loading' | 'error'
}

export interface ResumeChatContext {
  resume: ParsedResume | null
  analysis: ResumeAnalysis | null
  jobDescription: string
  keywordMatch: KeywordMatch | null
}
