import { z } from "zod";

export const emailDefaultValues = {
    newEmail: "",
    confirmNewEmail: "",
    password: "",
};

export const emailSchema = z
    .object({
        newEmail: z
            .string()
            .email({ message: "Email is Invalid" })
            .min(3, { message: "New Email is required" }),
        confirmNewEmail: z
            .string()
            .email({ message: "Confirm Email is Invalid" })
            .min(3, { message: "Confirm New Email is required" }),
        password: z
            .string()
            .min(8, { message: "Minimum characters of 8 is required" }),
    })
    .refine(({ newEmail, confirmNewEmail }) => newEmail === confirmNewEmail, {
        message: "Emails do not match",
        path: ["confirmNewEmail"],
    });
