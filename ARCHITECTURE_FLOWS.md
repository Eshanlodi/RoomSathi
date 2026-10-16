# RoomSathi Architecture and Data Flows

This document explains how requests move from the browser through the React client and Express API to MongoDB. The diagrams describe the current development architecture and the main implemented workflows.

## System boundaries

```mermaid
flowchart LR
    Browser[Browser]
    Client[React + Vite client\nlocalhost:5173]
    API[Express API\nlocalhost:5000/api]
    Mongo[(MongoDB\nroomsathi database)]
    Files[Local uploads\nserver/uploads]

    Browser --> Client
    Client -->|JSON + Bearer JWT| API
    API --> Mongo
    API --> Files
    Files --> Browser
```

## 1. Application startup and session restoration

The browser loads the Vite client. React mounts the application, creates the authentication context, and checks whether a previous JWT exists in local storage.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Vite as React/Vite client
    participant Auth as AuthContext
    participant API as Express API
    participant DB as MongoDB

    User->>Browser: Open http://localhost:5173
    Browser->>Vite: Request index.html and JS bundle
    Vite->>Auth: Mount AuthProvider
    Auth->>Browser: Read localStorage token
    alt Token exists
        Auth->>API: GET /api/auth/me\nAuthorization: Bearer JWT
        API->>DB: Find user by JWT subject
        DB-->>API: User document
        API-->>Auth: Sanitized user object
        Auth-->>Vite: Restore authenticated state
    else No token or invalid token
        Auth-->>Vite: Set logged-out state
    end
    Vite-->>Browser: Render public or authenticated UI
```

## 2. Student registration and Gmail validation

Gmail validation happens in the browser for fast feedback and again on the server as the authoritative rule.

```mermaid
sequenceDiagram
    actor Student
    participant Browser
    participant Register as Registration page
    participant API as Express API
    participant DB as MongoDB

    Student->>Browser: Enter name, Gmail, password, and profile data
    Browser->>Register: Submit form
    Register->>Register: Validate email ends with @gmail.com
    alt Invalid email domain
        Register-->>Browser: Show Gmail validation error
    else Gmail address
        Register->>API: POST /api/auth/register
        API->>API: Validate required fields, role, and Gmail domain
        API->>DB: Check email uniqueness
        DB-->>API: Email available
        API->>API: Hash password with bcrypt
        API->>DB: Insert User document
        DB-->>API: Created user
        API-->>Register: JWT + sanitized user
        Register->>Browser: Store JWT in localStorage
        Register->>API: POST /api/roommates\nAuthorization: Bearer JWT
        API->>DB: Upsert roommate profile
        API-->>Register: Profile saved
        Register-->>Browser: Redirect to dashboard
    end
```

## 3. Login

The API returns a token and user object. The client stores the token and keeps the user object in AuthContext.

```mermaid
sequenceDiagram
    actor User
    participant Login as Login page
    participant API as Express API
    participant DB as MongoDB
    participant Auth as AuthContext

    User->>Login: Submit Gmail and password
    Login->>API: POST /api/auth/login
    API->>DB: Find user by email with password hash
    DB-->>API: User document
    API->>API: Compare password with bcrypt
    alt Invalid credentials
        API-->>Login: 401 Invalid email or password
        Login-->>User: Show error toast
    else Valid credentials
        API->>API: Sign JWT with user id and role
        API-->>Login: { token, user }
        Login->>Auth: Set authenticated user
        Auth->>Login: Store token in localStorage
        Login-->>User: Navigate to dashboard or requested page
    end
```

## 4. Room discovery and filtering

Room filters are sent to the API. Optional parameters are removed before the query string is created, so the server never receives literal `undefined` filters.

```mermaid
sequenceDiagram
    actor Student
    participant Rooms as Rooms page
    participant API as Express API
    participant DB as MongoDB
    participant Card as RoomCard components

    Student->>Rooms: Open /rooms
    Rooms->>API: GET /api/rooms?budget=16000
    API->>DB: Query Room documents
    DB-->>API: Matching rooms
    API->>DB: Aggregate review rating summaries
    DB-->>API: Ratings and review counts
    API-->>Rooms: Room list with id, rent, facilities, rating, owner
    Rooms->>Card: Render room cards
    Student->>Rooms: Change query, college, city, sharing, or facilities
    Rooms->>API: GET /api/rooms with sanitized filters
    API->>DB: Apply server-side filters
    DB-->>API: Filtered room list
    API-->>Rooms: Updated results
```

Supported room criteria:

- Search text across room name, city, and college
- Maximum rent
- City
- College
- Sharing type
- Verified-only flag
- All selected facilities

## 5. Room details, views, and reviews

```mermaid
sequenceDiagram
    actor Student
    participant Details as RoomDetailsPage
    participant API as Express API
    participant DB as MongoDB

    Student->>Details: Open /rooms/{roomId}
    Details->>API: GET /api/rooms/{roomId}
    Details->>API: GET /api/rooms/{roomId}/reviews
    API->>DB: Load room and owner
    API->>DB: Load room reviews and rating summary
    DB-->>API: Room, owner, reviews
    API-->>Details: Room details and review data
    Details->>Browser: Record recent room id in localStorage
    Student->>Details: Click Book Visit
    Details->>API: POST /api/visit-requests
    API->>DB: Create visit request
    API->>DB: Create owner notification
    DB-->>API: Visit request and notification saved
    API-->>Details: Visit request created
```

## 6. Wishlist persistence

```mermaid
sequenceDiagram
    actor Student
    participant Card as RoomCard
    participant API as Express API
    participant DB as MongoDB

    Student->>Card: Click heart on a room
    Card->>API: POST /api/wishlists\n{ roomId }
    API->>DB: Insert unique userId + roomId entry
    DB-->>API: Wishlist saved
    API-->>Card: success=true
    Card-->>Student: Show Saved to wishlist

    Student->>Card: Click heart again
    Card->>API: DELETE /api/wishlists/{roomId}
    API->>DB: Delete user's wishlist entry
    DB-->>API: Entry deleted
    API-->>Card: success=true
    Card-->>Student: Show Removed from wishlist
```

The profile page loads saved rooms with `GET /api/wishlists`.

## 7. Roommate matching

```mermaid
sequenceDiagram
    actor Student
    participant Match as Roommate page
    participant API as Express API
    participant DB as MongoDB

    Student->>Match: Enter budget and lifestyle preferences
    Student->>Match: Click Find matches
    Match->>API: POST /api/roommates\nAuthorization: Bearer JWT
    API->>DB: Upsert current user's roommate profile
    DB-->>API: Profile saved
    Match->>API: GET /api/roommates
    API->>DB: Load other roommate profiles and users
    DB-->>API: Candidate profiles
    API->>API: Calculate budget and lifestyle compatibility
    API-->>Match: Candidates, matchPercentage, and lifestyle tags
    Match-->>Student: Render best match and recommendations
```

## 8. Notifications and visit-request status

```mermaid
sequenceDiagram
    actor Owner
    actor Student
    participant OwnerUI as Owner dashboard
    participant StudentUI as Student dashboard
    participant API as Express API
    participant DB as MongoDB

    Student->>API: POST /api/visit-requests
    API->>DB: Save pending visit request
    API->>DB: Save booking_request notification for owner
    API-->>StudentUI: Request created

    Owner->>OwnerUI: Open /owner
    OwnerUI->>API: GET /api/visit-requests
    API->>DB: Load requests owned by current owner
    DB-->>API: Pending requests
    API-->>OwnerUI: Request list

    Owner->>OwnerUI: Click Accept or Reject
    OwnerUI->>API: PUT /api/visit-requests/:id/status
    API->>DB: Update request status
    API->>DB: Save booking_status notification for student
    API-->>OwnerUI: Updated request

    Student->>StudentUI: Open /dashboard
    StudentUI->>API: GET /api/notifications
    API->>DB: Load student's notifications
    DB-->>API: Notifications
    API-->>StudentUI: Render unread and read notifications
```

## 9. Owner analytics

```mermaid
sequenceDiagram
    actor Owner
    participant OwnerUI as Owner dashboard
    participant API as Express API
    participant DB as MongoDB

    Owner->>OwnerUI: Open /owner
    OwnerUI->>API: GET /api/rooms/mine
    OwnerUI->>API: GET /api/owner/dashboard-stats
    API->>DB: Load rooms owned by current owner
    API->>DB: Count RoomView, Wishlist, and pending VisitRequest records
    DB-->>API: Rooms and aggregate counts
    API-->>OwnerUI: Rooms, total views, interests, requests
    OwnerUI-->>Owner: Render live owner dashboard
```

The current room-detail flow records recent room ids in browser local storage. The server-side `RoomView` collection is seeded for testing and is ready for a dedicated view-event endpoint.

## 10. Image upload storage

The current development implementation stores images on the API host. Production should replace this with object storage.

```mermaid
sequenceDiagram
    actor User
    participant Profile as Profile page
    participant API as Express API
    participant Disk as server/uploads
    participant DB as MongoDB

    User->>Profile: Select image file
    Profile->>API: POST /api/uploads\nmultipart/form-data file
    API->>API: Validate authenticated user, type, and 5 MB limit
    API->>Disk: Save generated filename
    Disk-->>API: File path
    API-->>Profile: Public upload URL
    Profile->>API: PUT /api/auth/me\n{ avatar: url }
    API->>DB: Update user avatar URL
    DB-->>API: Updated user
    API-->>Profile: Updated profile
```

## 11. Password reset

The reset token is hashed in MongoDB and expires after 15 minutes. The current local-development endpoint returns a token so the flow can be tested without an email provider.

```mermaid
sequenceDiagram
    actor User
    participant Login as Login page
    participant API as Express API
    participant DB as MongoDB

    User->>Login: Click Forgot Password
    Login->>API: POST /api/auth/forgot-password\n{ email }
    API->>DB: Find account by email
    API->>API: Generate random token and SHA-256 hash
    API->>DB: Store token hash and 15-minute expiry
    API-->>Login: Development reset token
    User->>Login: Submit token and new password
    Login->>API: POST /api/auth/reset-password
    API->>DB: Find non-expired matching token hash
    API->>API: Hash new password with bcrypt
    API->>DB: Save password and clear reset fields
    API-->>Login: Password reset successful
```

In production, return a generic response and send the reset link through a transactional email provider instead of displaying the token.

## 12. Authorization boundaries

```mermaid
flowchart TD
    Request[Incoming API request] --> Public{Public endpoint?}
    Public -->|Yes| Handler[Route handler]
    Public -->|No| JWT[Require valid JWT]
    JWT --> Role{Role allowed?}
    Role -->|No| Forbidden[403 Forbidden]
    Role -->|Yes| Handler
    Handler --> Database[(MongoDB)]
```

- Public room browsing and room reviews do not require authentication.
- Student profile, roommate, wishlist, notifications, uploads, and visit creation require a JWT.
- Owners can manage their own rooms and process their own visit requests.
- Admins can view admin statistics and perform administrative room operations.
- Password hashes, reset hashes, Aadhaar, and JWT secrets are never returned to the browser.

## 13. Production notes

- Use MongoDB Atlas or a secured MongoDB deployment.
- Replace `server/uploads/` with S3, Cloudinary, or another object-storage provider.
- Configure an email provider for password reset delivery.
- Add rate limiting and Helmet before public deployment.
- Put the API behind HTTPS and a reverse proxy.
- Never expose MongoDB port `27017` publicly.
- Keep `.env` files and uploaded files out of version control.
