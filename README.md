# RoomSathi Backend

Node.js + Express + MongoDB (Mongoose) backend for RoomSathi, with JWT-based authentication. This matches the 3-tier MERN architecture described in the team presentation: React frontend → Express/Node.js application tier → MongoDB data tier.

## Folder structure

```
roomsathi-backend/
├── server.js              # App entry point
├── config/db.js           # MongoDB connection
├── models/                # Mongoose schemas (User, Room, Roommate, Review)
├── controllers/           # Business logic for each resource
├── routes/                # Express route definitions
├── middleware/
│   ├── auth.js            # JWT verification (protect) + role checks (authorize)
│   └── errorHandler.js    # Central error handling
└── utils/
    ├── generateToken.js   # Signs JWTs
    └── asyncHandler.js    # Wraps async routes so errors reach errorHandler
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `MONGO_URI`: get a free cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register), then use the connection string it gives you.
   - `JWT_SECRET`: any long random string (e.g. generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

3. Run in development (auto-restarts on file changes):
   ```bash
   npm run dev
   ```
   Or in production:
   ```bash
   npm start
   ```

4. The API runs at `http://localhost:5000` by default. Visit `http://localhost:5000/` — you should see `{"message":"RoomSathi API is running"}`.

## How JWT authentication works here

1. **Register/Login** (`authController.js`) — on success, `generateToken()` signs a JWT containing `{ id, role }`, valid for `JWT_EXPIRES_IN` (default 7 days). The token is returned to the client, which should store it and send it on future requests.
2. **Protected routes** — the client sends `Authorization: Bearer <token>` on every request that needs login.
3. **`protect` middleware** (`middleware/auth.js`) — verifies the token's signature with `JWT_SECRET`, looks up the user in MongoDB, and attaches it to `req.user`. If the token is missing, invalid, or expired, it returns `401`.
4. **`authorize(...roles)` middleware** — used after `protect` on routes that need a specific role (e.g. only `owner` can create a room listing). Returns `403` if the logged-in user's role isn't allowed.
5. **Passwords** are hashed with bcrypt in a Mongoose `pre("save")` hook on the `User` model — plain-text passwords are never stored or returned in API responses (`select: false` on the field).

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create account. Body: `name, email, password, role?, college?, phone?` |
| POST | `/login` | Public | Body: `email, password`. Returns JWT. |
| GET | `/me` | Private | Get logged-in user's profile |
| PUT | `/me` | Private | Update `name, college, phone, avatar` |

### Rooms — `/api/rooms`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List rooms. Query: `city, type, minPrice, maxPrice, college, sort` |
| GET | `/:id` | Public | Get one room |
| POST | `/` | Private (owner/admin) | Create listing |
| PUT | `/:id` | Private (owner of listing/admin) | Update listing |
| DELETE | `/:id` | Private (owner of listing/admin) | Delete listing |
| GET | `/:roomId/reviews` | Public | List reviews for a room |
| POST | `/:roomId/reviews` | Private | Add a review (one per user per room). Body: `rating, comment` |
| DELETE | `/:roomId/reviews/:reviewId` | Private (author/admin) | Delete a review |

### Roommates — `/api/roommates`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Create/update your own roommate profile + lifestyle quiz answers |
| GET | `/` | Private | List other students' profiles, sorted by compatibility % with you |
| GET | `/:id` | Private | Get one profile with compatibility score |

## Example requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Aditi Joshi","email":"aditi@test.com","password":"password123","role":"student","college":"COEP"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aditi@test.com","password":"password123"}'
```

**Access a protected route (use the token from login/register):**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

## Connecting your React frontend

In your frontend's API calls, store the token (e.g. `localStorage.setItem("token", data.token)` after login) and attach it to every protected request:

```javascript
fetch("http://localhost:5000/api/auth/me", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
```

Set `CLIENT_URL` in `.env` to your deployed frontend URL (e.g. your Vercel URL) so CORS allows it.

## For your viva

- **Password security**: bcrypt hashing, `select: false` so hashes never leak in API responses.
- **Stateless auth**: no server-side session storage — the JWT itself carries identity, verified fresh on each request.
- **Role-based authorization**: `authorize("owner")` middleware stops students from creating room listings, demonstrating authentication (who you are) vs authorization (what you can do).
- **Error handling**: centralized `errorHandler` middleware catches Mongoose validation errors, duplicate-key errors, and bad ObjectIds, returning clean JSON instead of leaking stack traces in production.
- **Compatibility scoring**: `calculateCompatibility()` in `roommateController.js` is a simple, explainable weighted-scoring function over lifestyle quiz answers — good to walk an examiner through line by line.
