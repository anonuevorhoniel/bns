import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/custom/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Plus, School } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export default function TrainingForm({ form }: { form: UseFormReturn }) {
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
                <Button type="button">
                    <Plus /> Add Training
                </Button>
            </div>

            <div className="border-2 border-dashed rounded-lg flex justify-center items-center py-5">
                <div className="flex flex-col gap-3 justify-center items-center">
                    <div className="p-3 bg-primary rounded-full">
                        <School className="text-primary-foreground stroke-[1]" />
                    </div>
                    <Label>No Trainings Entered</Label>
                </div>
            </div>
        </>
    );
}
