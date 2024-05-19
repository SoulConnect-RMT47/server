const request = require("supertest");
const { app, port } = require("../app");
const { UserCollection, SwipeCollection, ConnectionCollection } = require("../connections/collections");
const { client, database } = require("../connections/mongodb");

describe("App", () => {
  let server;
  let tokenJohnDoe = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ5YjJmNWI0ZTY4ZGE4ZTJhYTFkMmUiLCJnZW5kZXIiOiJNYWxlIiwiaWF0IjoxNzE2MTA1OTczfQ.Ie-_q5G9YcM06lv4ia2JXJuh0WxoZT84TGIjUAjbdsE";
  let tokenJaneSmith ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ5YjJmNWI0ZTY4ZGE4ZTJhYTFkMmUiLCJnZW5kZXIiOiJNYWxlIiwiaWF0IjoxNzE2MTA1OTczfQ.Ie-_q5G9YcM06lv4ia2JXJuh0WxoZT84TGIjUAjbdsE"

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
    });
    it("email is empty should respond with 400 status code for POST /users/login", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "",
          password: "password123",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Please enter a valid email");
    });
    it("email is null should respond with 400 status code for POST /users/login", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
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
    it("password is invalid short should respond with 200 status code for POST /users/login", async () => {
      const response = await request(app).post("/users/login").send({
        email: "john.doe@example.com",
        password: "password1234",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid email or password");
    });


  });

  

  // Add more test cases as needed
});
