import z from "zod";

export const servicePeriodResolver = z
    .object({
        from: z
            .string({ error: "From Date is required" })
            .min(1, { error: "From Date if required" }),
        to: z
            .string({ error: "To Date is required" })
            .min(1, { error: "To Date if required" }),
        municipality_code: z
            .string({ error: "City / Muni is required" })
            .min(1, { error: "City / Muni if required" }),
        specific_date: z.any().optional(),
    })
    .refine(
        (item) => {
            console.log("🔍 Debug refine function:");
            console.log("item.to:", item.to);
            console.log("item.specific_date:", item.specific_date);
            console.log("typeof specific_date:", typeof item.specific_date);
            if (item.to == "specific") {
                return (
                    item.specific_date != null &&
                    item.specific_date != undefined &&
                    item.specific_date != ""
                );
            }
            return true;
        },
        { error: "Specific Date is required", path: ["specific_date"] }
    );
