import z from "zod";

export const masterlistDirectoryResolver = z.object({
    code: z.string({error: "Muni / City is required"}).min(1, {error: "Muni / City is required"}),
    year: z.string({error: "Year is required"}).min(4, {error: "Year is required"}),
    fund: z.string({error: "Fund is required"}).min(1, {error: "Fund is required"}),

})