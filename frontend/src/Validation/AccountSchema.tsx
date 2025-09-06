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

export const passwordDefaultValues = {
    newPassword: "",
    confirmNewPassword: "",
    password: "",
};

export const PasswordSchema = z
    .object({
        newPassword: z
            .string({ message: "New Password is required" })
            .min(8, { message: "Minumum of 8 characters is required" }),
        confirmNewPassword: z
            .string({ message: "Confirm New Password is required" })
            .min(8, { message: "Minumum of 8 characters is required" }),
        password: z
            .string({ message: "Password is required" })
            .min(8, { message: "Minumum of 8 characters is required" }),
    })
    .refine(
        ({ newPassword, confirmNewPassword }) =>
            newPassword === confirmNewPassword,
        {
            message: "Passwords do not match",
            path: ["confirmNewPassword"],
        }
    );
