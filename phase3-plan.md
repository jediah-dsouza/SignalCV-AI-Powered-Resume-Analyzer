# Phase 3 Implementation Plan — Analyzer Workspace, Upload & Parsing

## Scope

Implement only the Analyzer Workspace flow from INITIAL through READY_TO_ANALYZE: upload, client-side validation, asynchronous mock parsing, structured parsed-resume review, optional job description input, reset/recovery, and Phase 4 analysis boundary. Do not implement real PDF/Word parsing, AI analysis, score generation, keyword matching, chatbot behavior, authentication, backend, database, payments, or persistence.

## Architecture

- `src/pages/AnalyzerPage.tsx` owns the deterministic analyzer state machine, request IDs, abort cancellation, transient file/parsed state, and reset behavior.
- `src/services/parser/uploadConfig.ts` centralizes supported `.pdf`/`.docx` types and the 10 MB maximum, plus validation and file metadata helpers.
- `src/services/parser/resumeParser.ts` implements the existing `ResumeParserService` boundary with a clearly temporary asynchronous mock. Filename markers (`partial`, `empty`, `error`/`fail`) make alternate parser outcomes deterministic for tests and manual verification.
- `src/services/contracts.ts` contains explicit domain interfaces for personal information, experience, education, projects, additional sections, parsed resumes, upload states, parser outcomes, and analyzer states.
- `src/components/analyzer/` contains the progress stepper, upload dropzone, file preview, parser statuses, parsed review, and job-description boundary.
- `src/styles/analyzer.css` extends the approved Career Signal visual system with responsive workspace, state, review, and form styles.

## Verification

Use the existing Vitest/React Testing Library suite and production TypeScript/Vite build. Manually inspect the Analyzer at desktop/mobile widths, perform a real browser upload with a temporary PDF, wait for the parsed review, remove/reset, verify keyboard focus, inspect browser console output, and check storage is not used for resume text.
