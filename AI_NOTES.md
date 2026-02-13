# AI_NOTES.md

This document explains how AI tools were used during development of the
Workflow Builder Lite project, what was manually verified, and which LLM
provider the app uses.

---

## AI Tools Used

1. ChatGPT (GPT-5.2)
2. Google Gemini

AI tools were used to:
- Brainstorm architecture
- Refine folder structure
- Review schema design ideas
- Suggest edge cases
- Validate error handling approaches
- Compare deployment options

All generated suggestions were reviewed, modified, and tested before being committed.

---

## What Was NOT Blindly Copied

- Workflow execution engine logic
- Step mapping implementation
- Run history retrieval logic
- Prisma schema adjustments
- API error handling structure
- UI state handling and edge cases

Each of the above was manually implemented or significantly rewritten after reviewing AI suggestions.

---

## LLM Used in the Application

Provider: Google Gemini  
Model: Gemini (latest stable production model at time of submission)

Reason for choosing Gemini:
- Reliable text transformation performance (summarization, tagging, extraction)
- Competitive latency
- Clean API integration
- Cost-effective for small workloads
- Good structured output handling

The application is written so that the LLM layer is abstracted in `lib/llm.ts`.
This allows replacing Gemini with OpenAI or any other provider without
changing the workflow engine logic.

---

## Where LLM Is Used in the App

LLM is used only for workflow steps that require language reasoning:
- Summarize
- Extract key points
- Tag category

Steps like "clean text" are implemented deterministically without LLM.

---

## Manual Verification Done

- Verified each step runs sequentially
- Confirmed outputs are stored correctly in database
- Tested invalid workflow configurations
- Tested empty input handling
- Simulated LLM failure to check API error response
- Checked last 5 run history ordering
- Verified health endpoint checks DB and LLM connectivity

---

## Security & Safety

- No API keys are committed to repository
- `.env.example` is provided
- Environment variables required:
  - DATABASE_URL
  - GEMINI_API_KEY

---

## Limitations

- No authentication (kept minimal for evaluation scope)
- No workflow editing UI (create + run only)
- No background job queue (runs synchronously)
- No streaming responses

These trade-offs were intentional to keep scope aligned with expected 2–8 hour effort.

---

This project demonstrates structured AI usage, not blind copy-paste.
All architectural decisions and implementation logic were reviewed and validated manually.
