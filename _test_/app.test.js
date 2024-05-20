const request = require("supertest");
const { app, port } = require("../app");
const { UserCollection, SwipeCollection, ConnectionCollection } = require("../connections/collections");
const { client } = require("../connections/mongodb");

describe("App", () => {
  let server;
  let token;
  let token2;
  let user;
  let user2;

  const seedData = async () => {
    await UserCollection.insertMany(require("../data/testing/test.users.json"));
    await SwipeCollection.insertMany(require("../data/testing/test.swipes.json"));
    await ConnectionCollection.insertMany(require("../data/testing/test.connections.json"));
  };

  const clearData = async () => {
    await UserCollection.deleteMany({});
    await SwipeCollection.deleteMany({});
    await ConnectionCollection.deleteMany({});
  };

  beforeAll(() => {
    seedData();
    server = app.listen(port);
  });

  afterAll((done) => {
    server.close(done);
    clearData().then(() => {
      client.close();
    });
  });

  describe("GET / to make sure that the api is connected", () => {
    it("should respond with 200 status code for GET /", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
    });

    it("should respond with 404 status code for GET /nonexistent", async () => {
      const response = await request(app).get("/nonexistent");
      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /users/register", () => {
    it("should respond with 201 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "Budi Santoso",
          age: 30,
          gender: "Male",
          imgUrl: "https://example.com/images/budi.jpg",
          username: "budi_santoso",
          email: "budi.santoso@mail.com",
          password: "password456",
          location: "Jakarta, Indonesia",
          bio: "Web developer with a passion for creating amazing websites.",
          preference: ["Traveling", "Photography", "Cooking"],
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "User created");
      expect(response.body).toHaveProperty("user");
    });

    it("username already exists should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: 25,
          gender: "Male",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe25",
          email: "john.doe@example.com",
          password: "password123",
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Username already exists");
    });

    it("email already exists should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: 25,
          gender: "Male",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe256",
          email: "john.doe@example.com",
          password: "password123",
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Email already exists");
    });
    it("age is required should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: null,
          gender: "Male",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe256",
          email: "john.doe@example.com",
          password: "password123",
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Age is required");
    });

    it("minimum age is 18 should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: 16,
          gender: "Male",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe256",
          email: "john.doe@example.com",
          password: "password123",
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "You must be at least 18 years old");
    });
    it("user not select the gender should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: 18,
          gender: "",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe256",
          email: "john.doe1@example.com",
          password: "password123",
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Please select the gender");
    });
    it("password length too short should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: 18,
          gender: "Male",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe25",
          email: "john.doe1@example.com",
          password: "pass",
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Password must be at least 5 characters long");
    });
    it("password is null should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: 18,
          gender: "Male",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe25",
          email: "john.doe1@example.com",
          password: null,
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Password is required");
    });
    it("preference is not selected should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app).post("/users/register").send({
        name: "John Doe",
        age: 18,
        gender: "Male",
        imgUrl: "https://example.com/images/john.jpg",
        username: "john_doe25",
        email: "john.doe1@example.com",
        password: "password123",
        location: "New York, USA",
        bio: "Software developer with a passion for coding and technology.",
        preference: [],
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Please select at least one preference");
    });
    it("selected preference is greater than 5 selected should respond with 400 status code for POST /users/register", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          name: "John Doe",
          age: 18,
          gender: "Male",
          imgUrl: "https://example.com/images/john.jpg",
          username: "john_doe25",
          email: "john.doe1@example.com",
          password: "password123",
          location: "New York, USA",
          bio: "Software developer with a passion for coding and technology.",
          preference: ["Hiking", "Reading", "Gaming", "Traveling", "Photography", "Cooking", "Swimming"],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "You can select up to 5 preferences");
    });
  });

  describe("POST /users/login", () => {
    it("should respond with 200 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "jane.smith@example.com",
        password: "password123",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      token = response.body.token;
    });
    it("should respond with 200 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      token2 = response.body.token;
    });
    it("email is empty should respond with 400 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "",
        password: "password123",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Please enter a valid email");
    });
    it("email is null should respond with 400 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: null,
        password: "password123",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Email is required");
    });
    it("invalid email should respond with 200 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "john.doe100@example.com",
        password: "password123",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid email or password");
    });
    it("password is null should respond with 200 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "john.doe100@example.com",
        password: null,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Password is required");
    });
    it("password is too short should respond with 200 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "john.doe100@example.com",
        password: "pass",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Password must be at least 5 characters long");
    });
    it("password is invalid should respond with 200 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "john.doe@example.com",
        password: "password1234",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid email or password");
    });
  });

  describe("GET /users", () => {
    it("should respond with 200 status code for GET /users", async () => {
      const response = await request(app)
        .get("/users")
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      user = response.body[1];
    });
    it("should respond with 200 status code for GET /users", async () => {
      const response = await request(app)
        .get("/users")
        .set({
          authorization: `Bearer ${token2}`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      user2 = response.body[1];
    });
    it("should respond with 401 status code for GET /users", async () => {
      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("GET /users/:id", () => {
    it("should respond with 200 status code for GET /users/:id", async () => {
      const response = await request(app)
        .get(`/users/${user._id}`)
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("name", "John Doe");
    });
    it("should respond with 200 status code for GET /users/:id", async () => {
      const response = await request(app)
        .get(`/users/${user2._id}`)
        .set({
          authorization: `Bearer ${token2}`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("name", "Alice Johnson");
    });
    it("should respond with 404 status code for GET /users/:id", async () => {
      const response = await request(app)
        .get(`/users/664758307129b8b8798ad2fd`)
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });
    it("should respond with 404 status code for GET /users/:id", async () => {
      const response = await request(app)
        .get(`/users/664758307129b8b8798ad2f`)
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });
    it("should respond with 401 status code for GET /users/:id", async () => {
      const response = await request(app).get(`/users/${user._id}`);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("PUT /users", () => {
    it("should respond with 200 status code for PUT /users", async () => {
      const response = await request(app)
        .put("/users")
        .send({
          name: "jhon die",
          bio: "namaku jhon die",
          age: 18,
          email: "jhon_die@example.com",
        })
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "User updated");
      expect(response.body).toHaveProperty("user");
    });
    it("should respond with 401 status code for PUT /users", async () => {
      const response = await request(app)
        .put("/users")
        .send({
          name: "jhon die",
          bio: "namaku jhon die",
          age: 17,
          email: "padila1@example.com",
        })
        .set({
          authorization: `Bearer ${token}1`,
        });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });
    it("should respond with 400 status code for PUT /users", async () => {
      const response = await request(app)
        .put("/users")
        .send({
          name: "jhon die",
          bio: "namaku jhon die",
          age: 18,
          email: "padila1@example.com",
        })
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Email already exists");
    });
    it("should respond with 400 status code for PUT /users", async () => {
      const response = await request(app)
        .put("/users")
        .send({
          name: "jhon die",
          bio: "namaku jhon die",
          age: 17,
          email: "padila1@example.com",
        })
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "You must be at least 18 years old");
    });
  });

  describe("GET /swipe", () => {
    it("should respond with 200 status code for GET /swipe", async () => {
      const response = await request(app)
        .get("/swipe")
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
    it("should respond with 401 status code for GET /swipe", async () => {
      const response = await request(app).get("/swipe");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("POST /swipe/:id", () => {
    it("should respond with 200 status code for POST /swipe/:id", async () => {
      const response = await request(app)
        .post(`/swipe/${user2._id}`)
        .send({
          swipeStatus: "accepted",
        })
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(200);
    });
    it("should respond with 200 status code for POST /swipe/:id", async () => {
      const response = await request(app)
        .post(`/swipe/${user._id}`)
        .send({
          swipeStatus: "accepted",
        })
        .set({
          authorization: `Bearer ${token2}`,
        });
      expect(response.statusCode).toBe(200);
    });
    it("should respond with 200 status code for POST /swipe/:id", async () => {
      const response = await request(app)
        .post(`/swipe/${user._id}`)
        .send({
          swipeStatus: "rejected",
        })
        .set({
          authorization: `Bearer ${token2}`,
        });
      expect(response.statusCode).toBe(200);
    });
    it("should respond with 400 status code for POST /swipe/:id", async () => {
      const response = await request(app)
        .post(`/swipe/${user._id}`)
        .send({
          swipeStatus: "",
        })
        .set({
          authorization: `Bearer ${token2}`,
        });
      expect(response.statusCode).toBe(400);
    });
    it("should respond with 401 status code for POST /swipe/:id", async () => {
      const response = await request(app).post(`/swipe/${user2._id}`).send({
        swipeStatus: "accepted",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });
    it("should respond with 404 status code for POST /swipe/:id", async () => {
      const response = await request(app)
        .post(`/swipe/664758307129b8b8798ad2f`)
        .send({
          swipeStatus: "accepted",
        })
        .set({authorization: `Bearer ${token}`});
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });
  });
  
  describe("GET /connections", () => {
    it("should respond with 200 status code for GET /connections", async () => {
      const response = await request(app)
        .get("/connections")
        .set({
          authorization: `Bearer ${token}`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
    it("should respond with 401 status code for GET /connections", async () => {
      const response = await request(app)
        .get("/connections")
        .set({
          authorization: `Bearer${token}`,
        });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });
  });
});
