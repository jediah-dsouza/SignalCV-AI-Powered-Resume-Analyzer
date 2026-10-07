import { PageContainer } from '../layout/PageContainer'

const prompts = ['How can I improve my summary?', 'Rewrite this experience bullet.', 'What keywords am I missing?']

export function ChatbotPreview() {
  return (
    <section className="home-section home-section--chat" aria-labelledby="chat-preview-title">
      <PageContainer className="chat-preview__grid">
        <div className="chat-window" role="img" aria-label="Illustrative resume-aware chatbot preview">
          <div className="chat-window__header"><span className="chat-avatar" aria-hidden="true">✦</span><div><strong>Resume coach</strong><span>Understands your analysis context</span></div><span className="chat-live"><span aria-hidden="true" />Preview</span></div>
          <div className="chat-window__messages">
            <div className="chat-bubble chat-bubble--ai">Your experience is strong. Want to make one bullet more specific?</div>
            <div className="chat-bubble chat-bubble--user">How can I improve my summary?</div>
            <div className="chat-bubble chat-bubble--ai">Lead with the role you want, then connect your strongest outcome to it.</div>
          </div>
          <div className="chat-window__input" aria-hidden="true"><span>Ask about your resume...</span><span className="chat-send">↗</span></div>
        </div>
        <div className="chat-preview__copy">
          <p className="eyebrow">A second set of eyes</p>
          <h2 id="chat-preview-title">Ask better questions about your resume.</h2>
          <p>After analysis, a resume-aware AI chatbot will help you explore the feedback, rewrite a bullet, or understand a missing keyword.</p>
          <div className="prompt-list" aria-label="Example chatbot prompts">
            {prompts.map((prompt) => <span className="prompt-chip" key={prompt}>{prompt}</span>)}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
