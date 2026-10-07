import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useAnalysisWorkflow } from '../../app/analysisWorkflow'
import { resumeChatService } from '../../services/chatbot/chatbotService'
import type { ChatMessage } from '../../services/contracts'

const suggestedPrompts = [
  'How can I improve my summary?',
  'Rewrite this experience bullet.',
  'What skills should I highlight?',
  'Why is my score low?',
  'How can I make this resume more relevant?',
  'What keywords am I missing?',
]

function createUserMessage(content: string, index: number): ChatMessage {
  return { id: `user-${index + 1}`, role: 'user', content, timestamp: new Date().toISOString(), status: 'sent' }
}

export function ResumeChatbot() {
  const workflow = useAnalysisWorkflow()
  const [draft, setDraft] = useState('')
  const requestRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  const sendMessage = useCallback(async (value: string, retry = false) => {
    const message = value.trim()
    if (!message || workflow.chatStatus === 'sending') return
    const userMessage = retry ? workflow.chatMessages.filter((item) => item.role === 'user').at(-1) : createUserMessage(message, workflow.chatMessages.length)
    if (!userMessage) return
    const nextMessages = retry ? workflow.chatMessages : [...workflow.chatMessages, userMessage]
    const requestId = ++requestRef.current
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    if (!retry) workflow.setChatMessages(nextMessages)
    workflow.setChatStatus('sending')
    workflow.setChatError(null)
    setDraft('')
    try {
      const response = await resumeChatService.sendMessage({ resume: workflow.parsedResume, analysis: workflow.analysis, jobDescription: workflow.jobDescription, keywordMatch: workflow.keywordMatch, messages: nextMessages, message, signal: controller.signal })
      if (requestId !== requestRef.current || controller.signal.aborted) return
      workflow.setChatMessages([...nextMessages, response])
      workflow.setChatStatus('success')
    } catch (caught) {
      if (requestId !== requestRef.current || controller.signal.aborted) return
      workflow.setChatStatus('error')
      workflow.setChatError(caught instanceof Error ? caught.message : 'The mock chat response could not be completed. Please try again.')
    } finally {
      if (requestId === requestRef.current) abortRef.current = null
    }
  }, [workflow])

  const retry = useCallback(() => {
    const lastUserMessage = workflow.chatMessages.filter((item) => item.role === 'user').at(-1)
    if (lastUserMessage) void sendMessage(lastUserMessage.content, true)
  }, [sendMessage, workflow.chatMessages])

  const clearConversation = useCallback(() => {
    requestRef.current += 1
    abortRef.current?.abort()
    workflow.setChatMessages([])
    workflow.setChatStatus('idle')
    workflow.setChatError(null)
    inputRef.current?.focus()
  }, [workflow])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(draft)
  }

  return <section className="results-card resume-chatbot" aria-labelledby="resume-chatbot-title"><div className="results-section-heading"><p className="eyebrow">Your next edit</p><h2 id="resume-chatbot-title">Ask about your resume.</h2><p>Use the structured review, score, and keyword comparison to choose a focused improvement.</p></div>{!workflow.analysis && <p className="chat-empty">Complete a resume analysis before asking for contextual improvement suggestions.</p>}{workflow.analysis && <><div className="chat-prompts" aria-label="Suggested prompts"><p className="chat-label">Try a prompt</p><div className="chat-prompts__list">{suggestedPrompts.map((prompt) => <button key={prompt} className="chat-prompt" type="button" disabled={workflow.chatStatus === 'sending'} onClick={() => void sendMessage(prompt)}>{prompt}</button>)}</div></div><ol className="chat-log" role="log" aria-label="Resume improvement conversation" aria-live="polite">{workflow.chatMessages.map((message) => <li key={message.id} className={`chat-message chat-message--${message.role}`}><span className="chat-message__role">{message.role === 'user' ? 'You' : 'Resume guide'}</span><p>{message.content}</p></li>)}</ol>{workflow.chatMessages.length === 0 && workflow.chatStatus !== 'sending' && <p className="chat-empty">Ask a question to start a private, mock-based resume improvement conversation.</p>}{workflow.chatStatus === 'sending' && <p className="chat-status" role="status" aria-live="polite" aria-label="Thinking through your resume context">Thinking through your resume context…</p>}{workflow.chatStatus === 'error' && <div className="chat-error" role="alert"><p>{workflow.chatError ?? 'The response could not be completed.'}</p><button className="text-link" type="button" onClick={retry}>Retry response <span aria-hidden="true">↗</span></button></div>}<form className="chat-form" onSubmit={submit}><label htmlFor="resume-chat-input">Ask a resume question</label><textarea ref={inputRef} id="resume-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask how to improve one part of the resume…" rows={3} maxLength={500} disabled={workflow.chatStatus === 'sending'} /><div className="chat-form__actions"><span>{draft.length}/500</span><button className="button button--primary button--medium" type="submit" disabled={!draft.trim() || workflow.chatStatus === 'sending'}>Send question <span aria-hidden="true">↗</span></button></div></form><button className="text-link chat-clear" type="button" onClick={clearConversation} disabled={workflow.chatStatus === 'sending' || workflow.chatMessages.length === 0}>Clear conversation</button><p className="chat-disclaimer">Responses are deterministic mock guidance, not real AI advice. Resume content is kept in this transient workspace.</p></>}</section>
}

export { suggestedPrompts }
