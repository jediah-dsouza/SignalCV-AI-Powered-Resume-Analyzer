# Phase 6 Implementation Plan — Resume Improvement Chatbot

## Scope

Add only the contextual resume-improvement chatbot to `/analysis`. Preserve the existing Results page, scoring flow, keyword matching flow, and React/service boundaries. No real AI provider, API keys, backend, authentication, database, or unrelated redesign.

## Service and contracts

Extend the existing typed chatbot boundary with optional job-description and keyword-match context. Implement an asynchronous deterministic mock that returns contextual structured `ChatMessage` responses based on prompt intent and available context. It will support the `[chat-fail]` test marker, AbortSignal cancellation, and no-context responses without logging or persisting private content.

## Transient workflow state

Add conversation messages, sending/error status, and error text to the existing `AnalysisWorkflowProvider`. The Results chatbot will append user messages immediately, prevent duplicate sends, protect stale responses with request IDs and AbortControllers, retry the last user message, and clear/restart the conversation. Resetting the Analyzer clears chat state alongside analysis and keyword state.

## UI

Create a reusable `ResumeChatbot` Results component with suggested prompts, semantic chat log, user/assistant messages, accessible input/send controls, typing status, empty/no-context states, recoverable error/retry, disabled sending, and clear controls. Use existing calm analytical tokens, responsive breakpoints, visible focus, and reduced-motion support.

## Verification

Add focused service and UI tests for deterministic contextual output, prompts, empty prevention, loading/duplicate handling, success, failure/retry, no-context behavior, keyboard accessibility, and rendering. Run `pnpm test` and `pnpm build`; manually verify the complete upload → parse → JD → analyze → keyword → chatbot flow. Stop after Phase 6.
