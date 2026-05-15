# ShowMe Backend

This backend uses Express and Sequelize with MySQL.

## Setup

1. Make sure MySQL is running.
2. Copy `.env.example` to `.env` and update the connection values if needed.
3. Install dependencies:
   `npm install`
4. Start the server:
   `npm run dev`

The app will create the configured database automatically if it does not exist yet.

## Endpoints

- `GET /health`
- `GET /api`
- `GET /api/entities`
- `GET /api/users`
- `GET /api/users/:id`
- `GET /api/showme-information`
- `GET /api/showme-information/:id`
