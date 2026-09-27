# TaskCanvas

TaskCanvas is a full-stack task planning app built with MongoDB, Express, React (Create React App), and Node.js.

Tasks can have optional start and end dates. The Monthly calendar page shows each task on every day in its planned date range.

## Setup

1. Start MongoDB locally (or obtain a MongoDB URI).
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`.
3. Optionally copy `client/.env.example` to `client/.env`; it is only needed when the API is not local.
4. In separate terminals run `cd server && npm run dev` and `cd client && npm start`.

The UI uses `http://localhost:3000`; its development proxy sends API calls to `http://localhost:5000`.

## API

- `GET, POST /api/checklists`
- `GET, PUT, DELETE /api/checklists/:checklistId`
- `POST /api/checklists/:checklistId/items`
- `PUT, DELETE /api/checklists/:checklistId/items/:itemId`

The API validates request bodies with Joi and responds with JSON error messages.

When creating or updating an item, send optional ISO `startDate` and `endDate` values, for example `{ "title": "Send report", "startDate": "2026-09-28", "endDate": "2026-09-30" }`.
