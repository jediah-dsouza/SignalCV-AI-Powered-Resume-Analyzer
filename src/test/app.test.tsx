import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from '../app/App'
import { createMockAnalysis } from '../services/analysis/analysisService'
import { createMockKeywordMatch, keywordMatchingService } from '../services/matching/keywordService'
import { responseFor, resumeChatService } from '../services/chatbot/chatbotService'
import { suggestedPrompts } from '../components/results/ResumeChatbot'
import type { ParsedResume } from '../services/contracts'

function renderApp(initialEntry = '/') {
  window.history.pushState({}, '', initialEntry)
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
}

function renderAnalyzer() {
  return renderApp('/analyzer')
}

async function uploadFile(file: File) {
  const input = screen.getByLabelText(/choose a resume file/i)
  await userEvent.upload(input, file, { applyAccept: false })
}

function pdfFile(name: string, body = 'resume') {
  return new File([`%PDF-1.7\n${body}`], name, { type: 'application/pdf' })
}

function docxFile(name: string, body = 'resume') {
  return new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04]), body], name, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
}

const analysisFixture: ParsedResume = {
  id: 'fixture',
  file: { id: 'fixture-file', name: 'fixture.pdf', type: 'application/pdf', size: 100 },
  candidate: { name: 'Jordan Lee', email: 'jordan@example.com', phone: '', location: '', links: [] },
  summary: 'Product designer focused on clear workflows.',
  experience: [{ company: 'Northstar', role: 'Product Designer', location: 'Remote', startDate: '2022', endDate: 'Present', current: true, bullets: ['Improved activation by 24%.'] }],
  education: [], skills: ['Product design', 'Figma', 'Accessibility'], projects: [], certifications: [], languages: [], additionalSections: [], rawText: 'transient', parsingMeta: { parser: 'fixture', parsedAt: '2026-01-01', warnings: [] },
}

describe('application shell and Home page', () => {
  it('renders the home route, shared landmarks, and core home content', () => {
    renderApp()
    expect(document.title).toBe('SignalCV — Clear next steps for your resume')
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', expect.stringMatching(/analyze your resume/i))
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /harder to overlook/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /resume parsing/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /ask better questions/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /illustrative product preview/i })).toBeInTheDocument()
  })

  it('renders the four core product capability sections and final CTA', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(screen.getByRole('heading', { name: /resume parsing/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /ai-powered analysis/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /keyword matching/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /actionable improvements/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /start with the resume you already have/i })).toBeInTheDocument()
    const ctas = screen.getAllByRole('link', { name: /analyze my resume/i })
    await user.click(ctas[ctas.length - 1])
    expect(screen.getByRole('heading', { name: /turn your resume into clear next steps/i })).toBeInTheDocument()
  })

  it('navigates from the hero CTAs to the intended routes', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getAllByRole('link', { name: /analyze my resume/i })[0])
    expect(screen.getByRole('heading', { name: /turn your resume into clear next steps/i })).toBeInTheDocument()
    expect(document.title).toBe('Analyzer Workspace — SignalCV Resume Analyzer')
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', expect.stringMatching(/upload a pdf or word resume/i))
    cleanup()
    window.history.pushState({}, '', '/')
    renderApp()
    await user.click(screen.getByRole('link', { name: /see how it works/i }))
    expect(screen.getByRole('heading', { name: /clearer path from resume to next edit/i })).toBeInTheDocument()
  })

  it('renders the analyzer route through application navigation', async () => {
    const user = userEvent.setup()
    renderApp()
    const desktopNavigation = screen.getAllByRole('navigation', { name: /primary navigation/i })[0]
    await user.click(within(desktopNavigation).getByRole('link', { name: 'Analyzer' }))
    expect(screen.getByRole('heading', { name: /turn your resume into clear next steps/i })).toBeInTheDocument()
  })

  it('opens and closes the mobile navigation with an accessible control', async () => {
    const user = userEvent.setup()
    renderApp()
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i })
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('mobile-navigation')).not.toHaveAttribute('hidden')
    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders the complete How It Works workflow and reaches the analyzer CTA', async () => {
    const user = userEvent.setup()
    renderApp('/how-it-works')
    expect(screen.getByRole('heading', { name: /clearer path from resume to next edit/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /understand first/i })).toBeInTheDocument()
    expect(screen.getByText(/upload your resume/i)).toBeInTheDocument()
    expect(screen.getByText(/resume parsing/i)).toBeInTheDocument()
    expect(screen.getByText(/add a job description/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /analysis and scoring/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /keyword matching/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /improvement recommendations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /resume improvement chatbot/i })).toBeInTheDocument()
    expect(screen.getByText(/deterministic mock services/i)).toBeInTheDocument()
    await user.click(screen.getAllByRole('link', { name: /start with the analyzer/i })[0])
    expect(screen.getByRole('heading', { name: /turn your resume into clear next steps/i })).toBeInTheDocument()
  })

  it('keeps footer and primary navigation links on supported routes', async () => {
    const user = userEvent.setup()
    renderApp('/how-it-works')
    const primary = screen.getAllByRole('navigation', { name: /primary navigation/i })[0]
    await user.click(within(primary).getByRole('link', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: /harder to overlook/i })).toBeInTheDocument()
    cleanup()
    renderApp('/how-it-works')
    const footer = screen.getByRole('contentinfo')
    await user.click(within(footer).getByRole('link', { name: /analyzer/i }))
    expect(screen.getByRole('heading', { name: /turn your resume into clear next steps/i })).toBeInTheDocument()
  })
})

describe('Analyzer upload and parsing workflow', () => {
  it('renders the empty upload state and supports a keyboard dropzone', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    const dropzone = screen.getByRole('button', { name: /choose a resume file.*drag and drop/i })
    expect(screen.getByText(/supported: pdf or word document/i)).toBeInTheDocument()
    dropzone.focus()
    await user.keyboard('{Enter}')
    expect(dropzone).toHaveFocus()
  })

  it('accepts a valid PDF and renders the structured parsed review', async () => {
    renderAnalyzer()
    await uploadFile(pdfFile('resume.pdf', 'resume content'))
    expect(await screen.findByRole('heading', { name: /here’s what we found/i })).toBeInTheDocument()
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByText(/add a target job description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze my resume/i })).toBeEnabled()
  })

  it('communicates the parsing state while the parser is processing', async () => {
    renderAnalyzer()
    const input = screen.getByLabelText(/choose a resume file/i)
    fireEvent.change(input, { target: { files: [pdfFile('processing.pdf')] } })
    await waitFor(() => expect(screen.getByText(/processing your resume/i)).toBeInTheDocument())
  })

  it('accepts a valid Word document and optional job description input', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    await uploadFile(docxFile('resume.docx', 'docx content'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    const textarea = screen.getByRole('textbox', { name: /job description/i })
    await user.type(textarea, 'Product designer who can lead complex workflow improvements.')
    expect(textarea).toHaveValue('Product designer who can lead complex workflow improvements.')
    expect(screen.getByText(/\/3000/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear description/i }))
    expect(textarea).toHaveValue('')
    await user.type(textarea, 'This context should be cleared when the resume is removed.')
    await user.click(screen.getByRole('button', { name: 'Remove' }))
    await uploadFile(pdfFile('replacement.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    expect(screen.getByRole('textbox', { name: /job description/i })).toHaveValue('')
  })

  it('explains invalid type and oversized file validation', async () => {
    renderAnalyzer()
    await uploadFile(new File(['image'], 'resume.txt', { type: 'text/plain' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/not a supported resume format/i)
    expect(screen.getByText(/choose a pdf or word document/i)).toBeInTheDocument()

    cleanup()
    renderAnalyzer()
    const oversized = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46]), new Uint8Array(10 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' })
    await uploadFile(oversized)
    expect(await screen.findByRole('alert')).toHaveTextContent(/10.0 mb limit/i)

    cleanup()
    renderAnalyzer()
    await uploadFile(new File(['not really a PDF'], 'corrupt.pdf', { type: 'application/pdf' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/does not look readable/i)
  })

  it('supports drag-over feedback and remove/reset without stale parsed content', async () => {
    renderAnalyzer()
    const dropzone = screen.getByRole('button', { name: /choose a resume file.*drag and drop/i })
    fireEvent.dragEnter(dropzone)
    expect(dropzone).toHaveClass('dropzone--drag-over')
    fireEvent.drop(dropzone, { dataTransfer: { files: [pdfFile('resume.pdf')] } })
    await screen.findByRole('heading', { name: /here’s what we found/i })
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.getByRole('heading', { name: /bring the resume you want to improve/i })).toBeInTheDocument()
    expect(screen.queryByText('Jordan Lee')).not.toBeInTheDocument()
  })

  it('renders partial, empty, and parsing error states with recovery actions', async () => {
    renderAnalyzer()
    await uploadFile(pdfFile('partial-resume.pdf', 'partial'))
    expect(await screen.findByText(/partial extraction/i)).toBeInTheDocument()
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument()

    cleanup()
    renderAnalyzer()
    await uploadFile(pdfFile('empty-resume.pdf', 'empty'))
    expect(await screen.findByText(/no usable resume content found/i)).toBeInTheDocument()
    expect(screen.queryByText('Jordan Lee')).not.toBeInTheDocument()

    cleanup()
    renderAnalyzer()
    await uploadFile(pdfFile('error-resume.pdf', 'error'))
    expect(await screen.findByText(/we couldn’t process this document/i)).toBeInTheDocument()
    const retry = screen.getByRole('button', { name: /retry parse/i })
    expect(retry).toBeInTheDocument()
    await userEvent.click(retry)
    expect(await screen.findByText(/we couldn’t process this document/i)).toBeInTheDocument()
  })

  it('does not let an older parse response overwrite a newer file selection', async () => {
    renderAnalyzer()
    const input = screen.getByLabelText(/choose a resume file/i)
    fireEvent.change(input, { target: { files: [pdfFile('first.pdf', 'first')] } })
    fireEvent.change(input, { target: { files: [pdfFile('second.pdf', 'second')] } })
    await waitFor(() => expect(screen.getByText('second.pdf')).toBeInTheDocument())
    await screen.findByRole('heading', { name: /here’s what we found/i })
    expect(screen.getByText('second.pdf')).toBeInTheDocument()
    expect(screen.queryByText('first.pdf')).not.toBeInTheDocument()
  })
})

describe('Phase 4 analysis and results workflow', () => {
  it('returns deterministic bounded structured analysis from the service model', () => {
    const first = createMockAnalysis(analysisFixture, 'Product designer')
    const second = createMockAnalysis(analysisFixture, 'Product designer')
    expect(first.overallScore).toBeGreaterThanOrEqual(0)
    expect(first.overallScore).toBeLessThanOrEqual(100)
    expect(first.categoryScores).toHaveLength(6)
    expect(first.categoryScores.map((category) => category.label)).toEqual(['Content', 'Structure', 'Experience', 'Skills', 'Relevance', 'Readability'])
    expect(first.strengths.length).toBeGreaterThan(0)
    expect(first.improvementPriorities.length).toBeGreaterThan(0)
    expect(first.recommendations.length).toBeGreaterThan(0)
    expect(first.relevance.hasJobDescription).toBe(true)
    expect(first).toEqual(second)
  })

  it('runs analysis, shows loading, prevents duplicate requests, and navigates to results', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    await uploadFile(pdfFile('analysis-success.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    const analyzeButton = screen.getByRole('button', { name: /analyze my resume/i })
    await user.click(analyzeButton)
    expect(screen.getByRole('status', { name: /reading the signals/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /analyze my resume/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('heading', { name: /a clearer view of your resume/i })).toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByText(/overall resume score/i)).toBeInTheDocument()
    expect(screen.getByText(/score breakdown/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /keyword matching/i })).toBeInTheDocument()
    expect(screen.getByText(/requires a target job description/i)).toBeInTheDocument()
  })

  it('recovers from analysis failure without re-uploading the resume', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    await uploadFile(pdfFile('analysis-only.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    fireEvent.change(screen.getByRole('textbox', { name: /job description/i }), { target: { value: '[analysis-fail]' } })
    await user.click(screen.getByRole('button', { name: /analyze my resume/i }))
    expect(await screen.findByText(/analysis needs another try/i)).toBeInTheDocument()
    expect(screen.getByText('analysis-only.pdf')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry analysis/i })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: /job description/i }), { target: { value: 'Product designer with measurable outcomes.' } })
    await user.click(screen.getByRole('button', { name: /retry analysis/i }))
    expect(await screen.findByRole('heading', { name: /a clearer view of your resume/i }, { timeout: 3000 })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /back to analyzer workspace/i }))
    expect(screen.getByText('analysis-only.pdf')).toBeInTheDocument()
  })

  it('renders a meaningful no-analysis state and supports back navigation', async () => {
    const user = userEvent.setup()
    renderApp('/analysis')
    expect(screen.getByRole('heading', { name: /your results will appear here/i })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /go to analyzer/i }))
    expect(screen.getByRole('heading', { name: /turn your resume into clear next steps/i })).toBeInTheDocument()
  })

  it('renders all major result insight sections from a completed analysis', async () => {
    renderApp('/analyzer')
    await uploadFile(pdfFile('results-content.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    await userEvent.click(screen.getByRole('button', { name: /analyze my resume/i }))
    await waitFor(() => expect(screen.getByRole('heading', { name: /a clearer view of your resume/i })).toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByRole('heading', { name: /strengths/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /weaknesses/i })).toBeInTheDocument()
    expect(screen.getByText(/several bullets describe responsibilities without naming the measurable outcome/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /improvement priorities/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /actionable recommendations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /job relevance/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to analyzer workspace/i })).toBeInTheDocument()
  })
})

describe('Phase 5 keyword matching workflow', () => {
  it('returns deterministic matched, missing, and related keyword groups', () => {
    const first = createMockKeywordMatch(analysisFixture, 'Product designer with Figma, SQL, analytics, and accessibility experience.')
    const second = createMockKeywordMatch(analysisFixture, 'Product designer with Figma, SQL, analytics, and accessibility experience.')
    expect(first).toEqual(second)
    expect(first.matched).toEqual(expect.arrayContaining(['product', 'design', 'figma', 'accessibility']))
    expect(first.missing).toEqual(expect.arrayContaining(['analytics', 'sql']))
    expect(first.related).toEqual(expect.arrayContaining(['metrics', 'data']))
    expect(first.score).toBeGreaterThanOrEqual(0)
    expect(first.score).toBeLessThanOrEqual(100)
  })

  it('honors cancellation before keyword matching begins', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(keywordMatchingService.matchResumeToJob(analysisFixture, 'Product designer', controller.signal)).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('runs keyword matching after scoring, prevents duplicates, and renders service results', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    await uploadFile(pdfFile('keyword-success.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    fireEvent.change(screen.getByRole('textbox', { name: /job description/i }), { target: { value: 'Product designer with Figma, SQL, analytics, and accessibility experience.' } })
    await user.click(screen.getByRole('button', { name: /analyze my resume/i }))
    await waitFor(() => expect(screen.getByRole('status', { name: /comparing your resume/i })).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: /analyze my resume/i })).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('heading', { name: /a clearer view of your resume/i })).toBeInTheDocument(), { timeout: 3000 })
    expect(screen.getByRole('heading', { name: /keyword matching/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /matched keywords/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /missing keywords/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /related keywords/i })).toBeInTheDocument()
    expect(screen.getByText('figma')).toBeInTheDocument()
    expect(screen.getByText('sql')).toBeInTheDocument()
  })

  it('recovers from keyword matching failure with retry without re-uploading', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    await uploadFile(pdfFile('keyword-retry.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    fireEvent.change(screen.getByRole('textbox', { name: /job description/i }), { target: { value: '[keyword-fail]' } })
    await user.click(screen.getByRole('button', { name: /analyze my resume/i }))
    await waitFor(() => expect(screen.getByText(/keyword matching needs another try/i)).toBeInTheDocument(), { timeout: 3000 })
    expect(screen.getByText('keyword-retry.pdf')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: /job description/i }), { target: { value: 'Product designer with Figma and accessibility.' } })
    await user.click(screen.getByRole('button', { name: /retry keyword matching/i }))
    await waitFor(() => expect(screen.getByRole('heading', { name: /a clearer view of your resume/i })).toBeInTheDocument(), { timeout: 3000 })
    expect(screen.getByRole('heading', { name: /matched keywords/i })).toBeInTheDocument()
  })
})


describe('Phase 6 resume improvement chatbot', () => {
  it('returns deterministic contextual mock responses and handles no context', async () => {
    const analysis = createMockAnalysis(analysisFixture, 'Product designer with Figma and SQL experience.')
    const keywordMatch = createMockKeywordMatch(analysisFixture, 'Product designer with Figma and SQL experience.')
    const input = { resume: analysisFixture, analysis, jobDescription: 'Product designer with Figma and SQL experience.', keywordMatch, messages: [], message: 'Why is my score low?' }
    expect(responseFor(input)).toEqual(responseFor(input))
    const response = await resumeChatService.sendMessage(input)
    expect(response.role).toBe('assistant')
    expect(response.content).toMatch(/directional score is/i)
    const noContext = await resumeChatService.sendMessage({ resume: null, analysis: null, jobDescription: '', keywordMatch: null, messages: [], message: 'How can I improve my summary?' })
    expect(noContext.content).toMatch(/completed resume analysis/i)
  })

  it('renders prompts, prevents empty sends, supports keyboard focus, and returns a response', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    await uploadFile(pdfFile('chat-success.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    await user.click(screen.getByRole('button', { name: /analyze my resume/i }))
    await waitFor(() => expect(screen.getByRole('heading', { name: /a clearer view of your resume/i })).toBeInTheDocument(), { timeout: 3000 })
    expect(screen.getAllByRole('button', { name: /how can i improve my summary/i })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: /what keywords am i missing/i })).toHaveLength(1)
    expect(suggestedPrompts).toHaveLength(6)
    const input = screen.getByRole('textbox', { name: /ask a resume question/i })
    const send = screen.getByRole('button', { name: /send question/i })
    input.focus()
    expect(input).toHaveFocus()
    expect(send).toBeDisabled()
    await user.type(input, 'Why is my score low?')
    expect(send).toBeEnabled()
    await user.click(send)
    expect(screen.getByRole('status', { name: /thinking through your resume context/i })).toBeInTheDocument()
    expect(send).toBeDisabled()
    await waitFor(() => expect(screen.getByText(/your directional score is/i)).toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByRole('log', { name: /resume improvement conversation/i })).toBeInTheDocument()
  })

  it('shows a recoverable chat error, retries, and can clear the conversation', async () => {
    const user = userEvent.setup()
    renderAnalyzer()
    await uploadFile(pdfFile('chat-retry.pdf'))
    await screen.findByRole('heading', { name: /here’s what we found/i })
    await user.click(screen.getByRole('button', { name: /analyze my resume/i }))
    await waitFor(() => expect(screen.getByRole('heading', { name: /a clearer view of your resume/i })).toBeInTheDocument(), { timeout: 3000 })
    const input = screen.getByRole('textbox', { name: /ask a resume question/i })
    fireEvent.change(input, { target: { value: '[chat-fail]' } })
    await user.click(screen.getByRole('button', { name: /send question/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/mock chat response could not be completed/i)
    expect(screen.getByRole('button', { name: /retry response/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /retry response/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/mock chat response could not be completed/i)
    await user.click(screen.getByRole('button', { name: /clear conversation/i }))
    expect(screen.getByText(/ask a question to start/i)).toBeInTheDocument()
  })
})
