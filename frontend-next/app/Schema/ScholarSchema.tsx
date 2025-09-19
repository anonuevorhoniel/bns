import { z } from "zod";

const requireError = (name: string) => {
    return `${name} is required`;
};

const trainingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    from_date: z.string().min(1, "From date is required"),
    to_date: z.string().min(1, "To date is required"),
    trainor: z.string().min(1, "Trainor is required"),
});

const eligibilitySchema = z.object({
    name: z.string().min(1, "Name is required"),
    date: z.string().min(1, "Date is required"),
    number: z.string().min(1, "Number is required"),
});

export const scholarResolver = z
    .object({
        //personal info
        first_name: z
            .string(requireError("First Name"))
            .min(2, { error: "First name should be atleast 2 characters" }),
        middle_name: z
            .string(requireError("Middle Name"))
            .nullable()
            .optional(),
        last_name: z
            .string(requireError("Last Name"))
            .min(2, { error: "Last name should be atleast 2 characters" }),
        name_on_id: z.string(requireError("Name on ID")).nullable().optional(),
        id_no: z.string(requireError("ID No")).nullable().optional(),
        sex: z.preprocess(
            (val) => val ?? "",
            z.string(requireError("name")).min(1, { error: "Sex is required" })
        ),
        birth_date: z.string({}).nullable().optional(),
        civil_status: z
            .string(requireError("Civil Status"))
            .nullable()
            .optional(),
        contact_number: z.string().nullable().optional(),
        // .refine(
        //     (val) => {
        //         if (val == "" || val == undefined) {
        //             return true;
        //         }
        //         return val.length == 11;
        //     },
        //     { error: "11 characters is required" }
        // ),

        //location
        district_id: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("District"))
                .min(1, { error: "District is required" })
        ),
        citymuni_id: z
            .string(requireError("City / Municipality"))
            .min(1, { error: "City / Municipality is required" }),
        barangay_id: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("Barangay"))
                .min(1, { error: "Barangay is required" })
        ),
        complete_address: z
            .string(requireError("Complete Address"))
            .nullable()
            .optional(),

        //additional info
        status: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("Status"))
                .min(1, { error: "Status is required" })
        ),
        bns_type: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("BNS Type"))
                .min(1, { error: "BNS Type is required" })
        ),
        place_of_assignment: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("name"))
                .min(1, { error: "Place of assignment is required" })
        ),
        place_of_assignment_others: z.any().nullable().optional(),
        educational_attainment: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("name"))
                .min(1, { error: "Educational Attainment is required" })
        ),
        first_employment_date: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("name"))
                .min(1, { error: "First Employment is required" })
        ),
        replaced_scholar_id: z.number().nullable().optional(),

        //bns to replace
        service_period_status: z
            .string(requireError("Service Period Status"))
            .nullable()
            .optional(),
        replacement_date: z.any(),

        //beneificary
        benificiary_name: z.string().nullable().optional(),
        relationship: z.string().nullable().optional(),
        with_philhealth: z.string().nullable().optional(),
        classification: z.string().nullable().optional(),
        philhealth_no: z.string().optional(),

        //fund
        fund: z.preprocess(
            (val) => val ?? "",
            z
                .string(requireError("name"))
                .min(1, { error: "Fund type is required" })
        ),
        incentive_prov: z.preprocess((val: any) => {
            if (!val) {
                return undefined;
            }
            return Number(val);
        }, z.number().optional()),
        incentive_mun: z.preprocess((val: any) => {
            if (!val) {
                return undefined;
            }
            return Number(val);
        }, z.number().optional()),
        incentive_brgy: z.preprocess((val: any) => {
            if (!val) {
                return undefined;
            }
            return Number(val);
        }, z.number().optional()),
        trainings: z.array(trainingSchema).nullable().optional(),
        eligibilities: z.array(eligibilitySchema).nullable().optional(),
    })
    .refine(
        (val) => {
            if (val.place_of_assignment == "OTHERS") {
                return (
                    val.place_of_assignment_others != null &&
                    val.place_of_assignment_others != ""
                );
            }
            return true;
        },
        {
            error: "Other Place of Assignment is required",
            path: ["place_of_assignment_others"],
        }
    )
    .refine(
        (value) => {
            if (value.with_philhealth == "Yes") {
                return (
                    value.classification != null && value.classification != ""
                );
            }
            return true;
        },
        { error: "Classification is required", path: ["classification"] }
    )
    .refine(
        (value) => {
            if (value.with_philhealth == "Yes") {
                return value.philhealth_no != null && value.philhealth_no != "";
            }
            return true;
        },
        { error: "PhilHealth Number is required", path: ["philhealth_no"] }
    );
