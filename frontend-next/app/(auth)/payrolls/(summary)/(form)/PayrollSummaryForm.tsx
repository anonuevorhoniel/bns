import ButtonLoad from "@/components/custom/button-load";
import FormFieldComponent from "@/components/custom/form-field";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { Download } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export default function PayrollSummaryForm({
    form,
    handleSubmit,
    isPending,
}: {
    form: UseFormReturn;
    handleSubmit: any;
    isPending: boolean;
}) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-5">
                    <FormFieldComponent
                        name="fund"
                        form={form}
                        label="Fund"
                        type="select"
                        selectItems={
                            <>
                                <SelectItem value="NNC">NNC</SelectItem>
                                <SelectItem value="LOCAL">LOCAL</SelectItem>
                                <SelectItem value="BOTH">BOTH</SelectItem>
                            </>
                        }
                    />
                    <FormFieldComponent
                        name="month_from"
                        form={form}
                        type="month"
                        label="Month From"
                    />
                    <FormFieldComponent
                        name="month_to"
                        form={form}
                        type="month"
                        label="Month To"
                    />
                </div>

                <ButtonLoad
                    isPending={isPending}
                    label={<><Label><Download /> Download</Label></>}
                    className="w-full mt-5"
                />
            </form>
        </Form>
    );
}
