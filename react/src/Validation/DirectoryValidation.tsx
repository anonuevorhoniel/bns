import { z } from "zod";

export const DirectorySchema = z.object({
    code: z.string().min(1, {message: "Please select City / Municipality"}),
    fund: z.string().min(1, {message: "Please select a Fund"}),
    year: z.string().min(4, {message: "Year too low and invalid"}).max(4, {message: "Year too high and invalid"})
});