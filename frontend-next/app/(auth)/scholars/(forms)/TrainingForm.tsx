import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/custom/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Plus, School, Trash2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function TrainingForm({ form }: { form: UseFormReturn }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "trainings",
    });

    const addTraining = () => {
        append({
            name: "",
            from_date: "",
            to_date: "",
            trainor: "",
        });
    };
    return (
        <>
            <div className="flex justify-between mb-5">
                <div className="flex flex-col justify-center">
                    <Label className="font-bold text-xl">Trainings</Label>
                    <Label className="text-sm  opacity-70 font-thin">
                        <Info size={15} /> Please enter trainings taken 3 years
                        and below
                    </Label>
                </div>
                <Button type="button" onClick={addTraining}>
                    <Plus /> Add Training
                </Button>
            </div>

            {fields.length == 0 && (
                <div className="border-2 border-dashed rounded-lg flex justify-center items-center py-5">
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <div className="p-3 bg-primary rounded-full">
                            <School className="text-primary-foreground stroke-[1]" />
                        </div>
                        <Label>No Trainings Entered</Label>
                    </div>
                </div>
            )}
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="grid grid-cols-1 lg:grid-cols-5 gap-3"
                >
                    <FormFieldComponent
                        label="Name"
                        form={form}
                        name={`trainings[${index}].name`}
                    />
                    <FormFieldComponent
                        label="From Date"
                        form={form}
                        name={`trainings[${index}].from_date`}
                        type="date"
                    />
                    <FormFieldComponent
                        label="To Date"
                        form={form}
                        name={`trainings[${index}].to_date`}
                        type="date"
                    />
                    <FormFieldComponent
                        label="Trainor"
                        form={form}
                        name={`trainings[${index}].trainor`}
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
