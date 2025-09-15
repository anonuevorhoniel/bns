import z from "zod";

export const signatoryResolver = z.object({
    name: z
        .string({ error: "Name is required" })
        .min(2, { error: "Mninum of 2 characters is required" }),
    description: z
        .string({ error: "Description is required" })
        .min(2, { error: "Mninum of 2 characters is required" }),
    designation_id: z.string({error: "Designation is required"}).min(1, {error: "Designation is required"}),
    status: z.string({error: "Status is required"}).min(1, {error: "Status is required"})
});
