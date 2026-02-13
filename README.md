# Workflow Builder Lite (Problem B)

A type-safe, AI-powered text processing pipeline built with **Next.js**, **Prisma**, and **GroqAI**. This application allows users to build custom workflows by chaining multiple AI actions (Clean, Summarize, Extract, Tag) together in a specific sequence.

## ✨ Features
- **Visual Workflow Builder:** Add up to 4 processing steps in any order.
- **Sequential Chaining:** The output of one AI step is automatically fed as the input to the next step.
- **Real-time Status:** A dedicated health page to verify Database and LLM connectivity.
- **Execution History:** Persistence of the last 5 runs using Prisma and PostgreSQL.
- **Responsive UI:** Built with Tailwind CSS for a clean, modern experience.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** Prisma ORM (with PostgreSQL/SQLite)
- **AI:** Groq-llama-3.1-8b-instant
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- An Groq API Key

### 2. Environment Setup
Create a `.env` file in the root directory:
```text
DATABASE_URL="your_database_connection_string"
GROQ_API_KEY="your_openai_api_key"
```
Terminal commands
```text
1. Run `npx prisma db push`: This maps your schema.prisma to the actual database (creates the tables).

2. Run `npx prisma generate`: This creates the @prisma/client code in your node_modules so you get autocomplete in VS Code.

3. Run `npm run dev`
```