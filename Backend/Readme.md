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
