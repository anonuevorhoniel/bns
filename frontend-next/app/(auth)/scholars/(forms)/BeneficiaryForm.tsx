import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/custom/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export default function BeneficiaryForm({ form }: { form: UseFormReturn }) {
    const withPhilHealth = form.watch("with_philhealth");

    useEffect(() => {
        if (withPhilHealth == "No") {
            form.setValue("classification", "");
            form.setValue("philhealth_no", "");
        }
    }, [withPhilHealth]);
    return (
        <>
            <Label className="font-bold text-xl mb-5">
                Beneficiary Information
            </Label>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <FormFieldComponent
                    name="benificiary_name"
                    label="Beneficiary Name"
                    form={form}
                />
                <FormFieldComponent
                    name="relationship"
                    label="Relationship"
                    form={form}
                />
                <FormFieldComponent
                    name="with_philhealth"
                    label="With PhilHealth"
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                        </>
                    }
                    form={form}
                />
                {withPhilHealth == "Yes" && (
                    <>
                        <FormFieldComponent
                            name="classification"
                            label="Classification"
                            form={form}
                        />
                        <FormFieldComponent
                            name="philhealth_no"
                            type="number"
                            label="PhilHealth Number"
                            form={form}
                        />
                    </>
                )}
            </div>
        </>
    );
}
