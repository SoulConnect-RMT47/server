const z = require("zod");

const swipeSchema = z.object({
    swipeStatus: z.string().refine(value => value === "accepted" || value === "rejected", "Invalid swipe status")
});

const idSchema = z.object({
    id: z.string({ message: "Please enter a valid id"})
});

const _idSchema = z.object({
    _id: z.string({ message: "Please enter a valid _id"})
});

module.exports = { swipeSchema, idSchema, _idSchema};