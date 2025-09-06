import { z } from "zod";

const requireError = (name: string) => {
    return `${name} is required`;
};

export const scholarResolver = z
    .object({
        //personal info
        first_name: z
            .string(requireError("First Name"))
            .min(2, { error: "First name should be atleast 2 characters" }),
        middle_name: z.string(requireError("Middle Name")).optional(),
        last_name: z
            .string(requireError("Last Name"))
            .min(2, { error: "Last name should be atleast 2 characters" }),
        name_on_id: z.string(requireError("Name on ID")).optional(),
        id_no: z.string(requireError("ID No")).optional(),
        sex: z.preprocess(
            (val) => val ?? "",
            z.string(requireError("name")).min(1, { error: "Sex is required" })
        ),
        birth_date: z.string({}).optional(),
        civil_status: z.string(requireError("Civil Status")).optional(),
        contact_number: z.string(requireError("Contact Number")).optional().refine((val) => {
            if(val == "" || val == undefined) {
                return true
            }
            return val.length == 11;
        }, {error: '11 characters is required'}),

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
        complete_address: z.string(requireError("Complete Address")).optional(),

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

        //bns to replace
        service_period_status: z
            .string(requireError("Service Period Status"))
            .optional(),
        replacement_date: z.any(),

        //beneificary

        beneficiary_name: z.string().optional(),
        relationship: z.string().optional(),
        with_philhealth: z.string().optional(),
        classification: z.string().optional(),
        philhealth_no: z.preprocess((val: any) => {
            if (!val) {
                return undefined;
            }
            return Number(val);
        }, z.number().optional()),

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
    })
    .refine(
        (value) => {
            if (value.status == "REP") {
                return (
                    value.service_period_status != "" &&
                    value.service_period_status != null
                );
            }

            return true;
        },
        {
            error: "Service Period Status is required",
            path: ["service_period_status"],
        }
    );
// .refine(
//     (value) =>
//          value.status == "REP" &&
//        ( value.replacement_date != null && value.replacement_date != ""),
//     { error: "Date of Replacement is required", path: ["replacement_date"] }
// );
