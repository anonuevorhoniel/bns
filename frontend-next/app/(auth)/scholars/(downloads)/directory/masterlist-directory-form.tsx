import ax from "@/app/axios";
import ButtonLoad from "@/components/custom/button-load";
import FormFieldComponent from "@/components/custom/form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import useMunicipalities from "@/hooks/municipalities/useMunicipalities";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

const municipalities = await useMunicipalities();
export default function MasterlistDirectoryForm({
    form,
    handleSubmit,
    isPending,
}: {
    form: UseFormReturn;
    handleSubmit: any;
    isPending: boolean;
}) {
    return (
        <>
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-3"
                >
                    <FormFieldComponent
                        name="code"
                        form={form}
                        type="select"
                        label="City / Municipality"
                        selectItems={municipalities?.map((item: any) => (
                            <SelectItem key={item.id} value={`${item.code}`}>
                                {item.name}
                            </SelectItem>
                        ))}
                    />
                    <FormFieldComponent
                        name="fund"
                        type="select"
                        selectItems={
                            <>
                                <SelectItem value="NNC">NNC</SelectItem>
                                <SelectItem value="LOCAL">LOCAL</SelectItem>
                                <SelectItem value="BOTH">BOTH</SelectItem>
                            </>
                        }
                        form={form}
                        label="Fund"
                    />
                    <FormFieldComponent
                        name="year"
                        type="number"
                        form={form}
                        label="Year"
                    />
                    <ButtonLoad
                        isPending={isPending}
                        label={
                            <>
                                <Download /> Download
                            </>
                        }
                        className="w-full mt-5"
                    />
                </form>
            </Form>
        </>
    );
}
