import type { ChatMessage, ResumeChatContext } from '../contracts'

export interface ResumeChatServiceInput extends ResumeChatContext {
  messages: ChatMessage[]
  message: string
  signal?: AbortSignal
}

export interface ResumeChatService {
  sendMessage(input: ResumeChatServiceInput): Promise<ChatMessage>
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Chat response was cancelled.', 'AbortError'))
      return
    }
    const timeout = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Chat response was cancelled.', 'AbortError'))
    }, { once: true })
  })
}

function responseFor(input: ResumeChatServiceInput) {
  const prompt = input.message.toLowerCase()
  if (!input.resume || !input.analysis) return 'I can help with resume improvements once a completed resume analysis is available. Upload a resume and run the analysis first.'
  if (prompt.includes('summary')) return `Your summary already gives useful context. ${input.analysis.recommendations.find((recommendation) => recommendation.section === 'Summary')?.text ?? 'Name your target role, strongest specialty, and evidence in the opening lines.'}`
  if (prompt.includes('bullet') || prompt.includes('experience')) return `Focus your next bullet on an outcome, not only a responsibility. ${input.analysis.improvementPriorities[0]?.suggestedAction ?? 'Add a measurable result, scale, or time frame.'}`
  if (prompt.includes('skill')) return input.keywordMatch?.matched.length ? `Keep highlighting ${input.keywordMatch.matched.slice(0, 3).join(', ')} because they already connect your resume to the target role.` : 'Choose the skills that are both central to the target role and supported by concrete experience evidence.'
  if (prompt.includes('score') || prompt.includes('low')) return `Your directional score is ${input.analysis.overallScore}/100. The fastest gains come from ${input.analysis.improvementPriorities[0]?.issue.toLowerCase() ?? 'adding clearer evidence'}.`
  if (prompt.includes('relevant') || prompt.includes('keyword')) return input.keywordMatch?.missing.length ? `Your keyword comparison found missing terms including ${input.keywordMatch.missing.slice(0, 3).join(', ')}. Add them only where they accurately describe your experience.` : input.jobDescription.trim() ? 'Your resume has a strong direct keyword foundation for this job description. Keep the wording grounded in evidence.' : 'Add a target job description to get specific relevance and keyword guidance.'
  return `Start with this next edit: ${input.analysis.improvementPriorities[0]?.suggestedAction ?? 'Make one recent experience bullet more specific and outcome-led.'}`
}

/** Temporary frontend-only implementation. Replace with a backend adapter later. */
export const resumeChatService: ResumeChatService = {
  async sendMessage(input) {
    await wait(650, input.signal)
    if (input.message.includes('[chat-fail]')) throw new Error('The mock chat response could not be completed. Please try again.')
    return {
      id: `assistant-${input.messages.length + 1}`,
      role: 'assistant',
      content: responseFor(input),
      timestamp: new Date(input.messages.length * 1000).toISOString(),
      status: 'sent',
    }
  },
}

export { responseFor }
