import { z } from "zod";

export const PayrollSchema = z.object({
    from: z.string().min(1, {message: "Month from is required"}),
    to: z.string().min(1, {message: "Month to is required"}),
    rate: z.string().min(1, {message: "Rate is required"}),
    fund: z.string().min(1, {message: "Fund is required"}),
    municipality_code: z.string().min(1, {message: "Muni / City is required"}),
})