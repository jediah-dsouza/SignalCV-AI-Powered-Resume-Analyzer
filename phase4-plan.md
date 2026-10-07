# Phase 4 Implementation Plan — AI Analysis & Resume Scoring

## Scope

Implement the complete READY_TO_ANALYZE → ANALYZING → ANALYZED → `/analysis` flow using the existing frontend-only service boundary. The analysis implementation is a deterministic asynchronous mock; no provider SDK, credentials, backend, database, authentication, keyword engine, or chatbot will be added.

## State architecture

- Add `AnalysisWorkflowProvider` above the routes to hold transient parsed resume, optional job description, analysis result, analysis status, and recoverable error across Analyzer → Results navigation.
- Keep parser/upload state local to `AnalyzerPage`, but sync parsed resume and job-description context into the workflow store when the review is ready.
- Use request IDs and AbortController in Analyzer analysis callbacks. Duplicate requests are disabled; stale results cannot overwrite newer requests; retry reuses the preserved parsed resume and job description.
- Navigate to `/analysis` only after a successful service response. Direct `/analysis` without transient result renders a meaningful empty state.

## Service and models

- Extend `ResumeAnalysis` with numeric `overallScore`, six named numeric category scores, strengths, weaknesses, improvement priorities, recommendations, summary, and relevance.
- Implement deterministic `mockAnalysisService` behind `ResumeAnalysisService`; use parsed resume structure and optional job-description presence to generate bounded 0–100 values and realistic observations. A filename marker or injected analysis input will deterministically exercise failure without exposing technical details in UI.

## Results UI

Create reusable result components for header, overall score card, score breakdown using native progress semantics, summary, strengths, improvement priorities, recommendations, relevance, and next steps. Present service-returned values only. Use the existing calm analytical visual language and CSS; no charting dependency.

## Verification

Run `pnpm test` and `pnpm build`. Add behavior tests for service determinism, Analyzer analyze availability/loading/duplicate prevention/success/failure retry, Results success/no-analysis/back navigation, and all major returned insight groups. Manually verify the Home → Analyzer → Upload → Parse → Review → Analyze → Results flow, failure/retry, direct no-analysis route, keyboard/focus, responsive layout, console, privacy, and stale-request behavior. Complete one independent read-only integration review before checkpointing.
