# Fault-Tolerant Command Execution System

### Skipr – Backend Engineer Test Task

> **Tech Stack:** TypeScript · NestJS · RabbitMQ · SQLite  
> **Concepts:** Fault Tolerance · Idempotency · Crash Recovery · Distributed Scheduling  
> **Extras:** Docker · Persistence · Failure Simulation

---

## 📌 Overview

This repository implements a **fault-tolerant command execution system** consisting of a **Control Server** and **Agent(s)**.

The system is designed to:

- Accept commands
- Persist their lifecycle
- Assign execution deterministically
- Prevent duplicate execution (idempotency)
- Survive crashes and restarts
- Recover unfinished work safely

---

## Requirements

Before running the project, make sure you have:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (optional if running without Docker)

---

## Running the Project

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Start the project:

- With Docker Compose:

```bash
docker-compose up --build
```
- Without Docker Compose:
```bash
cd command-service
npm install
npm run start:dev
```
```bash
cd scheduler-service
npm install
APP_ROLE=master MASTER_PORT= 3002 npm run start:dev
```
```bash
cd scheduler-service
npm install
WORKER_PORT= 3003 npm run start:dev
```

## 🧠 System Architecture

<!-- <img width="3004" height="1224" alt="Image" src="https://github.com/user-attachments/assets/c826a404-0181-4842-9aec-287115a8b5d5" /> -->

| Component               | Responsibility                                         |
| ----------------------- | ------------------------------------------------------ |
| Control Server (Master) | Register agent, Assign/Unassign agent, Simulate crash  |
| Agent (Worker)          | Fetches due jobs, Publish execcution message with data |
| Queue (RabbitMQ)        | Reliable, crash-safe message delivery                  |
| Persistence (SQLite)    | Durable command state                                  |

## Crash Recovery Explanation

Shard locking is used to ensure that **each scheduled job is handled by only one worker**, without using distributed locks.

- Each job is assigned a **shard ID** at creation time.
- Each scheduler worker is responsible for **exactly one shard**(Idempotency).
- Workers query only jobs that belong to their shard:
  ```sql
  SELECT * FROM commands
  WHERE scheduled_time <= current_time
    AND queued = false
    AND shard = WORKER_SHARD;
  ```
- Because no two workers query the same shard, the shard acts as a logical lock(patition key) that prevents duplicate scheduling.
- Jobs are assigned to shards rather than agents. If an agent crashes, its shard can be reassigned to another agent, allowing all pending commands to be safely recovered and processed.

### Trade-offs & Decisions

- **Shard-based assignment vs. agent-based assignment:**  
  Using shards decouples jobs from specific agents, enabling crash recovery and load balancing. The trade-off is slightly more complexity in tracking shards compared to directly assigning jobs to agents.

- **UNIX timestamp vs. full datetime:**  
  Storing next execution times as UNIX timestamps simplifies querying and improves performance. The trade-off is reduced precision (minute-level) and less human-readable timestamps.

- **Polling every minute vs. event-driven scheduling:**  
  Polling is simple and reliable, but may introduce a small delay in job execution. Event-driven approaches could provide faster execution but add complexity in managing real-time events.
