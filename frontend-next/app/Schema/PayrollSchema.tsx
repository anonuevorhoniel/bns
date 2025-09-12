import z from "zod";

export const payrollResolver = z.object({
    from: z.string({error: "From Date is required"}).min(1, {error: "From Date is required"}),
    to: z.string({error: "To Date is required"}).min(1, {error: "To Date is required"}),
    rate: z.string({error: "Rate is required"}).min(1, {error: "Rate is required"}),
    municipality_code: z.string({error: "Muni / City is required"}).min(1, {error: "Muni / City is required"}),
    fund: z.string({error: "Fund is required"}).min(1, {error: "Fund is required"}),
})