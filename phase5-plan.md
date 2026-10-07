# Phase 5 Implementation Plan — Keyword Matching

## Scope

Add only deterministic keyword matching between the structured parsed resume and an optional job description. Preserve the existing React → service boundary and Phase 4 scoring flow. No provider, SDK, credentials, backend, authentication, database, chatbot, or unrelated features.

## Service and models

Extend the existing `KeywordMatch` contract with a bounded numeric match score, summary, and relevance insights while retaining matched, missing, and related keyword groups. Implement an abortable asynchronous mock service that derives candidates from the job description and structured resume fields only. A deterministic marker exercises failure for recovery tests; raw resume and job-description contents are never logged or persisted.

## Workflow integration

Extend the existing transient `AnalysisWorkflowProvider` with keyword result/status/error state. Analyzer runs scoring first, then runs keyword matching only when a non-empty job description exists. It preserves the score and parsed resume, prevents duplicate keyword requests with request IDs/AbortController, and supports keyword retry. When no job description is present, matching remains idle and the Results page explains the requirement. Existing Phase 4 navigation and scoring remain intact.

## Results UI

Create reusable keyword result components with semantic headings/lists and service-owned counts/metrics: matched, missing, related, summary, and relevance insights. Handle no-JD, idle, loading, success, empty, error, and retry states. Keep existing responsive breakpoints and calm analytical styling.

## Verification

Add service and behavior tests for deterministic groups, no-JD state, loading/success/error/retry, duplicate prevention, and Results rendering. Run `pnpm test` and `pnpm build`, then manually verify the full upload → parse → job description → analyze → results → keyword flow. Stop after Phase 5.
