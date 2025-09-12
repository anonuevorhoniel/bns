import z from "zod";

export const loginResolver = z.object({
    email: z.email({ error: "Invalid Email" }).min(3, {error: "Email is required"}),
    password: z
        .string({ error: "Password is required" })
        .min(8, { error: "Minimum of 8 characters is required" }),
});
