# Checklist MERN App

Full-stack checklist app with MongoDB, Express, React (Create React App), and Node.js.

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
