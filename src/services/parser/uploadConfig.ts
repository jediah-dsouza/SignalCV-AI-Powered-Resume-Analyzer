import type { ResumeFile, UploadState } from '../contracts'

export const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024
export const SUPPORTED_FILE_EXTENSIONS = ['.pdf', '.docx'] as const
export const SUPPORTED_FILE_LABEL = 'PDF or Word document (.docx)'

const supportedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export interface UploadValidation {
  state: Extract<UploadState, 'VALID' | 'INVALID_TYPE' | 'TOO_LARGE' | 'CORRUPTED'>
  message: string
}

function hasSupportedExtension(name: string) {
  const lowerName = name.toLowerCase()
  return SUPPORTED_FILE_EXTENSIONS.some((extension) => lowerName.endsWith(extension))
}

export function getFileTypeLabel(file: ResumeFile | File) {
  const name = file.name.toLowerCase()
  return name.endsWith('.pdf') ? 'PDF document' : 'Word document'
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function createResumeFile(file: File): ResumeFile {
  return {
    id: `${file.name}-${file.lastModified}-${file.size}`,
    name: file.name,
    type: file.type,
    size: file.size,
  }
}

async function hasReadableSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  const isPdf = file.name.toLowerCase().endsWith('.pdf')
  const isDocx = file.name.toLowerCase().endsWith('.docx')
  const pdfHeader = new TextDecoder().decode(bytes.slice(0, 4)) === '%PDF'
  const docxHeader = bytes[0] === 0x50 && bytes[1] === 0x4b
  return (isPdf && pdfHeader) || (isDocx && docxHeader)
}

export async function validateResumeFile(file: File | undefined): Promise<UploadValidation> {
  if (!file || !file.name) {
    return { state: 'CORRUPTED', message: 'This file could not be read. Choose another resume and try again.' }
  }
  if (!hasSupportedExtension(file.name) || (file.type && !supportedMimeTypes.has(file.type))) {
    return { state: 'INVALID_TYPE', message: `“${file.name}” is not a supported resume format. Choose a PDF or Word document (.docx), then try again.` }
  }
  if (file.size > MAX_RESUME_FILE_SIZE) {
    return { state: 'TOO_LARGE', message: `This file is larger than the ${formatFileSize(MAX_RESUME_FILE_SIZE)} limit. Choose a smaller resume and try again.` }
  }
  if (file.size === 0) {
    return { state: 'CORRUPTED', message: 'This file appears to be empty or unreadable. Choose another resume and try again.' }
  }
  if (!await hasReadableSignature(file)) {
    return { state: 'CORRUPTED', message: 'This document does not look readable as a PDF or Word file. Choose another resume and try again.' }
  }
  return { state: 'VALID', message: 'File accepted. Ready to process.' }
}
