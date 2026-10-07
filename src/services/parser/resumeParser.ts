import type { ParsedResume } from '../contracts'
import { createResumeFile } from './uploadConfig'

export interface ResumeParserService {
  parse(file: File, signal?: AbortSignal): Promise<ParsedResume>
}

const baseExperience = {
  company: 'Northstar Studio',
  role: 'Product Designer',
  location: 'Remote',
  startDate: '2022',
  endDate: 'Present',
  current: true,
  bullets: [
    'Led end-to-end product design for a workflow used by cross-functional teams.',
    'Partnered with engineering and research to improve clarity across key journeys.',
  ],
}

const baseEducation = {
  institution: 'School of Visual Arts',
  degree: 'BFA',
  field: 'Interaction Design',
  startDate: '2016',
  endDate: '2020',
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Parsing was cancelled.', 'AbortError'))
    }, { once: true })
  })
}

function createParsedResume(file: File, mode: 'success' | 'partial' | 'empty'): ParsedResume {
  const resumeFile = createResumeFile(file)
  const partial = mode === 'partial'
  if (mode === 'empty') {
    return {
      id: resumeFile.id,
      file: resumeFile,
      candidate: { name: '', email: '', phone: '', location: '', links: [] },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      additionalSections: [],
      rawText: 'Transient empty mock parser text. This value is never rendered, persisted, or logged.',
      parsingMeta: { parser: 'mock-resume-parser', parsedAt: new Date().toISOString(), warnings: ['No meaningful content was detected.'] },
    }
  }
  return {
    id: resumeFile.id,
    file: resumeFile,
    candidate: {
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      phone: '(555) 014-2088',
      location: 'Brooklyn, NY',
      links: ['linkedin.com/in/jordanlee', 'jordanlee.design'],
    },
    summary: partial ? '' : 'Product designer focused on turning complex workflows into clear, useful experiences for ambitious teams.',
    experience: partial ? [baseExperience] : [baseExperience, {
      company: 'Field Notes Co.',
      role: 'UX Designer',
      location: 'New York, NY',
      startDate: '2020',
      endDate: '2022',
      current: false,
      bullets: ['Designed a research-informed component library used across three product areas.'],
    }],
    education: partial ? [] : [baseEducation],
    skills: partial ? ['Product design', 'Figma', 'Prototyping'] : ['Product design', 'UX research', 'Figma', 'Prototyping', 'Design systems', 'Accessibility'],
    projects: partial ? [] : [{ name: 'Open Studio Toolkit', description: 'A lightweight toolkit for organizing collaborative design critiques.', technologies: ['Figma', 'Notion'] }],
    certifications: partial ? [] : ['Certified Accessibility Specialist'],
    languages: partial ? [] : ['English', 'Spanish'],
    additionalSections: partial ? [] : [{ title: 'Volunteer work', items: ['Mentor, Design Futures Network'] }],
    rawText: 'Transient mock parser text. This value is never rendered, persisted, or logged.',
    parsingMeta: {
      parser: 'mock-resume-parser',
      parsedAt: new Date().toISOString(),
      warnings: partial ? ['Some sections were not detected in this mock parse.'] : [],
    },
  }
}

/** Temporary parser implementation for Phase 3. Replaceable with a real API/parser later. */
export const resumeParserService: ResumeParserService = {
  async parse(file, signal) {
    await wait(650, signal)
    const marker = file.name.toLowerCase()
    if (marker.includes('error') || marker.includes('fail')) throw new Error('The document could not be processed.')
    if (marker.includes('empty')) return createParsedResume(file, 'empty')
    if (marker.includes('partial')) return createParsedResume(file, 'partial')
    return createParsedResume(file, 'success')
  },
}
