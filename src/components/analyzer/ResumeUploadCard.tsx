import { useRef } from 'react'
import type { UploadState } from '../../services/contracts'
import { MAX_RESUME_FILE_SIZE, SUPPORTED_FILE_LABEL, formatFileSize } from '../../services/parser/uploadConfig'

interface ResumeUploadCardProps {
  uploadState: UploadState
  onSelect: (file: File | undefined) => void
  onDragState: (isOver: boolean) => void
  errorMessage?: string
  disabled?: boolean
}

export function ResumeUploadCard({ uploadState, onSelect, onDragState, errorMessage, disabled = false }: ResumeUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isDragOver = uploadState === 'DRAG_OVER'
  const isValidating = uploadState === 'SELECTING' || uploadState === 'VALIDATING'
  const openPicker = () => inputRef.current?.click()

  return (
    <section className="analyzer-card upload-card" aria-labelledby="upload-title">
      <div className="analyzer-card__heading"><div><p className="eyebrow">Step 1 · Upload</p><h2 id="upload-title">Bring the resume you want to improve.</h2><p>Start with one resume file. We’ll prepare a structured review before any analysis happens.</p></div><span className="upload-card__icon" aria-hidden="true">↑</span></div>
      <div className={`dropzone dropzone--${uploadState.toLowerCase()} ${isDragOver ? 'dropzone--drag-over' : ''}`} role="button" tabIndex={disabled ? -1 : 0} onClick={openPicker} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPicker() } }} onDragEnter={(event) => { event.preventDefault(); if (!disabled) onDragState(true) }} onDragOver={(event) => { event.preventDefault(); if (!disabled) onDragState(true) }} onDragLeave={(event) => { if (event.currentTarget === event.target) onDragState(false) }} onDrop={(event) => { event.preventDefault(); onDragState(false); if (!disabled) onSelect(event.dataTransfer.files[0]) }} aria-describedby="upload-help upload-formats">
        <input ref={inputRef} className="visually-hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { onSelect(event.target.files?.[0]); event.currentTarget.value = '' }} disabled={disabled} aria-label="Choose a resume file" />
        <span className="dropzone__icon" aria-hidden="true">▤</span>
        <strong>{isDragOver ? 'Drop your resume here' : isValidating ? 'Checking your file…' : uploadState === 'REMOVED' ? 'Your resume was removed' : 'Drag and drop your resume here'}</strong>
        <span>or <span className="button button--secondary" aria-hidden="true">Browse files</span></span>
        <p id="upload-help">Keyboard users can focus this area and press Enter or Space to browse.</p>
        <p id="upload-formats" className="dropzone__formats">Supported: {SUPPORTED_FILE_LABEL} · Max {formatFileSize(MAX_RESUME_FILE_SIZE)}</p>
      </div>
      {errorMessage && <p className="upload-error" role="alert">{errorMessage}</p>}
    </section>
  )
}
