//require zod
const { z } = require("zod");

//create schema
const userSchema = z.object({
    name: z.string().nonempty(),
    age: z.number().int().positive,
    gender: z.string().nonempty(),
    status: z.string().nonempty(),
    imgUrl: z.string().optional(),
    username: z.string().nonempty().min(3),
    email: z.string().email(),
    password: z.string().min(5),
    location: z.string().optional(),
    bio: z.string().optional(),
    preference: z.array(z.string()).optional()
});

const userCreaetionSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email"}),
    password: z.string().min(5, { message: "Password must be at least 5 characters long"}),
});



module.exports = {userSchema, userCreaetionSchema};