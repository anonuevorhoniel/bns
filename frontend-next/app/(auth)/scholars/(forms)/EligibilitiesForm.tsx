import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Info, Plus, School } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export default function EligibilityForm({ form }: { form: UseFormReturn }) {
    return (
        <>
            <div className="flex justify-between mb-5">
                <Label className="font-bold text-xl">Eligibilities</Label>
                <Button type="button">
                    <Plus /> Add Eligibility
                </Button>
            </div>
            <div className="border-2 border-dashed rounded-lg flex justify-center items-center py-5">
                <div className="flex flex-col gap-3 justify-center items-center">
                    <div className="p-3 bg-primary rounded-full">
                        <GraduationCap className="text-primary-foreground stroke-[1]" />
                    </div>
                    <Label>No Eligibilities Entered</Label>
                </div>
            </div>
        </>
    );
}
