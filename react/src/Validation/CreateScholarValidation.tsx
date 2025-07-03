import { z } from "zod";

export const ScholarformSchema = z.object({
    first_name: z
        .string()
        .min(2, { message: "First name should be atleast 2 characters" }),
    last_name: z
        .string()
        .min(2, { message: "Last name should be atleast 2 characters" }),
    sex: z.preprocess((val) => val ?? '', z.string().min(1, { message: "Sex is required" })),
    district_id: z.preprocess((val) => val ?? '', z.string().min(1, { message: "District is required" })),
    citymuni_id: z
        .string()
        .min(1, { message: "City / Municipality is required" }),
    barangay_id: z.preprocess((val) => val ?? '', z.string().min(1, { message: "Barangay is required" })),
    status: z.preprocess((val) => val ?? '', z.string().min(1, {message: "Status is required"})),
    bns_type: z.preprocess((val) => val ?? '', z.string().min(1, {message: "BNS Type is required"})),
    place_of_assignment: z.preprocess((val) => val ?? '', z.string().min(1, {message: "Place of assignment is required"})),
    educational_attainment: z.preprocess((val) => val ?? '', z.string().min(1, {message: "Educational Attainment is required"})),
    first_employment_date: z.preprocess((val) => val ?? '', z.string().min(1, {message: "First Employment is required"})),
    fund: z.preprocess((val) => val ?? '', z.string().min(1, {message: "Fund type is required"})),
});

