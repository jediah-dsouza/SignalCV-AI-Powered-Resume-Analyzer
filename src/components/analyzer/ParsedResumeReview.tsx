import type { AdditionalSection, EducationEntry, ExperienceEntry, ParsedResume, ProjectEntry } from '../../services/contracts'

function MissingSection({ label, message }: { label: string; message: string }) { return <div className="missing-section"><span>{label}</span><p>{message}</p></div> }
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="review-section__heading"><p className="eyebrow">{eyebrow}</p><h3>{title}</h3></div> }
function ExperienceItem({ item }: { item: ExperienceEntry }) { return <article className="resume-entry"><div><h4>{item.role}</h4><p className="resume-entry__meta">{item.company} · {item.location || 'Location not detected'}</p><p className="resume-entry__dates">{item.startDate} – {item.current ? 'Present' : item.endDate}</p></div><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></article> }
function EducationItem({ item }: { item: EducationEntry }) { return <article className="resume-entry"><h4>{item.degree} · {item.field}</h4><p className="resume-entry__meta">{item.institution}</p><p className="resume-entry__dates">{item.startDate} – {item.endDate}</p></article> }
function ProjectItem({ item }: { item: ProjectEntry }) { return <article className="resume-entry"><h4>{item.name}</h4><p>{item.description}</p><div className="tag-list">{item.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></article> }
function AdditionalItem({ item }: { item: AdditionalSection }) { return <article className="resume-entry"><h4>{item.title}</h4><ul>{item.items.map((entry) => <li key={entry}>{entry}</li>)}</ul></article> }

export function ParsedResumeReview({ resume }: { resume: ParsedResume }) {
  const { candidate } = resume
  return <section className="analyzer-card parsed-review" aria-labelledby="parsed-review-title">
    <div className="review-header"><div><p className="eyebrow">Step 3 · Review</p><h2 id="parsed-review-title">Here’s what we found.</h2><p>Review the structured information before moving into the future analysis step.</p></div><span className="review-ready">Parsed</span></div>
    <div className="review-grid">
      <section className="review-section review-section--personal"><SectionHeading eyebrow="Personal information" title={candidate.name || 'Name not detected'} /><dl className="personal-info"><div><dt>Email</dt><dd>{candidate.email || 'Not detected'}</dd></div><div><dt>Phone</dt><dd>{candidate.phone || 'Not detected'}</dd></div><div><dt>Location</dt><dd>{candidate.location || 'Not detected'}</dd></div><div><dt>Links</dt><dd>{candidate.links.length ? candidate.links.join(' · ') : 'No links detected'}</dd></div></dl></section>
      <section className="review-section"><SectionHeading eyebrow="Professional summary" title="Summary" />{resume.summary ? <p className="review-copy">{resume.summary}</p> : <MissingSection label="Summary" message="No professional summary detected." />}</section>
      <section className="review-section review-section--wide"><SectionHeading eyebrow="Career history" title="Experience" />{resume.experience.length ? <div className="resume-entry-list">{resume.experience.map((item) => <ExperienceItem item={item} key={`${item.company}-${item.role}`} />)}</div> : <MissingSection label="Experience" message="No experience entries detected." />}</section>
      <section className="review-section"><SectionHeading eyebrow="Education" title="Education" />{resume.education.length ? <div className="resume-entry-list">{resume.education.map((item) => <EducationItem item={item} key={`${item.institution}-${item.degree}`} />)}</div> : <MissingSection label="Education" message="No education entries detected." />}</section>
      <section className="review-section"><SectionHeading eyebrow="Skills" title="Skills" />{resume.skills.length ? <div className="tag-list">{resume.skills.map((skill) => <span key={skill}>{skill}</span>)}</div> : <MissingSection label="Skills" message="No skills detected." />}</section>
      <section className="review-section"><SectionHeading eyebrow="Projects" title="Projects" />{resume.projects.length ? <div className="resume-entry-list">{resume.projects.map((item) => <ProjectItem item={item} key={item.name} />)}</div> : <MissingSection label="Projects" message="No projects detected." />}</section>
      <section className="review-section"><SectionHeading eyebrow="Additional sections" title="More from your resume" />{resume.additionalSections.length ? <div className="resume-entry-list">{resume.additionalSections.map((item) => <AdditionalItem item={item} key={item.title} />)}</div> : <MissingSection label="Additional sections" message="No additional sections detected." />}</section>
    </div>
  </section>
}
