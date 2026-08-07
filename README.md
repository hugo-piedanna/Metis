# Metis

Home inventory management app — keep a clear view of what you own, so nothing gets forgotten.

> **Status:** early / work in progress. The project is open source and may be resumed or reshaped over time. There is no production deployment planned for now.

## Why Metis

In Greek mythology, Metis is the goddess of wisdom and good organization. The name reflects the goal of the app: help people stay organized at home and manage everyday stocks with less friction.

## What it does

Metis lets you track quantities of items in your cupboards — food or non-food — and organize them with categories so you can see at a glance what you have available.

**Current backend resources (CRUD):**

| Resource     | Role                                      |
| ------------ | ----------------------------------------- |
| Categories   | Group products                            |
| Products     | Items you track                           |
| Lots         | Stock batches / quantities for a product  |
| Units        | Measurement units (e.g. kg, piece, L)     |

A frontend is not part of the repository yet.

## Tech stack

- **API:** [NestJS](https://nestjs.com/) (TypeScript)
- **ORM:** TypeORM
- **Database:** PostgreSQL 16
- **Runtime / tooling:** Node.js 20, Docker Compose, Winston logging

## Project structure

```text
Metis/
├── backend/          # NestJS API
├── compose.yml       # Postgres + backend for local development
├── .env.exemple      # Environment variable template
├── BRANCHING_POLICY.md
├── API_RESPONSE_CONVENTIONS.md
├── CONTRIBUTING.md
└── LICENSE
```

## Getting started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- (Optional) Node.js 20+ if you want to run the API outside Docker

### 1. Clone and configure

```bash
git clone https://github.com/hugo-piedanna/Metis.git
cd Metis
cp .env.exemple .env
```

Fill in `.env` (see [Environment variables](#environment-variables)). `POSTGRES_URL` must point at the Compose Postgres service when you use Docker, for example:

```env
POSTGRES_URL=postgresql://metis:metis@postgres:5432/metis
```

### 2. Start with Docker Compose

```bash
docker compose up --build
```

This starts PostgreSQL and the NestJS API in watch mode.

### 3. (Optional) Run the API locally

With Postgres running (via Compose or otherwise) and a valid `.env`:

```bash
cd backend
npm install
npm run start:dev
```

### Useful scripts (`backend/`)

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run start:dev`| Dev server with watch    |
| `npm run build`    | Compile the project      |
| `npm run lint`     | ESLint                   |
| `npm test`         | Unit tests               |
| `npm run test:e2e` | End-to-end tests         |

## Environment variables

Template: [`.env.exemple`](.env.exemple)

| Variable            | Description                                      |
| ------------------- | ------------------------------------------------ |
| `POSTGRES_USER`     | Postgres user                                    |
| `POSTGRES_PASSWORD` | Postgres password                                |
| `POSTGRES_DB`       | Database name                                    |
| `POSTGRES_PORT`     | Host port mapped to Postgres                     |
| `POSTGRES_URL`      | Full connection URL used by TypeORM              |
| `ENV`               | Environment (`development`, `production`, …)     |

In development, TypeORM `synchronize` is enabled when `ENV` is not `production`.

## Documentation

- [API response conventions](API_RESPONSE_CONVENTIONS.md)
- [Branching policy](BRANCHING_POLICY.md)
- [Contributing](CONTRIBUTING.md)

## Contributing

Contributions are welcome once you are ready to pick the project back up or open a PR. See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow, branching, and review expectations.

## License

This project is licensed under the [MIT License](LICENSE).
