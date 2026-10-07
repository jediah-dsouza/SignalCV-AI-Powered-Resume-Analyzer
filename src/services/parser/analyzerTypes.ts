import type { AnalyzerState, ParsedResume, UploadState } from '../contracts'

export interface AnalyzerError {
  kind: 'upload' | 'parsing' | 'analysis'
  title: string
  message: string
}

export interface AnalyzerViewState {
  analyzerState: AnalyzerState
  uploadState: UploadState
  file: File | null
  parsedResume: ParsedResume | null
  error: AnalyzerError | null
}
