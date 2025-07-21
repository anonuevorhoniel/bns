import { z } from "zod";

export const spSchema = z
    .object({
        from: z.string().min(1, { message: "From Date is required" }),
        select_to: z.string().min(1, { message: "Please select" }),
        to: z.string().optional(),
    })
    .refine(
        ({ select_to, to }) =>
            select_to == "present" || (select_to != "present" && to != ""),
        {
            message: "Specific Date is required",
            path: ["to"],
        }
    );

export const createSPSchema = z
    .object({
        municipality_code: z
            .string()
            .min(1, { message: "Please select a Muni/City" }),
        from: z.string().min(1, { message: "From Date is required" }),
        to: z.string().min(1, { message: "Please select" }),
        specific_date: z.string().optional(),
    })
    .refine(
        ({ specific_date, to }) =>
            to == "present" || (to != "present" && specific_date != ""),
        {
            message: "Specific Date is required",
            path: ["specific_date"],
        }
    );
