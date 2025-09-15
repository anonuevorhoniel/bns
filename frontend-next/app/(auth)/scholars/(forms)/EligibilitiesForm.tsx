import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/custom/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Info, Plus, School, Trash2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function EligibilityForm({ form }: { form: UseFormReturn }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "eligibilities",
    });

    const addEligibility = () => {
        append({
            date: "",
            name: "",
            number: "",
        });
    };
    return (
        <>
            <div className="flex justify-between mb-5">
                <Label className="font-bold text-xl">Eligibilities</Label>
                <Button type="button" onClick={addEligibility}>
                    <Plus /> Add Eligibility
                </Button>
            </div>

            {fields.length == 0 && (
                <div className="border-2 border-dashed rounded-lg flex justify-center items-center py-5">
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <div className="p-3 bg-primary rounded-full">
                            <GraduationCap className="text-primary-foreground stroke-[1]" />
                        </div>
                        <Label>No Eligibilities Entered</Label>
                    </div>
                </div>
            )}
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-3"
                >
                    <FormFieldComponent
                        label="Date"
                        type="date"
                        form={form}
                        name={`eligibilities[${index}].date`}
                    />

                    <FormFieldComponent
                        label="Name"
                        form={form}
                        name={`eligibilities[${index}].name`}
                    />

                    <FormFieldComponent
                        label="Number"
                        form={form}
                        name={`eligibilities[${index}].number`}
                    />

                    <Button
                        type="button"
                        className="mt-5"
                        onClick={() => remove(index)}
                    >
                        <Trash2 />
                    </Button>
                </div>
            ))}
        </>
    );
}
