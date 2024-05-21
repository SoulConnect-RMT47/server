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

5. `GET /users/:id`:

- Description: Retrieves a user's details by ID.
- Parameters: `id` - The ID of the user to retrieve.
- Response: JSON object with the user's details.

6. `POST /swipe/:id`:

- Description: Performs a swipe action on a user.
- Parameters: `id` - The ID of the user to swipe on.
- Request Body: JSON object containing swipe information.
- Response: JSON object with the result of the swipe action.

7. `GET /swipe`:
- Description: Retrive swipped user that accepted.
- Response: JSON object with the all swiped user.

8. `GET /connections`:

- Description: Retrieves a connection's details by user.
- Response: JSON object with the connection's details.

## POST /users/register

### Request

- body

```json
{
  "name": "<string>",
  "age": "<number>",
  "gender": "<string>",
  "imgUrl": "<string>",
  "username": "<string>",
  "email": "<string>",
  "password": "<string>",
  "location": "<string>",
  "bio": "<string>",
  "preference": ["<string>"...] //max 5 preference
}

```

### Response

- 201 created

```json
{
  "message": "User created",
  "user": {
    "acknowledged": true,
    "insertedId": <string>
  }
}
```

- 400 bad request

```json
{
  "message": <string>
}
```

## POST users/login

### Request

- body

```json
{
  "email": <string>,
  "password": <string>
}
```

### Response

- 200 OK

```json
{
    "message": "Login successful",
    "token": <string>,
    "user": {
        "_id": <ObjectId>,
        "name": <string>,
        "age": <number>,
        "gender": <string>,
        "imgUrl": <string>,
        "username": <string>,
        "email": <string>,
        "location": <string>,
        "bio": <string>,
        "preference": [
            <string>,
            <string>,
            <string>
        ]
    }
}
```

- 400 bad request

```json
{
  "message": <string>
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
    "_id": "<string>",
    "name": "<string>",
    "age": "<number>",
    "gender": "<string>",
    "imgUrl": "<string>",
    "username": "<string>",
    "email": "<string>",
    "location": "<string>",
    "bio": "<string>",
    "preference": [
        "<string>",
        "<string>",
        "<string>"
    ],
    "sharedPreferences": "<number>"
    }...
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
  "name": <string>, //optional
  "bio": <string>, //optional
  "age": <number>, //optional
  "email": <string> //optional
}
```

### Response

- 200 OK

```json
{
  "message": "User updated",
  "user": {
        "_id": <ObjectId>,
        "name": <string>,
        "age": <number>,
        "gender": <string>,
        "imgUrl": <string>,
        "username": <string>,
        "email": <string>,
        "location": <string>,
        "bio": <string>,
        "preference": [
            <string>,
            <string>,
            <string>
        ]
    }
}
```

- 400 Bad Request

```json
{
  "message": <string>
}
```

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
  "id": "<string>"
}
```

### Response

- 200 OK

```json
{
    "_id": <ObjectId>,
    "name": <string>,
    "age": <number>,
    "gender": <string>,
    "imgUrl": <string>,
    "username": <string>,
    "email": <string>,
    "location": <string>,
    "bio": <string>,
    "preference": [
        <string>,
        <string>,
        <string>
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
  "id": "<string>"
}
```

- Body

```json
{
  "swipeStatus": "accepted" || "rejected"
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
```

- 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```
## GET /swipe
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
        "_id": "664ac7bf45e26f35b404ca28",
        "userId": "6649735baa788e131c8278fb",
        "swipedId": "664ac22c45e26f35b404ca21",
        "swipeStatus": "accepted",
        "swipedUser":{
            "_id": <ObjectId>,
            "name": <string>,
            "age": <number>,
            "gender": <string>,
            "imgUrl": <string>,
            "username": <string>,
            "email": <string>,
            "location": <string>,
            "bio": <string>,
            "preference": [
                <string>,
                <string>,
                <string>
            ]
        }
    }...
]
```
- 401 Unauthorized

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
    "_id": <ObjectId>,
    "name": <string>,
    "age": <number>,
    "gender": <string>,
    "imgUrl": <string>,
    "username": <string>,
    "email": <string>,
    "location": <string>,
    "bio": <string>,
    "preference": [
        <string>,
        <string>,
        <string>
    ],
    "messageID": <string>
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
