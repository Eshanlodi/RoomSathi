# RoomSathi

RoomSathi is a MERN-style student housing platform for finding rooms near colleges, discovering compatible roommates, and managing shared living expenses.

## Applications

- **Client:** React 19, Vite, React Router, Tailwind CSS, Radix UI, and Recharts
- **API:** Node.js, Express, Mongoose, MongoDB, JWT, and bcrypt

## Repository structure

```text
src/                 React client source
public/              Client static assets
server/src/          Express API source
server/src/models/   MongoDB models
server/src/routes/   API endpoints
server/src/middleware Authentication and errors
SETUP_RUNBOOK.md     Complete Windows setup and hosting guide
```

## Quick start

Use [`SETUP_RUNBOOK.md`](SETUP_RUNBOOK.md) as the single source of truth for prerequisites, MongoDB installation, environment variables, local development, testing, hosting, and troubleshooting.

See [`ARCHITECTURE_FLOWS.md`](ARCHITECTURE_FLOWS.md) for Mermaid sequence diagrams showing browser, React client, Express API, MongoDB, and file-storage flows.

For a prepared development machine:

```powershell
npm install
Copy-Item .env.example .env

cd server
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

In a second terminal, from the repository root:

```powershell
npm run dev
```

The client normally runs at `http://localhost:5173` and the API at `http://localhost:5000/api`.

## Environment files

The client uses the root `.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

The API uses `server/.env`:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/roomsathi
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Never commit `.env` files or expose `MONGODB_URI` and `JWT_SECRET` to the browser.

## Validation

```powershell
npm run build
npm --prefix server install
Get-ChildItem server/src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```
