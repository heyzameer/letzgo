# API Documentation

## Endpoint: `/api/users/register`

### Description
This endpoint is used to register a new user in the system. It validates the input data, hashes the password, and creates a new user in the database.

### Method
`POST`

### Request Body
The request body must be in JSON format and include the following fields:

| Field                  | Type   | Required | Description                              |
|------------------------|--------|----------|------------------------------------------|
| `fullName.firstName`   | String | Yes      | The first name of the user (min 3 chars)|
| `fullName.lastName`    | String | Yes      | The last name of the user (min 3 chars) |
| `email`                | String | Yes      | The email address of the user           |
| `password`             | String | Yes      | The password for the user (min 6 chars) |

### Example Request
```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success (201 Created)
The user is successfully registered.

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "64f1c2e5e4b0a2d3c4e5f6g7",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Validation Error (422 Unprocessable Entity)
The input data is invalid.

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullName.firstName",
      "location": "body"
    },
    {
      "msg": "Invalid email format",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

### Notes
- Ensure that the `Content-Type` header is set to `application/json` in the request.
- The `Authorization` token is returned in the response and can be used for authenticated requests.

## Endpoint: `/api/users/login`

### Description
This endpoint is used to authenticate a user. It validates the input data, checks the credentials, and returns a token if the login is successful.

### Method
`POST`

### Request Body
The request body must be in JSON format and include the following fields:

| Field      | Type   | Required | Description                              |
|------------|--------|----------|------------------------------------------|
| `email`    | String | Yes      | The email address of the user           |
| `password` | String | Yes      | The password for the user (min 6 chars) |

### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success (200 OK)
The user is successfully authenticated.

```json
{
  "message": "Login successful",
  "user": {
    "_id": "64f1c2e5e4b0a2d3c4e5f6g7",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Validation Error (400 Bad Request)
The input data is invalid.

```json
{
  "errors": [
    {
      "msg": "Invalid email format",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### Authentication Error (401 Unauthorized)
The email or password is incorrect.

```json
{
  "message": "Invalid email or password"
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

### Notes
- Ensure that the `Content-Type` header is set to `application/json` in the request.
- The `Authorization` token is returned in the response and can be used for authenticated requests.

## Endpoint: `/api/users/profile`

### Description
This endpoint is used to retrieve the profile of the authenticated user.

### Method
`GET`

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/users/profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Responses

#### Success (200 OK)
The user's profile is successfully retrieved.

```json
{
  "user": {
    "_id": "64f1c2e5e4b0a2d3c4e5f6g7",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Authentication Error (401 Unauthorized)
The token is missing or invalid.

```json
{
  "message": "Authentication failed"
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

---

## Endpoint: `/api/users/logout`

### Description
This endpoint is used to log out the authenticated user by blacklisting their token.

### Method
`GET`

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/users/logout HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Responses

#### Success (200 OK)
The user is successfully logged out.

```json
{
  "message": "Logout successful"
}
```

#### Authentication Error (401 Unauthorized)
The token is missing or invalid.

```json
{
  "message": "Authentication failed"
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

### Notes
- Ensure that the `Authorization` header is set with a valid token.
- The token will be blacklisted and cannot be used again after logout.

## Endpoint: `/api/captains/register`

### Description
This endpoint is used to register a new captain in the system. It validates the input data, hashes the password, and creates a new captain in the database.

### Method
`POST`

### Request Body
The request body must be in JSON format and include the following fields:

| Field                  | Type   | Required | Description                              |
|------------------------|--------|----------|------------------------------------------|
| `fullname.firstname`   | String | Yes      | The first name of the captain (min 3 chars) |
| `fullname.lastname`    | String | No       | The last name of the captain (min 3 chars) |
| `email`                | String | Yes      | The email address of the captain           |
| `password`             | String | Yes      | The password for the captain (min 6 chars) |
| `vehicle.color`        | String | Yes      | The color of the captain's vehicle (min 3 chars) |
| `vehicle.plate`        | String | Yes      | The plate number of the captain's vehicle (min 3 chars) |
| `vehicle.capacity`     | Number | Yes      | The capacity of the captain's vehicle (min 1) |
| `vehicle.vehicleType`  | String | Yes      | The type of the captain's vehicle (`car`, `motorcycle`, or `auto`) |

### Example Request
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "securepassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

#### Success (201 Created)
The captain is successfully registered.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "64f1c2e5e4b0a2d3c4e5f6g7",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  }
}
```

#### Validation Error (400 Bad Request)
The input data is invalid or the captain already exists.

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Conflict (400 Bad Request)
The captain already exists.

```json
{
  "message": "Captain already exist"
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

### Notes
- Ensure that the `Content-Type` header is set to `application/json` in the request.
- The `Authorization` token is returned in the response and can be used for authenticated requests.

## Endpoint: `/api/captains/login`

### Description
This endpoint is used to authenticate a captain. It validates the input data, checks the credentials, and returns a token if the login is successful.

### Method
`POST`

### Request Body
The request body must be in JSON format and include the following fields:

| Field      | Type   | Required | Description                              |
|------------|--------|----------|------------------------------------------|
| `email`    | String | Yes      | The email address of the captain         |
| `password` | String | Yes      | The password for the captain (min 6 chars) |

### Example Request
```json
{
  "email": "jane.doe@example.com",
  "password": "securepassword"
}
```

### Responses

#### Success (200 OK)
The captain is successfully authenticated.

```json
{
  "message": "Login successful",
  "captain": {
    "_id": "64f1c2e5e4b0a2d3c4e5f6g7",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Validation Error (400 Bad Request)
The input data is invalid.

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### Authentication Error (401 Unauthorized)
The email or password is incorrect.

```json
{
  "message": "Invalid email or password"
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

---

## Endpoint: `/api/captains/profile`

### Description
This endpoint is used to retrieve the profile of the authenticated captain.

### Method
`GET`

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/captains/profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Responses

#### Success (200 OK)
The captain's profile is successfully retrieved.

```json
{
  "captain": {
    "_id": "64f1c2e5e4b0a2d3c4e5f6g7",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  }
}
```

#### Authentication Error (401 Unauthorized)
The token is missing or invalid.

```json
{
  "message": "Authentication failed"
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

---

## Endpoint: `/api/captains/logout`

### Description
This endpoint is used to log out the authenticated captain by blacklisting their token.

### Method
`GET`

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/captains/logout HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Responses

#### Success (200 OK)
The captain is successfully logged out, and the token is blacklisted.

```json
{
  "message": "Logout successful"
}
```

#### Authentication Error (401 Unauthorized)
The token is missing or invalid.

```json
{
  "message": "Authentication failed"
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "An error occurred while processing your request."
}
```

### Notes
- Ensure that the `Authorization` header is set with a valid token.
- The token will be blacklisted and cannot be used again after logout.
