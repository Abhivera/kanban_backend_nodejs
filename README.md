# Project Structure

The project follows a typical Node.js and Express.js structure, ensuring a clear separation of concerns. Below is an overview of the key directories and files:

- **config/**: Contains configuration files, such as database connection settings.
- **controllers/**: Handles the business logic for different routes.
- **middleware/**: Includes middleware functions for tasks like authentication and file handling.
- **models/**: Defines the database schemas using Mongoose.
- **routes/**: Defines the API endpoints.
- **uploads/**: Stores uploaded files.
- **.env**: Stores environment variables.
- **package.json**: Lists project dependencies.
- **server.js**: The entry point of the application.

---

## Key Features

- **Task Management**: Create, read, update, and delete tasks with user assignments, history tracking, and file attachments.
- **Sprint Management**: Plan and track sprints, associate tasks with sprints, and monitor sprint status.
- **Kanban Board**: Visualize tasks using a drag-and-drop Kanban board.
- **User Management**: Handle user registration, authentication, role-based access control, and profile management.
- **Security**: Implement JWT-based authentication and role-based authorization.

---

## Models Explanation

### 1. Task Model (Task.js)

**Fields:**
- `title`: The title of the task.
- `description`: A detailed description of the task.
- `priority`: Priority level (LOW, MEDIUM, HIGH, URGENT).
- `status`: Task status (TO_DO, IN_PROGRESS, REVIEW, DONE).
- `assignee`: User responsible for the task.
- `reporter`: User who created the task.
- `sprint`: Associated sprint.
- `attachments`: Files attached to the task.
- `history`: Log of status changes and comments.
- `createdAt`, `updatedAt`: Timestamps.

**Features:**
- Logs status changes in the history array automatically.
- Supports file attachments with metadata.

### 2. Sprint Model (Sprint.js)

**Fields:**
- `name`: Name of the sprint.
- `description`: Sprint description.
- `startDate`, `endDate`: Sprint timeline.
- `status`: Sprint status (PLANNING, ACTIVE, COMPLETED).
- `createdBy`: User who created the sprint.
- `createdAt`, `updatedAt`: Timestamps.

**Features:**
- Tracks sprint lifecycle.
- Associates multiple tasks within a sprint.

### 3. User Model (User.js)

**Fields:**
- `username`: Unique username.
- `email`: Email address.
- `password`: Hashed password.
- `name`: Full name.
- `role`: User role (ADMIN, MANAGER, DEVELOPER, REPORTER).
- `profilePicture`: Optional profile picture.
- `createdAt`, `updatedAt`: Timestamps.

**Features:**
- Uses bcrypt for password hashing.
- Supports role-based access control.

---

## Steps to Set Up the Backend

### 1. Set Up the Environment
- Install Node.js and npm.
- Clone the project repository.
- Run `npm install` to install dependencies.

### 2. Configure the Database
- Set up a MongoDB database.
- Store the connection URI in the `.env` file as `MONGO_URI`.

### 3. Configure Environment Variables
- Create a `.env` file in the project root.
- Add necessary environment variables like `JWT_SECRET`.

### 4. Run the Server
- Start the server using `node server.js` or `nodemon server.js` for development.

### 5. Test the API
- Start your server and access the Swagger UI at http://localhost:5000/api-docs.
- Verify authentication and authorization functionalities.

---

## Middleware

- **Authentication Middleware**: Verifies JWT tokens and attaches user information to requests.
- **Authorization Middleware**: Checks user permissions for route access.
- **File Upload Middleware**: Handles file uploads using Multer with storage and filtering configurations.

---

## Security

- **JWT Authentication**: Secures API endpoints with tokens.
- **Role-Based Authorization**: Restricts access based on user roles.
- **Password Hashing**: Uses bcrypt for security.

---

## API Testing

### 1. User Authentication

#### Register a New User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "DEVELOPER"
}
```

**Response:** Returns a user object and JWT token.

#### Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Response:** Returns a user object and JWT token.

---

### 2. Task Management

#### Create a Task
**Endpoint:** `POST /api/tasks`

**Headers:**
- `Authorization: Bearer <your_jwt_token>`

**Request Body:**
```json
{
  "title": "Test Task",
  "description": "This is a test task",
  "priority": "HIGH",
  "status": "TO_DO",
  "assignee": "<assignee_user_id>",
  "reporter": "<reporter_user_id>",
  "sprint": "<sprint_id>"
}
```

**Response:** Returns the created task object.

#### Get All Tasks
**Endpoint:** `GET /api/tasks`

**Headers:**
- `Authorization: Bearer <your_jwt_token>`

**Query Parameters (optional):** `status`, `priority`, `assignee`, `reporter`, `sprint`, `search`

**Response:** Returns a list of tasks.

#### Update a Task
**Endpoint:** `PUT /api/tasks/:id`

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "status": "IN_PROGRESS",
  "comment": "Moving task to in progress"
}
```

**Response:** Returns the updated task object.

#### Delete a Task
**Endpoint:** `DELETE /api/tasks/:id`

**Response:** Confirms task deletion.

---

### 3. Sprint Management

#### Create a Sprint
**Endpoint:** `POST /api/sprints`

**Request Body:**
```json
{
  "name": "Test Sprint",
  "description": "This is a test sprint",
  "startDate": "2023-10-01",
  "endDate": "2023-10-14",
  "status": "PLANNING"
}
```

**Response:** Returns the created sprint object.

#### Get All Sprints
**Endpoint:** `GET /api/sprints`

**Response:** Returns a list of sprints.

---

### 4. Kanban Board

#### Get Kanban Tasks
**Endpoint:** `GET /api/tasks/kanban/board`

**Query Parameters (optional):** `sprint`, `assignee`

**Response:** Returns tasks grouped by status.

---

### 5. User Management

#### Get All Users (Admin/Manager only)
**Endpoint:** `GET /api/users`

**Response:** Returns a list of users.

#### Update User
**Endpoint:** `PUT /api/users/:id`

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updatedemail@example.com",
  "role": "MANAGER"
}
```

**Response:** Returns the updated user object.

