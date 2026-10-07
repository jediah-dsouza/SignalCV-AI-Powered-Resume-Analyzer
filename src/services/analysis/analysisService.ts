import type { ParsedResume, ResumeAnalysis } from '../contracts'

export interface ResumeAnalysisService {
  analyzeResume(resume: ParsedResume, jobDescription?: string, signal?: AbortSignal): Promise<ResumeAnalysis>
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Analysis was cancelled.', 'AbortError'))
    }, { once: true })
  })
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function createMockAnalysis(resume: ParsedResume, jobDescription?: string): ResumeAnalysis {
  const hasJobDescription = Boolean(jobDescription?.trim())
  const experienceScore = clampScore(54 + resume.experience.length * 12 + (resume.experience.some((entry) => entry.bullets.some((bullet) => /\d/.test(bullet))) ? 8 : 0))
  const skillsScore = clampScore(48 + resume.skills.length * 7)
  const contentScore = clampScore(54 + (resume.summary ? 16 : 0) + (resume.experience.length ? 12 : 0) + (resume.projects.length ? 7 : 0))
  const structureScore = clampScore(58 + (resume.education.length ? 10 : 0) + (resume.experience.length ? 12 : 0) + (resume.projects.length ? 6 : 0))
  const readabilityScore = clampScore(62 + (resume.summary ? 8 : 0) + (resume.skills.length >= 5 ? 10 : 0))
  const relevanceScore = clampScore(62 + (hasJobDescription ? 14 : 0) + (resume.skills.length >= 4 ? 8 : 0))
  const categoryScores = [
    { id: 'content' as const, label: 'Content', score: contentScore, interpretation: contentScore >= 75 ? 'Your core story is easy to understand.' : 'Your story is present, with room for sharper evidence.' },
    { id: 'structure' as const, label: 'Structure', score: structureScore, interpretation: structureScore >= 75 ? 'Sections give the reader a dependable path.' : 'A few structural cues could make scanning easier.' },
    { id: 'experience' as const, label: 'Experience', score: experienceScore, interpretation: experienceScore >= 75 ? 'Your experience shows useful scope and progression.' : 'The experience section would benefit from more specific outcomes.' },
    { id: 'skills' as const, label: 'Skills', score: skillsScore, interpretation: skillsScore >= 75 ? 'Your skills are visible and relevant to your profile.' : 'Make the most important skills easier to connect to your evidence.' },
    { id: 'relevance' as const, label: 'Relevance', score: relevanceScore, interpretation: hasJobDescription ? 'This review includes the job context you supplied.' : 'A job description would enable more specific relevance guidance.' },
    { id: 'readability' as const, label: 'Readability', score: readabilityScore, interpretation: readabilityScore >= 75 ? 'The document has a clear reading rhythm.' : 'Small wording and hierarchy improvements can reduce scanning effort.' },
  ]
  const overallScore = clampScore(categoryScores.reduce((sum, category) => sum + category.score, 0) / categoryScores.length)
  return {
    overallScore,
    categoryScores,
    summary: hasJobDescription ? 'Your resume has a credible foundation. The clearest next gains come from making outcomes more measurable and connecting your strongest skills to the target role.' : 'Your resume has a credible foundation. The clearest next gains come from making outcomes more measurable and adding job context for a more specific review.',
    strengths: [
      resume.summary ? 'A focused professional summary gives the reader useful context quickly.' : 'Your experience provides a starting point for a stronger professional summary.',
      resume.skills.length >= 4 ? 'A visible skills set supports quick profile scanning.' : 'Your skills can become a stronger signal with more direct evidence in experience bullets.',
      resume.experience.length >= 2 ? 'Multiple experience entries show breadth across your career story.' : 'Your experience section gives the analysis a clear starting point.',
    ],
    weaknesses: [
      'Several bullets describe responsibilities without naming the measurable outcome.',
      resume.projects.length ? 'Projects are present but could show more impact or ownership.' : 'A project or portfolio section could add useful evidence of applied work.',
    ],
    improvementPriorities: [
      { id: 'impact', issue: 'Make recent experience more outcome-led.', whyItMatters: 'Specific outcomes help a reader understand the value of your work, not just the tasks you performed.', suggestedAction: 'Add a number, scale, time frame, or before-and-after result to two recent bullets.' },
      { id: 'summary', issue: 'Sharpen the opening summary around the role you want next.', whyItMatters: 'The first few lines frame how the rest of the resume is interpreted.', suggestedAction: 'Name your specialty, strongest evidence, and the kind of problem you solve in two or three sentences.' },
    ],
    recommendations: [
      { id: 'recommendation-1', priority: 'high', section: 'Experience', text: 'Add measurable outcomes to your two most recent experience bullets.' },
      { id: 'recommendation-2', priority: 'high', section: 'Summary', text: 'Rewrite the summary so the target role and strongest specialty appear in the opening sentence.' },
      { id: 'recommendation-3', priority: 'medium', section: 'Skills', text: 'Pair your most important skills with one concrete example in the experience section.' },
    ],
    relevance: hasJobDescription
      ? { hasJobDescription: true, headline: 'This review includes the target job description you provided.', observations: ['Your resume has a visible skills foundation to compare against the role.', 'The next relevance step will be a dedicated keyword and requirements comparison in a later phase.'] }
      : { hasJobDescription: false, headline: 'Add a job description for more specific relevance guidance.', observations: ['This result focuses on the resume itself.', 'Job-specific matching and keyword comparison will be available in a later phase.'] },
    analyzedAt: resume.parsingMeta.parsedAt,
  }
}

/** Temporary frontend-only implementation. Replace with a backend adapter later. */
export const resumeAnalysisService: ResumeAnalysisService = {
  async analyzeResume(resume, jobDescription, signal) {
    await wait(900, signal)
    if (jobDescription?.includes('[analysis-fail]')) throw new Error('The analysis could not be completed. Please try again.')
    return createMockAnalysis(resume, jobDescription)
  },
}

export { createMockAnalysis }
