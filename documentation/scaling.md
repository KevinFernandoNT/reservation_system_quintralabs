# System Scalability Notes

This document outlines how the Reservation System API can be scaled to handle high-traffic and large-scale deployments.

## 1. API Tier (Horizontal Scaling)
As the number of requests increases, the API tier can be scaled horizontally by adding more instances of the NestJS application.

- **Load Balancing**: Use a load balancer (e.g., Nginx, AWS ELB, or Cloudflare) to distribute traffic across multiple API instances.
- **Stateless Design**: The application is already designed to be stateless (no in-memory sessions), making horizontal scaling straightforward.
- **Containerization**: Deploying with Docker/Kubernetes allows for automatic scaling (Auto-scaling Groups) based on CPU or memory usage.

## 2. Database Tier (PostgreSQL)
The database is often the bottleneck in reservation systems due to the high volume of writes and complex overlap queries.

- **Read Replicas**: Distribute `GET` requests (Listing Reservations) to read-only replicas to reduce the load on the primary writer.
- **Connection Pooling**: Use a tool like **PgBouncer** to manage a large number of database connections efficiently, preventing the database from exhausting its connection limit.
- **Partitioning**: As the `reservations` table grows into millions of rows, use **Table Partitioning** (e.g., by `createdAt` or `startTime` months) to keep indices small and queries fast.
- **Vertical Scaling**: Increasing CPU and RAM for the database instance provides a significant performance boost for complex GIST index calculations.

## 3. Caching Layer (Redis)
To reduce the frequency of expensive database queries:

- **Resource Metadata**: Cache frequently accessed resource details in Redis.
- **Availability Queries**: Before performing a full database transaction, check a Redis-based availability map (e.g., using Bitmaps or Sets) to quickly reject obviously unavailable slots.
- **Distributed Locking**: If moving beyond a single PostgreSQL instance's scope, migrate from database exclusion constraints to a distributed locking mechanism like **Redlock** (Redis Distributed Lock) to manage concurrency across a global cluster.

## 5. Global Distribution
For a global user base:
- **Database Sharding**: In extreme cases, shard the database by `resourceId` or geographic region to distribute the data load across multiple independent Postgres clusters.
