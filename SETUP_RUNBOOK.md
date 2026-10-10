# RoomSathi Setup and Hosting Runbook

This is the single source of truth for installing prerequisites, configuring MongoDB, running the React client and Express API, validating the application, and hosting RoomSathi on Windows.

## Quick start

For an already prepared Windows machine:

```powershell
npm install
Copy-Item .env.example .env
cd server
npm install
Copy-Item .env.example .env
npm run seed
```

Start MongoDB, then use two terminals:

```powershell
# Terminal 1
cd server
npm run dev

# Terminal 2, from the repository root
npm run dev
```

Open `http://localhost:5173`. The API health check is `http://localhost:5000/api/health`.

## 1. Application architecture

RoomSathi has two applications:

```text
RoomSathi/
  src/                 React and Vite client
  public/              Client static assets
  server/              Express and MongoDB API
    src/config/        Database connection
    src/middleware/   Authentication and error handling
    src/models/       Mongoose models
    src/routes/       API routes
    src/utils/        JWT and response helpers
```

The client runs on port `5173` by default. The API runs on port `5000`. MongoDB runs on port `27017` by default.

```text
Browser -> React/Vite client -> Express API -> MongoDB
                         http://localhost:5000/api
```

## 2. Prerequisites

Install these on every Windows development or hosting machine:

- Windows 10 or Windows 11, 64-bit
- Node.js LTS, preferably Node 20 or newer
- npm, included with Node.js
- MongoDB Community Server 8 or newer, or a MongoDB Atlas database
- Git, recommended for source control
- PowerShell 5.1 or PowerShell 7

Verify Node and npm:

```powershell
node --version
npm --version
```

If `node` is not recognized, install Node.js LTS from the official Node.js website and reopen PowerShell.

## 3. Install MongoDB on Windows

### Option A: Install with winget

Open PowerShell as Administrator and run:

```powershell
winget install --id MongoDB.Server --source winget --accept-source-agreements --accept-package-agreements
```

Verify the installation directory. The exact version may differ:

```powershell
Get-ChildItem 'C:\Program Files\MongoDB\Server'
```

MongoDB is normally installed under:

```text
C:\Program Files\MongoDB\Server\<version>\bin
```

### Option B: Install with the MongoDB MSI

1. Download MongoDB Community Server for Windows from the official MongoDB website.
2. Choose the Windows MSI installer.
3. Select the Complete installation.
4. Select the option to install MongoDB as a Windows service.
5. Keep the default service name `MongoDB` unless your organization requires another name.
6. Install MongoDB Compass only if you want a graphical database viewer.

### Add MongoDB to PATH

If `mongod` is not recognized after installation, add the MongoDB `bin` directory to the system PATH. Replace `9.0` with the installed version:

```powershell
$mongoBin = 'C:\Program Files\MongoDB\Server\9.0\bin'
[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'Machine') + ";$mongoBin", 'Machine')
```

Close and reopen PowerShell, then verify:

```powershell
mongod --version
```

For the current machine, MongoDB Server `9.0.2` was installed at:

```text
C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe
```

The installer did not register the executable on PATH or create the service, so use the service setup below if `Get-Service MongoDB` returns nothing.

## 4. Configure MongoDB as a Windows service

Run these commands in PowerShell as Administrator. Replace `9.0` if another version is installed.

Create the database directory:

```powershell
New-Item -ItemType Directory -Force 'C:\data\db'
```

Create a basic MongoDB configuration file:

```powershell
@'
storage:
  dbPath: C:\data\db
systemLog:
  destination: file
  path: C:\data\db\mongod.log
  logAppend: true
net:
  bindIp: 127.0.0.1
  port: 27017
'@ | Set-Content 'C:\Program Files\MongoDB\Server\9.0\bin\mongod.cfg'
```

Install the service:

```powershell
& 'C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe' --config 'C:\Program Files\MongoDB\Server\9.0\bin\mongod.cfg' --install
```

Start and verify the service:

```powershell
Start-Service MongoDB
Get-Service MongoDB
```

The expected status is `Running`.

To stop or remove the service later:

```powershell
Stop-Service MongoDB
& 'C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe' --remove
```

For a developer-only temporary database, MongoDB can also be started directly:

```powershell
& 'C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe' --dbpath 'C:\data\db'
```

Keep that terminal open while the API is running.

## 5. MongoDB Shell and Compass

`mongosh` is a separate package from the MongoDB Server in some Windows installations. It is optional because the RoomSathi API does not require the shell to run.

Install the shell if needed:

```powershell
winget search MongoDB
winget install --id MongoDB.Shell --source winget
```

If that package ID is unavailable, install MongoDB Shell from the official MongoDB download page.

MongoDB Compass is optional. It can connect to:

```text
mongodb://127.0.0.1:27017
```

## 6. Get the RoomSathi source code

Using Git:

```powershell
git clone <repository-url> RoomSathi
cd RoomSathi
```

Or open the existing project directory in VS Code:

```powershell
cd C:\path\to\RoomSathi
code .
```

Do not commit `.env` files. The repository `.gitignore` already ignores them.

## 7. Install client dependencies

From the repository root:

```powershell
npm install
```

Create the client environment file:

```powershell
Copy-Item .env.example .env
```

The root `.env` should contain only client-safe values:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Never put `MONGODB_URI` or `JWT_SECRET` in the root client `.env`. Vite exposes variables beginning with `VITE_` to browser code.

## 8. Install server dependencies

From the repository root:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `server/.env`:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/roomsathi
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Generate a strong JWT secret instead of using the example value:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
```

Paste the generated value after `JWT_SECRET=`.

## 9. Seed sample data

Make sure MongoDB is running, then from `server/` run:

```powershell
npm run seed
```

The seed command creates five users, three roommate profiles, three rooms, and three reviews. It is safe to rerun for the demo owner rooms and profile records.

### Demo credentials

Every seeded account uses this local-only password:

```text
password123
```

| Role    | Email                       | Intended tests                               |
| ------- | --------------------------- | -------------------------------------------- |
| Owner   | `owner.roomsathi@gmail.com` | Create, update, and delete rooms             |
| Admin   | `admin.roomsathi@gmail.com` | Admin-authorized room operations             |
| Student | `aarav.roomsathi@gmail.com` | Student profile, roommate, and review tests  |
| Student | `meera.roomsathi@gmail.com` | Room browsing, reviews, and roommate filters |
| Student | `kabir.roomsathi@gmail.com` | Roommate compatibility and review tests      |

These credentials are for local development only. Change or remove them before exposing the application publicly.

### Seeded records

| Room                         | City   |             College | Rent | Sharing | Verified |
| ---------------------------- | ------ | ------------------: | ---: | ------- | -------- |
| Campus View Private Room     | Indore |         IPS Academy | 8500 | Single  | Yes      |
| Vijay Nagar Student Flat     | Indore |                DAVV | 6000 | Double  | Yes      |
| Medicaps Road Triple Sharing | Indore | Medicaps University | 4500 | Triple  | No       |

The students also have roommate profiles with different budgets, sleep schedules, food preferences, and study habits. Each room has one seeded review.

## 10. Test cases

Run these checks after starting MongoDB and the API. PowerShell examples use the built-in `Invoke-RestMethod` command.

### Health and public room browsing

```powershell
Invoke-RestMethod http://localhost:5000/api/health
Invoke-RestMethod 'http://localhost:5000/api/rooms'
Invoke-RestMethod 'http://localhost:5000/api/rooms?city=Indore&budget=6500'
Invoke-RestMethod 'http://localhost:5000/api/rooms?verified=true'
```

Expected result: the room list returns three seeded rooms, budget filtering returns rooms at or below the requested rent, and verified filtering excludes the Medicaps room.

### Login and protected profile

```powershell
$login = Invoke-RestMethod http://localhost:5000/api/auth/login -Method Post -ContentType 'application/json' -Body (@{
  email = 'aarav.roomsathi@gmail.com'
  password = 'password123'
} | ConvertTo-Json)

$headers = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod http://localhost:5000/api/auth/me -Headers $headers
```

Expected result: login returns a JWT and `/auth/me` returns Aarav's student account. Repeat with the owner or admin credentials to verify role values.

### Roommate matching

```powershell
Invoke-RestMethod http://localhost:5000/api/roommates -Headers $headers
```

Expected result: the response contains seeded roommate profiles and `matchPercentage` values. The endpoint requires a valid student JWT.

### Reviews

First obtain a room ID from `/api/rooms`, then request its reviews:

```powershell
$rooms = Invoke-RestMethod http://localhost:5000/api/rooms
Invoke-RestMethod "http://localhost:5000/api/rooms/$($rooms[0].id)/reviews"
```

Expected result: each seeded room has one review and a rating summary. A logged-in student can submit one review per room; a second review from the same user should return a conflict response.

### Owner permissions

Use the owner token to create a room:

```powershell
$ownerLogin = Invoke-RestMethod http://localhost:5000/api/auth/login -Method Post -ContentType 'application/json' -Body (@{
  email = 'owner.roomsathi@gmail.com'
  password = 'password123'
} | ConvertTo-Json)

$ownerHeaders = @{ Authorization = "Bearer $($ownerLogin.token)" }
$newRoom = Invoke-RestMethod http://localhost:5000/api/rooms -Method Post -Headers $ownerHeaders -ContentType 'application/json' -Body (@{
  name = 'Test Student Room'
  type = 'Flat'
  rent = 7000
  city = 'Indore'
  college = 'IPS Academy'
  sharing = 'Double'
  facilities = @('Wi-Fi')
  description = 'Temporary API test room'
} | ConvertTo-Json)
```

Expected result: the owner can create a room, update or delete rooms they own, and cannot modify another owner's room. Admin credentials are allowed to perform room operations.

### Negative authentication tests

```powershell
Invoke-RestMethod http://localhost:5000/api/auth/login -Method Post -ContentType 'application/json' -Body (@{
  email = 'aarav.roomsathi@gmail.com'
  password = 'wrong-password'
} | ConvertTo-Json)

Invoke-RestMethod http://localhost:5000/api/auth/me
```

Expected result: the invalid login returns HTTP 401, and `/auth/me` without a bearer token also returns HTTP 401.

### Manual UI regression checklist

Use this checklist after starting MongoDB, the API, and the Vite client. Mark each item only after checking the expected result in the browser.

#### Public navigation

- [ ] Open `http://localhost:5173/`. The landing page loads without a blank screen or error overlay.
- [ ] Click `Search Rooms`. The browser opens `/rooms` and room cards are visible.
- [ ] Click `Find Roommates` from the footer or navigation. The browser opens `/roommates`.
- [ ] Open `/about`, `/contact`, and `/expenses`. Each page renders its heading and footer.
- [ ] Open `/register`, `/owner-register`, and `/login`. Each form renders without a console error.
- [ ] Toggle dark mode. Colors change and the page remains readable.
- [ ] Open the mobile menu at a narrow browser width. Navigation links open the correct routes.

#### Room discovery and details

- [ ] Open `/rooms`. Confirm the page requests live data and displays the seeded rooms.
- [ ] Enter `Campus` in the search box. Confirm `Campus View Private Room` remains or appears.
- [ ] Move the maximum budget below `4500`. Confirm no room is displayed.
- [ ] Set the budget to `6500`. Confirm the DAVV and Medicaps rooms are eligible.
- [ ] Select `DAVV` as the college. Confirm only the DAVV room remains.
- [ ] Select `Verified only`. Confirm the unverified Medicaps room is excluded.
- [ ] Select `Wi-Fi` and another facility. Confirm only rooms containing every selected facility remain.
- [ ] Click `Reset filters`. Confirm all seeded rooms return.
- [ ] Click `View Details` on a room. Confirm the details page loads the current room name, rent, owner, facilities, and reviews.
- [ ] Confirm the details page shows a fallback image when a seeded room has no uploaded image.
- [ ] Click `Share`. Confirm the share feedback appears.

#### Student account and wishlist

1. Open `/login`.
2. Log in with `aarav.roomsathi@gmail.com` and `password123`.
3. Confirm the browser redirects to `/dashboard` and the user's first name is shown.
4. Open `/rooms` and click the heart button on a room.
5. Confirm the `Saved to wishlist` message appears.
6. Refresh the page. The saved state should remain available from the API.
7. Open `/profile`. Confirm the room appears under `Saved rooms`.
8. Click the same heart again and confirm it is removed from the wishlist.

#### Student dashboard and notifications

- [ ] Open `/dashboard` as Aarav. Confirm recommendations are visible.
- [ ] Confirm the notification count is based on API data, not a fixed number.
- [ ] Confirm the seeded notification is visible in the Notifications section.
- [ ] Open a room detail page, then return to the dashboard. Confirm the room can appear under Recently viewed.
- [ ] Open `/profile`. Confirm the name, email, phone, and college match the logged-in account.
- [ ] Edit the name or phone, click `Save changes`, refresh, and confirm the updated value remains.
- [ ] Select a profile image. Confirm an upload success message and the image updates after refresh.

#### Roommate matching

- [ ] Open `/roommates` while logged in as Aarav.
- [ ] Confirm the seeded recommendations are displayed after the page loads or after clicking `Find matches`.
- [ ] Change budget, food preference, sleep time, and cleanliness.
- [ ] Click `Find matches`.
- [ ] Confirm the success message appears and match percentages update.
- [ ] Confirm the recommended students are loaded from the API and are not fixed fictional names.

#### Visit requests

1. As Aarav, open a room detail page.
2. Click `Book Visit`.
3. Confirm `Visit request sent` appears.
4. Log out and log in as `owner.roomsathi@gmail.com` with `password123`.
5. Open `/owner` and find the pending request from Aarav.
6. Click `Accept` or `Reject`.
7. Confirm the request status changes and the student receives a notification after logging back in.

#### Owner dashboard

- [ ] Log in as `owner.roomsathi@gmail.com` with `password123`.
- [ ] Open `/owner`. Confirm the dashboard displays the owner's three seeded rooms.
- [ ] Confirm Total rooms, Verified rooms, Interested students, and Total views show live values.
- [ ] Confirm the pending visit request list displays the requesting student and room.
- [ ] Accept or reject a request and confirm the status changes without a page error.
- [ ] Confirm an owner cannot access `/admin` and is redirected to the student dashboard.
- [ ] Confirm the Add room button is currently a known placeholder until the room-creation form is connected.

#### Admin dashboard

- [ ] Log in as `admin.roomsathi@gmail.com` with `password123`.
- [ ] Open `/admin`. Confirm live counts for users, owners, rooms, and reviews.
- [ ] Confirm the Recent users table is populated from the API.
- [ ] Confirm an admin can open `/owner` and `/rooms` when needed for administration.
- [ ] Log out and confirm `/admin` redirects to `/login`.
- [ ] Log in as a student and confirm `/admin` redirects to `/dashboard`.

#### Gmail validation and password reset

- [ ] On `/register`, enter an address such as `tester@example.com`. Confirm the form rejects it and explains that only Gmail is accepted.
- [ ] Repeat with `tester@gmail.com`. Confirm the request is allowed to reach the server.
- [ ] Repeat the same two checks on `/owner-register`.
- [ ] On `/login`, use `Forgot Password?`, enter a seeded Gmail address, and confirm a reset request is created.
- [ ] In local development, copy the displayed development reset token and call the reset endpoint with a new password.
- [ ] Log in with the new password, then reseed the database if you need to restore the standard demo password.

#### Expected failure checks

- [ ] Open `/dashboard` while logged out. Confirm redirect to `/login`.
- [ ] Open `/profile` while logged out. Confirm redirect to `/login`.
- [ ] Submit login with the wrong password. Confirm an error toast appears and no redirect occurs.
- [ ] Stop the API and refresh `/rooms`. Confirm a readable load error appears instead of a blank page.
- [ ] Restart the API and confirm the rooms page recovers after refresh.

## 11. Run locally

Use two PowerShell terminals.

### Terminal 1: API

```powershell
cd C:\path\to\RoomSathi\server
npm run dev
```

Expected API URL:

```text
http://localhost:5000/api
```

Test the health endpoint in a browser or PowerShell:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "ok", "service": "roomsathi-api" }
```

### Terminal 2: client

```powershell
cd C:\path\to\RoomSathi
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

The root package also provides these API shortcuts:

```powershell
npm run api:dev
npm run api:start
npm run api:seed
```

## 12. API reference

The backend base URL is `http://localhost:5000/api` by default.

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/me`

### Rooms and reviews

- `GET /rooms`
- `GET /rooms/:id`
- `POST /rooms` for owners or admins
- `PUT /rooms/:id` for the room owner or an admin
- `DELETE /rooms/:id` for the room owner or an admin
- `GET /rooms/:id/reviews`
- `POST /rooms/:id/reviews`

### Roommates

- `POST /roommates`
- `GET /roommates`
- `GET /roommates/:id`

### User features

- `GET|POST /wishlists`
- `DELETE /wishlists/:roomId`
- `GET /notifications`
- `PUT /notifications/:id/read`
- `DELETE /notifications/:id`
- `GET|POST /visit-requests`
- `PUT /visit-requests/:id/status`
- `POST /uploads` with an authenticated multipart image file
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Owner features

- `GET /owner/dashboard-stats`
- `GET /rooms/mine`

Local image uploads are stored under `server/uploads/` and are intentionally ignored by Git. Use object storage such as S3 or Cloudinary for production deployments.

## 13. Verify the full local setup

Check MongoDB:

```powershell
Get-Service MongoDB
```

Check the API:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Check the client build:

```powershell
npm run build
```

Check backend syntax:

```powershell
Get-ChildItem server/src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

A complete local test requires MongoDB. A frontend build and backend syntax check do not require a running database.

## 14. Host on another Windows machine

### Recommended simple layout

Install the project under a stable directory, for example:

```text
C:\Apps\RoomSathi
```

Keep these directories separate:

```text
C:\Apps\RoomSathi\src
C:\Apps\RoomSathi\public
C:\Apps\RoomSathi\server
```

Install dependencies and configure `.env` files exactly as described above.

### Run the API for a private network

Set the server environment:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/roomsathi
JWT_SECRET=<strong-secret>
CLIENT_URL=http://<client-host>:5173
```

Start the API:

```powershell
cd C:\Apps\RoomSathi\server
npm start
```

For a real production deployment, run the API as a Windows service using a service manager such as NSSM or a managed Windows hosting platform. Do not rely on an open development terminal.

### Build the React client

From the project root:

```powershell
npm run build
```

This creates the production files in `dist/`.

Serve `dist/` with IIS, a static web server, or a managed static hosting provider. Set the client environment variable before building:

```dotenv
VITE_API_URL=http://<api-host>:5000/api
```

Because Vite embeds `VITE_` variables during the build, rebuild the client whenever the API URL changes.

### Windows Firewall

If another device must access the API, open port `5000` in Windows Firewall as Administrator:

```powershell
New-NetFirewallRule -DisplayName 'RoomSathi API 5000' -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
```

Only open this port on a trusted private network unless the API is protected behind HTTPS and a reverse proxy.

### Production recommendation

For public hosting, prefer:

```text
Browser -> HTTPS reverse proxy/IIS -> Node API -> MongoDB Atlas or secured MongoDB server
```

Use HTTPS, a real domain, a managed MongoDB deployment, strong secrets, restricted CORS, backups, rate limiting, and a process manager. Do not expose MongoDB port `27017` to the public internet.

## 15. Atlas instead of local MongoDB

Local MongoDB is not required if using MongoDB Atlas.

1. Create an Atlas cluster.
2. Create a database user.
3. Add the machine IP to the Atlas network access list.
4. Copy the Node.js connection string.
5. Put it in `server/.env`:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

Do not commit the connection string. Use a secret manager for hosted production environments.

## 16. Common Windows problems

### `mongod is not recognized`

MongoDB is installed but its `bin` directory is not on PATH. Run the PATH section above, reopen PowerShell, or use the full executable path.

### `Get-Service MongoDB` returns nothing

The server was installed without the Windows service. Follow the service configuration section, or reinstall MongoDB using the Complete MSI installation and enable the service option.

### `ECONNREFUSED 127.0.0.1:27017`

MongoDB is not running, the port is different, or the API has the wrong `MONGODB_URI`. Start the service and verify the URI.

### `CORS` errors in the browser

Set `CLIENT_URL` in `server/.env` to the exact client origin, for example:

```dotenv
CLIENT_URL=http://localhost:5173
```

Restart the API after changing environment variables.

### `EADDRINUSE: address already in use`

Find the process using a port:

```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

Stop the owning process only after confirming it is safe to do so, or choose another port.

### Environment changes are ignored

Restart both Vite and the API after editing `.env` files. Vite reads client variables at startup/build time.

## 17. Production checklist

- [ ] Node.js LTS installed
- [ ] MongoDB service running or Atlas configured
- [ ] Client `VITE_API_URL` points to the API
- [ ] Server `MONGODB_URI` is valid
- [ ] Strong random `JWT_SECRET` configured
- [ ] `.env` files are not committed
- [ ] Seed credentials changed or removed
- [ ] Client production build passes
- [ ] API health endpoint responds
- [ ] CORS is restricted to the real client domain
- [ ] HTTPS is enabled for public hosting
- [ ] MongoDB is not publicly exposed
- [ ] Firewall rules are limited to required ports
- [ ] Database backups are configured
- [ ] API is running under a process manager or Windows service
