import z from "zod";

export const payrollSummaryResolver = z.object({
    fund: z
        .string({ error: "Fund is required" })
        .min(1, { error: "Fund is required" }),
    month_from: z
        .string({ error: "Month From is required" })
        .min(1, { error: "Month From is required" }),
    month_to: z
        .string({ error: "Month To is required" })
        .min(1, { error: "Month To is required" }),
});
