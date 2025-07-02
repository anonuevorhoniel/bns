import { z } from "zod";

export const spSchema = z
    .object({
        from: z.string().min(1, { message: "From Date is required" }),
        select_to: z.string().min(1, { message: "Please select" }),
        to: z.string().optional(),
    })
    .refine(({ select_to, to }) => (select_to == "present") || ( select_to != "present" && to != ""), {
        message: "To Date is required",
        path: ["to"]
    });
