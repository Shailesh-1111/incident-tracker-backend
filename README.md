# Incident Tracker Backend

A RESTful API built with Node.js, Express, and TypeScript for managing production incidents. Designed to support a Jira/Zoho-style incident management dashboard.

## Features

- **Full CRUD**: Create, Read, Update, and Delete production incidents.
- **Advanced Filtering**: Filter incidents by Status, Severity, and Service.
- **Search Capability**: Search across incident titles and services.
- **Real-time Stats**: Dedicated endpoint for incident counts and statistics.
- **Validation**: Schema-based request validation using Zod.
- **Database**: PostgreSQL with Prisma ORM for type-safe database access.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **API Style**: REST

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/incident_tracker"
   PORT=3000
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Running the App

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm run build
  npm start
  ```

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/incidents` | Get all incidents (with search/filter/sort) |
| `GET` | `/api/incidents/:id` | Get incident by ID |
| `POST` | `/api/incidents` | Create a new incident |
| `PATCH` | `/api/incidents/:id` | Update an existing incident |
| `DELETE` | `/api/incidents/:id` | Delete an incident |
| `GET` | `/api/incidents/counts` | Get incident statistics |
| `GET` | `/api/incidents/filters` | Get available filter options (Services, etc.) |

## Data Model

```prisma
enum Severity { SEV1, SEV2, SEV3, SEV4 }
enum Status { OPEN, MITIGATED, RESOLVED }

model Incident {
  id        String    @id
  title     String
  service   String
  severity  Severity
  status    Status    @default(OPEN)
  owner     String?
  summary   String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```
