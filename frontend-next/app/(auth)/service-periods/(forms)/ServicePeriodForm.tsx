import ButtonLoad from "@/components/custom/button-load";
import FormFieldComponent from "@/components/custom/form-field";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { formType } from "@/types/formType";

export default function ServicePeriodForm({
    form,
    handleSubmit,
    isPending,
}: formType) {
    const to = form.watch("to");
    return (
        <Form {...form}>
            <form
                action=""
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5 grid grid-cols-1 lg:grid-cols-2 gap-5"
            >
                <FormFieldComponent
                    label="From"
                    type="date"
                    form={form}
                    name="from"
                />

                <FormFieldComponent
                    label="To"
                    type="select"
                    form={form}
                    name="to"
                    selectItems={
                        <>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="specific">
                                Specific Date
                            </SelectItem>
                        </>
                    }
                />

                <FormFieldComponent
                    label="City / Municipality"
                    type="select"
                    form={form}
                    name="municipality_code"
                />

                {to == "specific" && (
                    <FormFieldComponent
                        label="Specific Date"
                        type="date"
                        form={form}
                        name="specific_date"
                    />
                )}

                <ButtonLoad
                    isPending={isPending}
                    label="Submit"
                    className="w-full lg:col-span-2"
                />
            </form>
        </Form>
    );
}
