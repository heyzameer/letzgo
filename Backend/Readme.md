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

## Endpoint: `/api/rides/create`

### Description
This endpoint is used to create a new ride request by a user.

### Method
`POST`

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Request Body

| Field         | Type   | Required | Description                                 |
|---------------|--------|----------|---------------------------------------------|
| `pickup`      | String | Yes      | The pickup address (min 3 chars)            |
| `destination` | String | Yes      | The destination address (min 3 chars)       |
| `vehicleType` | String | Yes      | The type of vehicle (`auto`, `car`, `moto`) |

### Example Request
```json
{
  "pickup": "123 Main St",
  "destination": "456 Elm St",
  "vehicleType": "car"
}
```

### Responses

#### Success (201 Created)
The ride is successfully created.

```json
{
  "_id": "65f1c2e5e4b0a2d3c4e5f6g7",
  "user": "65f1c2e5e4b0a2d3c4e5f6g1",
  "pickup": "123 Main St",
  "destination": "456 Elm St",
  "fare": 120,
  "status": "pending",
  "otp": "1234"
}
```

#### Validation Error (422 Unprocessable Entity)
The input data is invalid.

```json
{
  "errors": [
    {
      "msg": "Invalid pickup address",
      "param": "pickup",
      "location": "body"
    }
  ]
}
```

#### Server Error (500 Internal Server Error)
An unexpected error occurred on the server.

```json
{
  "message": "Internal server error"
}
```

---

## Endpoint: `/api/maps/get-coordinate`

### Description
Get latitude and longitude coordinates for a given address.

### Method
`GET`

### Query Parameters

| Parameter | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `address` | String | Yes      | The address to geocode       |

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/maps/get-coordinate?address=123+Main+St
Authorization: Bearer <token>
```

### Responses

#### Success (200 OK)
```json
{
  "lat": 12.9716,
  "lng": 77.5946
}
```

#### Validation Error (422 Unprocessable Entity)
```json
{
  "errors": [
    {
      "msg": "Address is required",
      "param": "address",
      "location": "query"
    }
  ]
}
```

#### Not Found (404)
```json
{
  "message": "Coordinates not found"
}
```

---

## Endpoint: `/api/maps/get-distance-time`

### Description
Get distance and estimated travel time between two locations.

### Method
`GET`

### Query Parameters

| Parameter     | Type   | Required | Description                  |
|---------------|--------|----------|------------------------------|
| `origin`      | String | Yes      | The origin address           |
| `destination` | String | Yes      | The destination address      |

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/maps/get-distance-time?origin=123+Main+St&destination=456+Elm+St
Authorization: Bearer <token>
```

### Responses

#### Success (200 OK)
```json
{
  "element": {
    "distance": { "text": "5.2 km", "value": 5200 },
    "duration": { "text": "12 mins", "value": 720 }
  }
}
```

#### Validation Error (422 Unprocessable Entity)
```json
{
  "errors": [
    {
      "msg": "Origin is required",
      "param": "origin",
      "location": "query"
    }
  ]
}
```

#### Not Found (404)
```json
{
  "message": "Distance and time not found"
}
```

---

## Endpoint: `/api/maps/get-suggestions`

### Description
Get address autocomplete suggestions for a given input string.

### Method
`GET`

### Query Parameters

| Parameter | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `input`   | String | Yes      | The partial address input    |

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/maps/get-suggestions?input=Main
Authorization: Bearer <token>
```

### Responses

#### Success (200 OK)
```json
{
  "suggestions": [
    "123 Main St, City, Country",
    "124 Main St, City, Country"
  ]
}
```

#### Validation Error (422 Unprocessable Entity)
```json
{
  "errors": [
    {
      "msg": "Input is required",
      "param": "input",
      "location": "query"
    }
  ]
}
```

#### Not Found (404)
```json
{
  "message": "Suggestions not found"
}
```

---

## Endpoint: `/api/rides/get-fare`

### Description
Get fare estimates for a ride between a pickup and destination location.

### Method
`GET`

### Query Parameters

| Parameter     | Type   | Required | Description                  |
|---------------|--------|----------|------------------------------|
| `pickup`      | String | Yes      | The pickup address           |
| `destination` | String | Yes      | The destination address      |

### Headers
| Header            | Value           | Required | Description                          |
|--------------------|-----------------|----------|--------------------------------------|
| `Authorization`   | Bearer `<token>`| Yes      | The token obtained during login      |

### Example Request
```
GET /api/rides/get-fare?pickup=123+Main+St&destination=456+Elm+St
Authorization: Bearer <token>
```

### Responses

#### Success (200 OK)
Returns fare estimates for each vehicle type.

```json
{
  "auto": 50,
  "car": 80,
  "moto": 35
}
```

#### Validation Error (400 Bad Request)
```json
{
  "errors": [
    {
      "msg": "Pickup and destination are required",
      "param": "pickup",
      "location": "query"
    }
  ]
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "message": "Error message"
}
```
