import type { KeywordMatch, ParsedResume } from '../contracts'

export interface KeywordMatchingService {
  matchResumeToJob(resume: ParsedResume, jobDescription: string, signal?: AbortSignal): Promise<KeywordMatch>
}

const keywordAliases: Record<string, string[]> = {
  accessibility: ['accessibility', 'inclusive design', 'a11y'],
  analytics: ['analytics', 'data analysis', 'metrics'],
  design: ['design', 'designer', 'designing'],
  figma: ['figma'],
  leadership: ['leadership', 'lead', 'leading', 'manage', 'managed'],
  product: ['product', 'product design', 'product designer'],
  prototyping: ['prototyping', 'prototype', 'prototypes'],
  research: ['research', 'research-informed', 'user research'],
  sql: ['sql'],
  'design systems': ['design systems', 'component library', 'component libraries'],
  workflows: ['workflow', 'workflows', 'process improvement'],
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Keyword matching was cancelled.', 'AbortError'))
      return
    }
    const timeout = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Keyword matching was cancelled.', 'AbortError'))
    }, { once: true })
  })
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function resumeCorpus(resume: ParsedResume) {
  return normalize([
    resume.summary,
    resume.skills.join(' '),
    resume.experience.flatMap((entry) => [entry.role, entry.company, entry.bullets.join(' ')]).join(' '),
    resume.projects.flatMap((project) => [project.name, project.description, project.technologies.join(' ')]).join(' '),
    resume.certifications.join(' '),
  ].join(' '))
}

function includesAlias(corpus: string, aliases: string[]) {
  return aliases.some((alias) => corpus.includes(normalize(alias)))
}

function createMockKeywordMatch(resume: ParsedResume, jobDescription: string): KeywordMatch {
  const corpus = resumeCorpus(resume)
  const job = normalize(jobDescription)
  const requested = Object.keys(keywordAliases).filter((keyword) => includesAlias(job, keywordAliases[keyword]))
  const stopWords = new Set(['and', 'the', 'with', 'for', 'from', 'that', 'this', 'are', 'you', 'your', 'our', 'into', 'role', 'have', 'has', 'will', 'years', 'year', 'experience'])
  const jobTerms = job.split(' ').filter((term) => term.length > 2 && !stopWords.has(term))
  const candidates = [...new Set([...requested, ...jobTerms])]
  const matched = candidates.filter((keyword) => includesAlias(corpus, keywordAliases[keyword] ?? [keyword]))
  const missing = candidates.filter((keyword) => !matched.includes(keyword))
  const related = missing.flatMap((keyword) => keyword === 'analytics' ? ['metrics'] : keyword === 'leadership' ? ['ownership'] : keyword === 'sql' ? ['data'] : keyword === 'design systems' ? ['component libraries'] : keyword === 'research' ? ['user research'] : []).filter((keyword, index, list) => list.indexOf(keyword) === index)
  const score = Math.round((matched.length / Math.max(candidates.length, 1)) * 100)
  return {
    score,
    matched,
    missing,
    related,
    summary: matched.length ? `Your resume directly reflects ${matched.length} of ${candidates.length} keywords identified in the job description.` : 'No direct keyword matches were detected in the structured resume review yet.',
    insights: missing.length ? ['Use the missing terms only when they accurately describe your experience.', 'Related concepts can help you choose stronger evidence without copying the job description verbatim.'] : ['Your resume already reflects the main terms detected in this job description.', 'Keep the wording grounded in evidence from your experience.'],
    explanation: 'This is a deterministic mock comparison of structured resume fields and the job description. A later phase can replace it with a backend-powered matching service.',
  }
}

/** Temporary frontend-only implementation. Replace with a backend adapter later. */
export const keywordMatchingService: KeywordMatchingService = {
  async matchResumeToJob(resume, jobDescription, signal) {
    await wait(700, signal)
    if (jobDescription.includes('[keyword-fail]')) throw new Error('Keyword matching could not be completed. Please try again.')
    return createMockKeywordMatch(resume, jobDescription)
  },
}

export { createMockKeywordMatch }
