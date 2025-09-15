import ButtonLoad from "@/components/custom/button-load";
import FormFieldComponent from "@/components/custom/form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

export default function SignatoryForm({
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
            <form action="" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-3">
                    <FormFieldComponent name="name" label="Name" form={form} />
                    <FormFieldComponent
                        name="description"
                        label="Description"
                        type="textarea"
                        form={form}
                    />
                    <FormFieldComponent
                        name="designation_id"
                        type="select"
                        label="Designation"
                        selectItems={
                            <>
                                <SelectItem value="1">Office Head</SelectItem>
                                <SelectItem value="3">Governor</SelectItem>
                                <SelectItem value="4">
                                    Provincial Accountant
                                </SelectItem>
                                <SelectItem value="5">
                                    Chairman-Provincial Nutrition Comittee
                                </SelectItem>
                            </>
                        }
                        form={form}
                    />
                    <FormFieldComponent
                        name="status"
                        label="Status"
                        type="select"
                        form={form}
                        selectItems={
                            <>
                                <SelectItem value="1">Active</SelectItem>
                                <SelectItem value="0">Inactive</SelectItem>
                            </>
                        }
                    />
                </div>
                <ButtonLoad label="Submit" className="w-full mt-8" isPending={isPending} />
            </form>
        </Form>
    );
}
