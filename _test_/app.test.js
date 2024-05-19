const request = require("supertest");
const { app, port } = require("../app");
const { UserCollection, SwipeCollection, ConnectionCollection } = require("../connections/collections");
const { client, database } = require("../connections/mongodb");

describe("App", () => {
  let server;
  let token = "";

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
  });

  // Add more test cases as needed
});
