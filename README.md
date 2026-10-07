# SignalCV — AI-Powered Resume Analyzer

SignalCV is a responsive React frontend that helps people understand what is working in a resume, where the document needs stronger evidence, and which edits to prioritize next. It turns a resume upload into a structured review, a directional analysis, job-description keyword comparison, and contextual improvement guidance.

This repository contains a **frontend-only internship project**. Parsing, analysis, keyword matching, and chatbot responses are deterministic mock services. There is no real AI provider, backend, database, authentication, or user account system.

## Purpose

Resume feedback is often difficult to interpret: users may receive generic advice without knowing what to change first. SignalCV provides a transparent, step-by-step review surface so users can inspect extracted information before moving into analysis and recommendations.

## Implemented features

- Responsive marketing Home page explaining the product value and workflow
- Seven-step How It Works page
- Resume upload for PDF and supported Word `.docx` files
- Client-side validation for:
  - Unsupported file types
  - Files larger than 10 MB
  - Empty files
  - Files with unreadable PDF or Word signatures
- Deterministic mock parsing into:
  - Candidate information
  - Summary
  - Experience
  - Education
  - Skills
  - Projects
  - Certifications
  - Languages
  - Additional sections
- Partial, empty, parsing-error, retry, replace, and reset states
- Resume review before analysis
- Optional job-description input with character count and clear action
- Deterministic resume quality analysis with:
  - Overall score from 0–100
  - Six category scores
  - Summary
  - Strengths
  - Weaknesses
  - Job relevance context
  - Improvement priorities
  - Actionable recommendations
- Deterministic keyword comparison with matched, missing, and related terms
- Contextual resume-improvement chatbot with:
  - Suggested prompts
  - Loading, error, retry, and clear-conversation states
  - Duplicate-send prevention
  - 500-character input limit
- Abort and stale-response protection for asynchronous workflow steps
- Route-specific document titles and descriptions
- Semantic landmarks, keyboard interactions, visible focus, status announcements, and reduced-motion support
- No persistence of raw resume text to browser storage or logging output

## Complete user workflow

```text
Home
  → How It Works
  → Analyzer
  → Upload and validation
  → Parsing
  → Resume review
  → Optional job description
  → Analysis and scoring
  → Keyword matching
  → Recommendations
  → Contextual chatbot
  → Retry, reset, or return to Analyzer
```

### Route map

| Route | Purpose |
| --- | --- |
| `/` | Product overview, value proposition, workflow preview, sample analysis, and primary CTA |
| `/how-it-works` | Explains the complete seven-step product workflow and privacy/mock-service boundaries |
| `/analyzer` | Uploads and validates a resume, displays parsing states, shows the structured review, accepts job context, and starts analysis |
| `/analysis` | Displays loading, empty, error, score, strengths, weaknesses, relevance, keyword matching, recommendations, next steps, and chatbot states |

The route manifest is maintained at [`public/manus-routes.json`](public/manus-routes.json).

## Technology stack

- React 19
- TypeScript with strict compiler settings
- Vite
- React Router
- CSS with centralized design tokens and responsive media queries
- Vitest
- React Testing Library
- `pnpm` 11

No additional runtime services or environment variables are required.

## Architecture overview

The application is a client-rendered single-page application.

- `AppShell` provides the shared header, main landmark, and footer.
- `AppRoutes` maps the four supported routes.
- `AnalysisWorkflowProvider` holds transient cross-route state for the selected file, parsed resume, job description, analysis, keyword match, and chat conversation.
- Page components coordinate route-level workflow and state transitions.
- Feature components render focused UI sections for Home, Analyzer, and Results.
- Service modules expose replaceable contracts for parsing, analysis, matching, and chatbot behavior.
- CSS files are organized by design tokens, shared layout/utilities, and feature/page areas.
- No raw resume text is persisted or logged; it exists only in transient in-memory mock data.

## Mock service disclosure

All service behavior is deterministic and local to the frontend:

- **Resume parsing:** `src/services/parser/resumeParser.ts`
- **File validation:** `src/services/parser/uploadConfig.ts`
- **Analysis and scoring:** `src/services/analysis/analysisService.ts`
- **Keyword matching:** `src/services/matching/keywordService.ts`
- **Chatbot responses:** `src/services/chatbot/chatbotService.ts`
- **Shared contracts:** `src/services/contracts.ts`

No external AI/API credentials are required.

For manual state testing, the mock services recognize deterministic markers:

- File names containing `partial`, `empty`, `error`, or `fail` exercise parser states.
- A job description containing `[analysis-fail]` exercises analysis failure.
- A job description containing `[keyword-fail]` exercises keyword-matching failure.
- A chat message containing `[chat-fail]` exercises chatbot failure.

These markers are test fixtures for the frontend workflow and are not production integrations.

## Project structure

```text
.
├── index.html                 # HTML shell and baseline metadata
├── public/
│   ├── logo.png               # Site favicon/brand asset
│   ├── logo-source.svg        # Source logo asset
│   └── manus-routes.json      # Supported page route manifest
├── src/
│   ├── app/
│   │   ├── App.tsx            # Application shell composition
│   │   ├── analysisWorkflow.tsx # Transient cross-route workflow context
│   │   └── routes.tsx         # React Router route map
│   ├── components/
│   │   ├── analyzer/          # Upload, parsing, review, and job-description UI
│   │   ├── home/              # Home page sections and illustrative previews
│   │   ├── layout/            # Header, footer, page container, metadata
│   │   ├── results/            # Scores, insights, keywords, recommendations, chatbot
│   │   └── ui/                 # Shared buttons, cards, loading, and status primitives
│   ├── lib/brand.ts           # Centralized provisional branding constants
│   ├── pages/                 # Route-level page orchestration
│   ├── services/              # Deterministic mock service boundaries and contracts
│   ├── styles/                # Tokens, global styles, layout, utilities, and page CSS
│   └── test/                  # Vitest setup and integration tests
├── app.config.ts              # Managed Web project logo configuration
├── package.json
├── pnpm-lock.yaml
├── tsconfig*.json
├── vite.config.ts
└── vitest.config.ts
```

Historical phase planning files remain in the repository for project traceability. They are not runtime inputs.

## Installation and setup

Requirements:

- Node.js compatible with the project environment
- `pnpm` 11 or compatible pnpm version

Install dependencies:

```bash
pnpm install
```

Start the development server on port 3000:

```bash
pnpm dev
```

The Vite server listens on `0.0.0.0:3000` for the managed preview environment.

## Development commands

```bash
pnpm dev         # Start the Vite development server
pnpm test        # Run the Vitest integration suite once
pnpm test:watch  # Run Vitest in watch mode
pnpm build       # Type-check and create the production dist/ bundle
```

## Testing and verification

The integration suite covers the major user journey and recoverable states, including:

- Navigation and mobile menu behavior
- Upload, drag/drop, keyboard selection, and file validation
- Parsing success, partial, empty, failure, retry, replacement, and stale-response protection
- Analysis loading, duplicate-request prevention, failure, retry, and results navigation
- Keyword matching success, duplicate-request prevention, failure, and retry
- Chatbot prompts, empty-send prevention, loading, failure, retry, clear conversation, and context
- Results completeness, including strengths and weaknesses
- Route metadata and semantic illustration roles

Latest verified commands:

```text
pnpm test   → 27 tests passed
pnpm build  → successful TypeScript and Vite production build
```

## Privacy boundary

Resume content is treated as sensitive transient data. The application does not save raw resume text to `localStorage`, `sessionStorage`, a database, or a backend, and the codebase contains no debug logging of raw resume text. The current mock parser retains placeholder `rawText` only in in-memory service data so the service contract remains replaceable.

## Deployment and readiness notes

- The application builds as a static SPA into `dist/`.
- The four application routes and `/manus-routes.json` respond successfully through the development server.
- A production host must provide SPA fallback behavior so direct navigation to `/analyzer`, `/analysis`, and `/how-it-works` resolves to the application shell.
- The repository does not claim a permanent production deployment URL.
- Route metadata is updated client-side during navigation, with baseline metadata in `index.html`.
- No backend, authentication, database, external AI credentials, or persistent file storage is configured.
- Replacing the mock services with production adapters would require explicit backend and data/privacy decisions outside this project scope.

## Internship-task alignment

This project demonstrates:

- A responsive React UI across mobile, tablet, and desktop breakpoints
- Interactive and dynamic components with explicit loading, empty, error, success, partial, retry, and reset states
- Client-side file validation and asynchronous workflow coordination
- Component-based architecture organized by product area
- Typed service contracts and replaceable mock implementations
- Accessibility-minded semantic HTML, keyboard behavior, focus styling, status announcements, and reduced-motion support
- Automated testing with Vitest and React Testing Library
- Production build validation and route-manifest maintenance
- Maintainable documentation that distinguishes implemented behavior from future work

## Current limitations

- Parsing, scoring, keyword matching, and chatbot replies are deterministic mocks.
- There is no real AI/LLM integration.
- There is no backend, authentication, database, account system, or persistent user workspace.
- Resume data is not retained after the in-memory application session is gone.
- The current upload flow accepts file signatures and returns mock structured data; it does not extract arbitrary real PDF or Word document content.
- This repository does not claim a permanent public deployment.
