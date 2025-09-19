import ButtonLoad from "@/components/custom/button-load";
import FormFieldComponent from "@/components/custom/form-field";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

export default function RateForm({
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                <FormFieldComponent name="rate" label="Rate" form={form} />
                <ButtonLoad label="Submit" className="w-full" isPending={isPending}/>
            </form>
        </Form>
    );
}
