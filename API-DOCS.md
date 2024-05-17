# Api Docs SoulConnect

## Endpoints

1. /users/register
1. /users/login

## POST /users/login

### Request

- body

```json
{
  "name": "John Doe",
  "age": 25,
  "gender": "Male",
  "imgUrl": "https://example.com/images/john.jpg",
  "username": "john_doe25",
  "email": "john.doe@example.com",
  "password": "password123",
  "location": "New York, USA",
  "bio": "Software developer with a passion for coding and technology.",
  "preference": ["Hiking", "Reading", "Gaming"]
}
```

### Response

- 201 created

```json
{
  "message": "User created",
  "user": {
    "acknowledged": true,
    "insertedId": "664705d39136c20de415396d"
  }
}
```

- 400 bad request

```json
{
  "message": "Age is required"
}
```

## POST users/login

### Request

- body

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response

- 200 OK

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ3MDkzNTNlMTY2NjBjYThiMjZhMmQiLCJnZW5kZXIiOiJNYWxlIiwiaWF0IjoxNzE1OTMxNzA4fQ.gw2EQNyMSnIUr0Vcu3Fo0wW-lZlJN6NGhbnFcDiqVqo"
}
```

- 400 bad request

```json
{
  "message": "Password must be at least 5 characters long"
}
```

- 401 unauthorized

```json
{
  "message": "Invalid email or password"
}
```

## Universal Error

- 500 internal server error

```json
{
  "message": "Internal server error"
}
```
