//require zod
const { z } = require("zod");

//create schema
const userSchema = z.object({
  name: z.string({ message: "Please enter a valid name" }),
  age: z.number({ message: "Age is required" }).min(18, { message: "You must be at least 18 years old" }),
  gender: z.string({ message: "Gender is required" }),
  imgUrl: z.string().optional(),
  username: z.string({ message: "Please input username" }).min(3),
  email: z.string({ message: "Email is required" }).email({ message: "Please enter a valid email" }),
  password: z.string({ message: "Password is required" }).min(5, { message: "Password must be at least 5 characters long" }),
  location: z.string().optional(),
  bio: z.string().optional(),
  preference: z.array(z.string(), { message: "Please select at least one preference" }),
});

const loginSchema = z.object({
  email: z.string({ message: "Email is required" }).email({ message: "Please enter a valid email" }),
  password: z.string({ message: "Password is required" }).min(5, { message: "Password must be at least 5 characters long" }),
});

const updateSchema = z.object({
  name: z.string({ message: "Please enter a valid name" }).optional(),
  bio: z.string().optional(),
  age: z.number({ message: "Age is required" }).min(18, { message: "You must be at least 18 years old" }).optional(),
  email: z.string({ message: "Email is required" }).email({ message: "Please enter a valid email" }).optional(),
});

module.exports = { userSchema, loginSchema, updateSchema };
