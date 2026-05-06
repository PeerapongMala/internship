# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Golang REST API backend for Dental Plus, a dental clinic chatbot system. The API provides FAQ management, AI-powered chat using Google Gemini, and various dental clinic data endpoints (schedules, promotions, branch info).

## Development Commands

### Building and Running
```bash
# Run the application
go run main.go

# Build the application
go build -o dental-plus-api.exe

# Run the compiled binary
./dental-plus-api.exe
```

### Dependencies
```bash
# Install/update dependencies
go mod download

# Tidy up dependencies
go mod tidy
```

### Database
The application uses PostgreSQL with pgx driver. Database migrations run automatically on startup. Connection is configured via `DATABASE_URL` environment variable (see .env.example).

## Architecture

### Core Flow
1. **Entry Point**: `main.go` initializes database, sets up Chi router, registers middleware and routes
2. **Database**: `config/database.go` handles connection pooling (pgxpool), runs migrations, and inserts sample data on first run
3. **Handlers**: HTTP request handlers in `handlers/` parse requests, call services, return JSON responses
4. **Services**: Business logic in `services/` - Gemini API integration and MCP tools
5. **Models**: Data structures in `models/` define request/response schemas

### AI Chat Architecture
The chat system (`handlers/ai_chat.go`) implements a tool-calling pattern with Google Gemini:
1. User message sent to Gemini with system prompt and tool declarations
2. Gemini may respond with text OR a function call
3. Function calls are executed via `executeFunctionCall()` which dispatches to MCP tools
4. Function results are sent back to Gemini for final response generation
5. Response includes text, tool usage tracking, and source citations

### Vector Embeddings
FAQs support semantic search using vector embeddings:
- Embeddings generated via Gemini `text-embedding-004` model
- Stored in PostgreSQL as `vector(768)` type (requires pgvector extension)
- Search uses cosine similarity (`<=>` operator)
- Automatic fallback to text-based search (ILIKE) if embeddings unavailable
- Generate embeddings via `POST /api/embeddings/generate` endpoint

### MCP Tools System
MCP (Model Context Protocol) tools in `services/mcp_tools.go` provide structured data access:
- `get_doctor_schedule`: Query doctor schedules by name/branch
- `get_promotions`: Retrieve active promotions
- `get_branch_info`: Get branch details (hardcoded data)
- `search_faq`: Semantic/text search through FAQs
- Tool declarations follow Gemini function calling schema

### Database Schema
Key tables managed by migrations in `config/database.go:runMigrations()`:
- `faqs`: Question/answer pairs with vector embeddings, category, view count
- `faq_categories`: Category definitions
- `chat_questions`: User questions logged from chat (for analytics)
- `settings`: App configuration (intro message)
- `doctor_schedules`: Doctor availability by day/time/branch
- `promotions`: Active promotions with date ranges

### Environment Variables
Required in `.env` file:
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: HTTP server port (default: 8080)
- `GEMINI_API_KEY`: Google Gemini API key for chat and embeddings

## Important Notes

### Gemini Integration
- Uses `gemini-2.5-flash` model for chat
- Uses `text-embedding-004` for embeddings
- System prompt in Thai language defines chatbot behavior and response format
- API calls include timeout via context from HTTP request

### Database Connection
- Uses connection pooling via `pgxpool.Pool`
- Pool stored in global `config.DB` variable
- Connection tested on startup with `Ping()`
- Graceful shutdown via `defer config.CloseDatabase()` in main

### Error Handling Pattern
Services return embedding/chat errors which handlers convert to HTTP errors. Vector search failures automatically fallback to text search rather than failing the request.

### Thai Language Support
The chatbot responds in Thai language. System prompts, FAQ sample data, and tool descriptions are all in Thai.
