import { z } from "zod";

export const CreateSignatorySchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    description: z.string().min(1, {message: "Description is required"}),
    designation_id: z.string().min(1, {message: "Designation is required"}),
    status: z.string().min(1, {message: "Status is required"}),
})