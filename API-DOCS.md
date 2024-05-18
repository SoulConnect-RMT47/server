# SoulConnect API Documentation

This file contains the documentation for the server's API endpoints.

1. `POST /users/register`:

- Description: Registers a new user.
- Request Body: JSON object containing user information.
- Response: JSON object with the registered user's details.

2. `POST /users/login`:

- Description: Logs in a user.
- Request Body: JSON object containing user credentials.
- Response: JSON object with the logged-in user's details and a token.

3. `GET /users`:

- Description: Retrieves a list of all users.
- Response: JSON array containing user objects.

4. `PUT /users`:

- Description: Updates a user's information.
- Request Body: JSON object containing the updated user information.
- Response: JSON object with the updated user's details.

5. `POST /users/swipe/:id`:

- Description: Performs a swipe action on a user.
- Parameters: `id` - The ID of the user to swipe on.
- Request Body: JSON object containing swipe information.
- Response: JSON object with the result of the swipe action.

6. `GET /users/:id`:

- Description: Retrieves a user's details by ID.
- Parameters: `id` - The ID of the user to retrieve.
- Response: JSON object with the user's details.

7. `GET /connections`:

- Description: Retrieves a connection's details by user.
- Response: JSON object with the connection's details.

## POST /users/register

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ4OTU2Y2E5YzUwY2IxYjhjYzRlNzgiLCJnZW5kZXIiOiJNYWxlIiwiaWF0IjoxNzE2MDQ1Mzc0fQ.kLCwapM4mwEFf6CBJxxZ1_QUqjWzUgltYaiMkb0N9ec",
    "user": {
        "_id": "6648956ca9c50cb1b8cc4e78",
        "name": "John Doe",
        "age": 25,
        "gender": "Male",
        "imgUrl": "https://example.com/images/john.jpg",
        "username": "john_doe256",
        "email": "john.doe@mail.com",
        "location": "New York, USA",
        "bio": "Software developer with a passion for coding and technology.",
        "preference": [
            "Hiking",
            "Reading",
            "Gaming"
        ]
    }
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

## GET /users

### Request

- Headers

```json
{
  "Authorization": "bearer <token>"
}
```

### Response

- 200 OK

```json
[
    {
        "_id": "6647156bd5c41787de68a349",
        "name": "Isabella Martinez",
        "age": 23,
        "gender": "Female",
        "imgUrl": "https://example.com/images/isabella.jpg",
        "username": "isabella_martinez23",
        "email": "isabella.martinez@example.com",
        "location": "Madrid, Spain",
        "bio": "Fashion designer and trendsetter.",
        "preference": [
            "Pecinta mode",
            "Penggemar buku",
            "Seniman"
        ],
        "sharedPreferences": 1
    },...
]
```

- 401 Unatuhorized

```json
{
  "message": "Unauthorized"
}
```

## PUT /users

### Request

- Headers

```json
{
  "Authorization": "bearer <token>"
}
```

- Body

```json
{
  "name": "jhon ganteng", //optional
  "bio": "Suka janda muda", //optional
  "age": 18, //optional
  "email": "jhonganteng@example.com" //optional
}
```

### Response

- 200 OK

```json
{
  "message": "User updated",
  "user": {
    "_id": "6647156bd5c41787de68a340",
    "name": "jhon ganteng",
    "age": 18,
    "gender": "Male",
    "imgUrl": "https://example.com/images/john.jpg",
    "username": "john_doe25",
    "email": "jhonganteng1@example.com",
    "location": "New York, USA",
    "bio": "Suka janda muda",
    "preference": ["Petualang", "Penggemar buku", "Penggemar teknologi", "Intelektual"]
  }
}
```

- 400 Bad Request

```json
{
  "message": "You must be at least 18 years old"
}
```

- 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

## POST /swipe/:id

### Request

- Headers

```json
{
  "Authorization": "bearer <token>"
}
```

- Params

```json
{
  "id" : "<string>"
}
```
- Body
```json
{
    "swipeStatus": "accepted"
}
```

### Response

- 200 OK

```json
{
  "message": "Congratulations!! You're matched"
}
```

OR

```json
{
  "message": "Add to swipe has been success" 
}
```

- 400 Bad Request
```json
{
    "message": "Invalid swipe status"
}
````

- 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```
## GET /users/:id
### Request
- Headers

```json
{
  "Authorization": "bearer <token>"
}
```
- Params
```json
{
  "id" : "<string>"
}
```
### Response
- 200 OK
```json
{
    "_id": "6647156bd5c41787de68a344",
    "name": "Emily Davis",
    "age": 22,
    "gender": "Female",
    "username": "emily_davis22",
    "email": "emily.davis@example.com",
    "location": "Toronto, Canada",
    "bio": "College student majoring in computer science.",
    "preference": [
        "Penggemar teknologi",
        "Penggemar musik",
        "Penggemar film",
        "Pemimpi"
    ]
}
```
- 404 Not Found
```json
{
    "message": "User not found"
}
```
- 401
```json
{
    "message": "Unauthorized"
}
```

## GET /connections
### Request
- Headers

```json
{
  "Authorization": "bearer <token>"
}
```
### Response
- 200 OK
```json
[
    {
        "_id": "664758307129b8b8798ad2fd",
        "name": "Padila",
        "age": 25,
        "gender": "Female",
        "imgUrl": "https://example.com/images/john.jpg",
        "username": "Padila",
        "email": "padila@example.com",
        "location": "New York, USA",
        "bio": "Software developer with a passion for coding and technology.",
        "preference": [
            "Petualang",
            "Penggemar buku",
            "Penggemar teknologi",
            "Intelektual"
        ]
    }...
]
```
- 401
```json
{
    "message": "Unauthorized"
}
```

## Universal Error

- 500 internal server error

```json
{
  "message": "Internal server error"
}
```
