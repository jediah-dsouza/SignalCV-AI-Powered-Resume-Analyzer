import { Button } from '../ui/Button'
import { formatFileSize, getFileTypeLabel } from '../../services/parser/uploadConfig'

interface ResumeFilePreviewProps {
  file: File
  status: string
  onReplace: () => void
  onRemove: () => void
  busy?: boolean
}

export function ResumeFilePreview({ file, status, onReplace, onRemove, busy = false }: ResumeFilePreviewProps) {
  return <section className="analyzer-card file-preview" aria-labelledby="file-preview-title">
    <div className="file-preview__icon" aria-hidden="true">{file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}</div>
    <div className="file-preview__details"><p className="eyebrow">Selected resume</p><h2 id="file-preview-title">{file.name}</h2><p>{getFileTypeLabel(file)} · {formatFileSize(file.size)}</p><span className="file-preview__status"><span aria-hidden="true" />{status}</span></div>
    <div className="file-preview__actions"><Button variant="secondary" type="button" onClick={onReplace} disabled={busy}>Replace</Button><Button variant="ghost" type="button" onClick={onRemove} disabled={busy}>Remove</Button></div>
  </section>
}
