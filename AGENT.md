# AGENT.md

## AI Tools Used

### Claude (Anthropic)

Claude was used throughout the project for debugging Drizzle ORM query syntax issues, writing Zod validators, structuring the Jest + Supertest test suite, designing and refining the Tailwind v4 theme and component CSS, reviewing pagination and edge-case logic, diagnosing the production 500 error caused by missing migrations on the Neon production branch, planning the git commit structure, and generating this README and AGENT.md content.

### GitHub Copilot (VS Code)

GitHub Copilot was used for scaffolding the initial frontend component structure from a detailed spec prompt, then for the UI-only mock-data pass, then for the visual-polish pass to move away from a generic dashboard look, and finally for the axios/API integration pass.

## Example prompts

- UI-only mock-data prompt: create the lead tracker UI from a detailed spec using local mock data and React useState, with a clean ledger-style table and status control.
- Visual-polish/status-UX prompt: refine the screen so it feels more like a purpose-built CRM ledger, not a generic dashboard template; improve the status badge, popover behavior, and spacing.
- Axios/API-integration prompt: replace the mock data layer with a real backend API using axios and a custom hook while preserving the current component layout and interaction patterns.

## AI-generated sections

- Initial component scaffolding for the React frontend
- Tailwind theme tokens and custom color system for the ledger-inspired design
- Drizzle ORM table configuration and schema ideas
- Jest test file structure and API test cases for create, list, search, pagination, and status update flows
- Vitest + @testing-library/react component test structure for LeadForm validation, StatusBadge popover interaction and keyboard accessibility, SearchBar, Pagination, and LeadTable rendering
- Initial UI state architecture and form validation logic
- Visual refinements to the table, row styling, and status interaction pattern
- Initial draft of the project documentation and handoff notes

## Manually written / reviewed sections

These are the technical and project-specific items that were reviewed and finalized by hand:

- Backend project structure and file responsibilities:
  - src/app.js for Express setup, CORS restrictions from FRONTEND_ORIGIN, and route mounting
  - src/index.js for the server entrypoint using process.env.PORT
  - src/db/db.js for pg Pool creation, DATABASE_URL validation, and Neon-compatible SSL setup
  - src/db/schema.js for the leads table: id, name, email, phone, status enum, created_at
  - src/controllers/leadController.js for getAllLeads, createLead, and updateLeadStatus
  - src/routes/leadRoutes.js for the route-to-controller wiring
  - src/validators/leadValidator.js for Zod validation rules
  - src/test/leads.test.js for backend API coverage across create, search, pagination, status update, not-found, and validation error cases
- Frontend project structure and file responsibilities:
  - src/types/lead.ts for Lead, LeadStatus, response interfaces, and pagination types
  - src/api/leads.ts for axios client methods: fetchLeads, createLead, updateLeadStatus
  - src/hooks/useLeads.ts for debounced search, pagination, loading/error state, and optimistic status updates
  - src/components/LeadForm.tsx for create-lead validation and async submission flow
  - src/components/LeadTable.tsx for ledger-style rendering and timestamp formatting
  - src/components/StatusBadge.tsx for the combined badge + popover control behavior
  - src/components/SearchBar.tsx and src/components/Pagination.tsx for search and page controls
  - component test coverage using Vitest + @testing-library/react + @testing-library/jest-dom + @testing-library/user-event for LeadForm validation, StatusBadge popover interaction and keyboard accessibility, SearchBar, Pagination, and LeadTable rendering
- Environment variables and deployment details:
  - DATABASE_URL for Neon Postgres
  - PORT for Render
  - FRONTEND_ORIGIN for backend CORS
  - VITE_API_URL for the frontend deployment
  - .env.test for the separate Neon test branch used by Jest/Supertest
- API contract review:
  - GET /leads with search, page, and pageSize query params
  - POST /leads for lead creation
  - PATCH /leads/:id/status for status updates
  - Response shape { status, message, data, pagination? }
  - Pagination payload: page, size, totalPages; no total count by design
- Validation and edge-case review:
  - trimming input values for name, email, and phone
  - duplicate email detection and exact backend message handling
  - search matching on name and email only, case-insensitive via ilike
  - pagination boundary handling when an out-of-range page is requested
  - validation logic for invalid email, short phone, invalid status values, and not-found cases
- CORS and deployment review:
  - restricting browser access to the known frontend origin via FRONTEND_ORIGIN
  - Render backend deployment with Root Directory backend, Build Command npm install, Start Command npm start
  - Vercel frontend deployment with Root Directory frontend and the VITE_API_URL environment variable pointing at the Render API
- Debugging and production review:
  - API response-shape corrections after mismatches between controller output and test assertions
  - diagnosing and fixing the production 500 caused by missing migrations on the Neon production branch
  - verifying the Render free-tier cold-start behavior and documenting the 30-60 second delay after inactivity
  - reviewing the design choice to run migrations manually instead of automating them in the Render build step

## Key engineering decisions

- Chose Drizzle ORM over Prisma for a lighter footprint and better compatibility with Neon serverless Postgres connections.
- Built the UI against mock data first so the frontend could be iterated quickly before the backend was ready.
- Merged the status badge and status selector into one control to avoid redundant UI clutter and improve usability.
- Kept the pagination response intentionally minimal by returning only totalPages, not a total lead count, to match the deliberate scope of the project.
- Restricted backend CORS through the FRONTEND_ORIGIN environment variable instead of hardcoding an origin, making the project portable across environments.
- Ran migrations manually against each environment's DATABASE_URL instead of automating them in the Render build step, reducing the risk of a failed migration blocking deployment.
- Kept the backend public by design for this project scope, with the understanding that authentication and rate limiting are future improvements rather than part of the current version.
