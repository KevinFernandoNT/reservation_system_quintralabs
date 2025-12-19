# Reservation System API

A production-ready NestJS Backend API for managing resource reservations with a focus on concurrency safety, performance, and clean architecture.

## 🚀 Objective
This system ensures that a single resource cannot be double-booked for overlapping time periods, even under concurrent requests.

For detailed information on the architectural choices and how the system scales, see the **[Design Docs](./Design%20Docs)**:
- [Design Decisions & Rationale](./Design%20Docs/DesignDecisions.md)
- [System Scalability Notes](./Design%20Docs/Scaling.md)

---

## 🛠 Features
- **Concurrency Safety**: Database-level exclusion constraints (PostgreSQL GIST) to prevent double-booking.
- **Modern Stack**: Built with NestJS, TypeScript, and TypeORM.
- **Reservation Lifecycle**: Supports `PENDING`, `COMPLETE`, and `CANCELLED` statuses.
- **Soft Delete**: Cancellations are handled by status updates rather than record deletion.
- **Background Cleanup**: Automatic cancellation of expired/stale reservations using `@nestjs/schedule`.
- **API Documentation**: Fully documented with Swagger/OpenAPI.
- **RESTful Endpoints**: Paginated and filterable list of reservations.

---

## 🏗 Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) with `btree_gist` extension support.

### 1. Clone & Install
```bash
git clone <repository-url>
cd reservation-system-api
npm install
```

### 2. Environment Configuration

The application supports multiple environments via `.env` files.

#### Development
Create a `.env.development` file in the root directory:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=reservation_db
NODE_ENV=development
SWAGGER_ENABLED=true
```

#### Production
Create a `.env.production` file in the root directory:
```env
DATABASE_HOST=your-prod-db-host
DATABASE_PORT=5432
DATABASE_USER=your-prod-user
DATABASE_PASSWORD=your-prod-password
DATABASE_NAME=reservation_db
NODE_ENV=production
SWAGGER_ENABLED=false
CORS_ORIGIN=https://yourdomain.com
```
In production, the application uses **Helmet** for improved security headers and disables Swagger by default.

### 3. Run Migrations
```bash
npm run migrate:up
```

### 4. Start Application

#### Development Mode (with hot-reload)
```bash
npm run start:dev
```

#### Production Mode
First, build the application:
```bash
npm run build
```
Then start the compiled code using the production environment:
```bash
npm run start:prod
```
The `start:prod` script is configured to use `cross-env NODE_ENV=production`, which automatically loads the `.env.production` file via the `ConfigModule`.

---

## 🐳 Docker Setup

The application is fully dockerized for both development and production environments.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 2. Environment Configuration
Ensure you have a `.env.development` file in the root directory (as described in the manual setup). The Docker configuration will use this file.

### 3. Start the Application
To start the application in **development mode** (using `.env.development`):
```bash
docker-compose --file docker/docker-compose.yml up --build
```

To start the application in **production mode** (using `.env.production`):
```bash
docker-compose --file docker/docker-compose.prod.yml up --build
```
> [!NOTE]
> The `docker-compose.prod.yml` uses the `Dockerfile.prod` for a multi-stage, slimmed-down production build.

### 4. Access the Services
- **API**: [http://localhost:3000](http://localhost:3000)
- **Swagger Documentation**: [http://localhost:3000/api](http://localhost:3000/api)
- **pgAdmin**: [http://localhost:5050](http://localhost:5050)
    - **Email**: `admin@reservation.com`
    - **Password**: `admin`

### 5. Stop the Application
To stop and remove the containers:

```bash
docker-compose --file docker/docker-compose.yml down
```

---

## 📚 API Endpoints

### Documentation
Visit `http://localhost:3000/api` for the Swagger UI.

### Key Endpoints
- **POST `/api/v1/reservations`**: Create a new reservation.
- **GET `/api/v1/reservations`**: List reservations (supports `resourceId` filter & pagination).
- **GET `/api/v1/reservations/:id`**: Get reservation details.
- **DELETE `/api/v1/reservations/:id`**: Cancel a reservation (soft-delete).

---

## ⚙️ Key Design Decisions

### 1. Concurrency Control (Exclusion Constraints)
Instead of relying on application-level locks (which can be fragile in distributed environments), I implemented **PostgreSQL Exclusion Constraints** using GIST indices. 
- **Why?**: It guarantees atomicity at the database level. Even if two identical requests hit two different server instances at the exact same microsecond, Postgres will reject one based on the overlapping `tstzrange`.
- **Partial Constraint**: The constraint only applies to `PENDING` reservations (`WHERE status = 'PENDING'`), allowing previously cancelled or completed slots to be reused immediately.

### 2. Timezone Handling
All timestamps are stored as `TIMESTAMP WITH TIME ZONE` (`timestamptz`) in Postgres.
- The API accepts a `timezone` string in the request.
- Times are converted to UTC before storage using `date-fns-tz`.

### 3. Background Cleanup
Expired `PENDING` reservations that were never completed are automatically cancelled by a cron job running every minute. This keeps the system clean and prevents "stale" blocks from cluttering the data.

---

## ⚖️ Trade-offs & Assumptions
- **Postgres Specific**: The solution heavily leverages Postgres-specific features (GIST). Scaling to other databases (like MySQL or MongoDB) would require a different locking strategy (e.g., Redis DLM).
- **Soft Delete**: I chose soft-deletes via status updates to provide better audit trails and data analysis capabilities.

---

## 📈 Future Improvements
- **Redis Caching**: To speed up the "List Reservations" endpoint for high-traffic resources.
- **Distributed Locking**: For cross-resource dependencies or complex business logic that spans multiple transactions.
- **Event-Driven Architecture**: Emit events when reservations are created or cancelled to notify other microservices (e.g., Billing, Notifications).

---

## 🧪 Testing
Run unit tests:
```bash
npm test
```
