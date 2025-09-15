import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/custom/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

export default function PersonalInformationForm({
    form,
}: {
    form: UseFormReturn;
}) {
    return (
        <>
            <Label className="font-bold text-xl mb-5">
                Personal Information
            </Label>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <FormFieldComponent
                    name="first_name"
                    label="First name"
                    form={form}
                />
                <FormFieldComponent
                    name="middle_name"
                    label="Middle name"
                    form={form}
                />
                <FormFieldComponent
                    name="last_name"
                    label="Last name"
                    form={form}
                />
                <FormFieldComponent
                    name="name_on_id"
                    label="Name on ID"
                    form={form}
                />
                <FormFieldComponent name="id_no" label="ID No" form={form} />
                <FormFieldComponent
                    name="sex"
                    label="Sex"
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                        </>
                    }
                    form={form}
                />
                <FormFieldComponent
                    name="birth_date"
                    label="Birth Date"
                    type="date"
                    form={form}
                />
                <FormFieldComponent
                    name="civil_status"
                    label="Civil Status"
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Widowed/Widow">
                                Widowed/Widow
                            </SelectItem>
                            <SelectItem value="Separated">Separated</SelectItem>
                        </>
                    }
                    form={form}
                />
                <FormFieldComponent
                    name="contact_number"
                    type="number"
                    label="Contact Number"
                    form={form}
                />
            </div>
        </>
    );
}
