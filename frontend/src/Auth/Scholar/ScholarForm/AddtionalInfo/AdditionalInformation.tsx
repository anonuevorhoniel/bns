import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import FormFieldInput from "@/Reusable/FormFieldInput";
import FormFieldSelect from "@/Reusable/FormFieldSelect";
import { useEffect, useState } from "react";
import { AdditionalInfo, ScholarEdit } from "@/Actions/ScholarAction";
import { ShowTable } from "./ShowTable";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form";

export default function AdditionalInformation({ scholarForm }: any) {
    const {
        setValue,
        formState: { errors },
    } = scholarForm;

    const [replacement, setReplacement] = useState(false);
    let id = useParams().id;
    const { form, setFormData } = useCreateScholarForm();
    useEffect(() => {
        if (form?.status == "REP") {
            setReplacement(true);
        } else {
            setReplacement(false);
            setFormData({ name: "replacement_date", value: null });
            setFormData({ name: "replaced_scholar_id", value: null });
            setValue("replacement_date", null);
            setValue("replaced_scholar_id", null);
            setReplacementPersonName(null);
        }
    }, [form.status]);
    const { setShow, replacementPersonName, setReplacementPersonName } =
        AdditionalInfo();

    if (id) {
        const { getScholarData } = ScholarEdit();

        const { data } = useQuery({
            queryKey: ["scholar"],
            queryFn: () => getScholarData({ id }),
            refetchOnWindowFocus: false,
        });

        const replaced = data?.replaced;
        useEffect(() => {
            setReplacementPersonName(replaced?.full_name);
        }, [replaced]);
    }

    return (
        <>
            <ShowTable />
            <div className="p-4 space-y-4">
                <p className="text-xl mb-6">Additional Information</p>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 sm:grid-cols-2">
                    <div>
                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name="status"
                            formLabel="Status (OLD/REP/NEW)"
                            placeholder="-- Select Status --"
                            selectItem={
                                <>
                                    <SelectItem value="OLD">OLD</SelectItem>
                                    <SelectItem value="REP">REP</SelectItem>
                                    <SelectItem value="NEW">NEW</SelectItem>
                                </>
                            }
                        />
                    </div>

                    <div>
                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name="bns_type"
                            formLabel="BNS Type"
                            placeholder="-- Select BNS Type --"
                            selectItem={
                                <>
                                    <SelectItem value="BNS">BNS</SelectItem>
                                    <SelectItem value="Assitant BNS">
                                        Assitant BNS
                                    </SelectItem>
                                </>
                            }
                        />
                    </div>

                    <div>
                        <FormField
                            control={scholarForm.control}
                            name="place_of_assignment"
                            render={({ field }) => {
                                const { error } = useFormField();
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Place of Assignment
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onValueChange={(e) => {
                                                    field.onChange(e);
                                                    setFormData({
                                                        name: "place_of_assignment",
                                                        value: e,
                                                    });
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={`w-full ${
                                                        error &&
                                                        "border-red-500"
                                                    }`}
                                                >
                                                    <SelectValue placeholder="-- Select Place of Assignment --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Same as Barangay">
                                                        Same as Barangay
                                                    </SelectItem>
                                                    <SelectItem value="BNS Coordinator">
                                                        BNS Coordinator
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        ></FormField>
                    </div>
                    <div>
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name="educational_attainment"
                            placeholder={"--Educational Attainment--"}
                            formLabel={"Educational Attainment"}
                        />
                    </div>

                    <div>
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name="first_employment_date"
                            formLabel={"First Employment Date"}
                            type={"date"}
                        />
                    </div>

                    {replacement && (
                        <div onClick={() => setShow(true)}>
                            <Label className="mb-2">To be Replaced By:</Label>
                            <Button
                                type="button"
                                variant={
                                    errors.replaced_scholar_id
                                        ? "destructive"
                                        : "outline"
                                }
                                className={`w-full ${
                                    errors.replaced_scholar_id
                                        ? "border-red-500"
                                        : ""
                                }`}
                            >
                                {replacementPersonName ||
                                    "-- Select Scholar to Replace --"}
                            </Button>
                            {errors.replaced_scholar_id && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.replaced_scholar_id.message}
                                </p>
                            )}
                        </div>
                    )}

                    {replacement && (
                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name={"service_period_status"}
                            formLabel="Service Period Status"
                            placeholder="Select Service Period Status"
                            selectItem={
                                <>
                                    <SelectItem value="null">None</SelectItem>
                                    <SelectItem value="new_service_period">
                                        New Service Period
                                    </SelectItem>
                                    <SelectItem value="update_service_period">
                                        Update Service Period
                                    </SelectItem>
                                </>
                            }
                        />
                    )}

                    {replacement && (
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name="replacement_date"
                            formLabel="Date of Replacement"
                            placeholder="-- Replacement Date --"
                            type="date"
                        />
                    )}

                    {replacement && (
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name="end_employment_date"
                            formLabel="End Employment Date"
                            placeholder="-- End Employment Date --"
                            type="date"
                        />
                    )}
                </div>
            </div>
        </>
    );
}
