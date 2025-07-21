import { SelectItem } from "@/components/ui/select";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import FormFieldInput from "@/Reusable/FormFieldInput";
import FormFieldSelect from "@/Reusable/FormFieldSelect";
import { useEffect, useState } from "react";

export default function Beneficiary({ scholarForm }: any) {
    const [withPH, setWithPH] = useState(false);
    const { form, setFormData } = useCreateScholarForm();

    useEffect(() => {
        if (
            form.withPhilHealth == "YES" ||
            form.classification ||
            form.philhealth_no
        ) {
            setWithPH(true);
        } else {
            setWithPH(false);
            setFormData({ name: "classification", value: "" });
            setFormData({ name: "philhealth_no", value: "" });
        }
    }, [form.withPhilHealth, form.classification, form.philhealth_no]);

    return (
        <>
            <div className="p-4 space-y-4">
                <p className="text-xl mb-6">Beneficiary</p>
                <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:grid-cols-2">
                    <div>
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"benificiary_name"}
                            formLabel={"Beneficiary Name"}
                            placeholder="--Beneficiary Name--"
                        />
                    </div>
                    <div>
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"relationship"}
                            formLabel={"Relationship"}
                            placeholder="--Relationship--"
                        />
                    </div>
                    <div>
                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name={"withPhilHealth"}
                            formLabel="With PhilHealth?"
                            placeholder="-- Select --"
                            selectItem={
                                <>
                                    <SelectItem value="YES">Yes</SelectItem>
                                    <SelectItem value="NO">No</SelectItem>
                                </>
                            }
                        />
                    </div>

                    {withPH && (
                        <div>
                            <FormFieldInput
                                scholarForm={scholarForm}
                                name={"classification"}
                                formLabel={"Classification"}
                                placeholder="--Classification--"
                            />
                        </div>
                    )}

                    {withPH && (
                        <div>
                            <FormFieldInput
                                scholarForm={scholarForm}
                                name={"philhealth_no"}
                                formLabel={"PhilHealth no."}
                                placeholder="--PhilHealth no.--"
                                type={"number"}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
