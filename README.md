# Soroban-Event-Indexer
A lightweight Node.js service that polls Soroban contract events via the RPC getEvents API, persists them in PostgreSQL, and exposes a REST + WebSocket API for real-time dApp consumption

# soroban-event-indexer

> A production-grade event indexer for Soroban smart contracts — poll, store, and serve
> contract events via REST and WebSocket APIs.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Drips Wave Program](https://img.shields.io/badge/Drips-Wave%20Program-8B5CF6)](https://drips.network)

---

## Overview

Soroban smart contracts emit structured events with every state change.
`soroban-event-indexer` continuously polls the Soroban RPC `getEvents` endpoint, decodes
and stores events in PostgreSQL, and serves them through a typed REST API and real-time
WebSocket subscriptions — giving dApp frontends and analytics dashboards a reliable,
queryable event history without direct RPC dependency.

---

## Technical Architecture

- **Indexer Core:** TypeScript polling loop using `@stellar/stellar-sdk`'s
  `SorobanRpc.Server.getEvents()`, with cursor persistence across restarts and
  configurable polling intervals
- **Database:** PostgreSQL with Prisma ORM — schema includes `events`, `contracts`,
  and `cursors` tables with appropriate indexes on `contract_id`, `ledger_sequence`,
  and `topic_1`
- **REST API:** Express.js with typed route handlers for querying events by contract,
  topic filter, ledger range, and pagination
- **WebSocket:** `ws`-powered subscription server allowing clients to subscribe to
  specific contract addresses and receive new events in real time
- **Deployment:** Docker Compose bundling the Node.js service and PostgreSQL instance
  for one-command local and production setup

---

## 💧 Drips Wave Program

This repository is an active participant in the
**[Drips Wave Program](https://drips.network)** — a funding mechanism that rewards
open-source contributors for resolving scoped GitHub issues with on-chain streaming payments.

### How to Contribute & Earn

**Step 1 — Register on Drips**
Visit [drips.network](https://drips.network) and connect your Ethereum-compatible wallet.
Your wallet address receives streaming reward payments.

**Step 2 — Browse Open Issues**
Check the [Issues tab](../../issues). Issues are labeled by complexity:

 Label           | Complexity | Typical Scope                                                        
`drips:trivial` | Trivial    | Add an API endpoint test, fix a migration, improve error messages    
`drips:medium`  | Medium     | New filter type, WebSocket subscription logic, Prisma model changes  
`drips:high`    | High       | Backfill scripts, multi-contract indexing, Redis caching layer       

**Step 3 — Claim an Issue**
Comment `/claim` on the issue. The maintainer assigns it. One claim per issue at a time.

**Step 4 — Submit Your Work**
Open a PR referencing `Closes #XX`. All tests must pass and new functionality must include
integration test coverage.

**Step 5 — Get Paid**
Merged PRs trigger your Drips stream. Payments flow continuously to your registered wallet.

---

## Project Structure
```
soroban-event-indexer/
├── src/
│   ├── indexer/              # Core polling loop, cursor management, event decoder
│   ├── api/
│   │   ├── routes/           # REST route handlers (events, contracts, health)
│   │   └── middleware/       # Auth, rate limiting, error handling
│   ├── db/
│   │   ├── migrations/       # Prisma migration files
│   │   └── models/           # Prisma schema and typed model helpers
│   └── utils/                # RPC client factory, XDR decoder, logger
├── scripts/                  # Backfill scripts, DB seed scripts
├── tests/
│   ├── unit/                 # Indexer logic, decoder, utils
│   └── integration/          # API endpoint tests against test DB
├── docker/                   # Dockerfile and compose overrides
├── config/                   # Environment config schemas (zod)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start
```bash
cp .env.example .env
# Fill in SOROBAN_RPC_URL, DATABASE_URL, CONTRACT_IDS

docker-compose up -d
npm install && npm run migrate && npm run dev
```

### REST API
```
GET /events?contractId=C...&limit=50&cursor=...
GET /events/:id
GET /contracts
GET /health
```

### WebSocket
```js
const ws = new WebSocket('ws://localhost:3001');
ws.send(JSON.stringify({ type: 'subscribe', contractId: 'C...' }));
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## License

MIT © soroban-event-indexer contributors
