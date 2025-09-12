"use client";

import ax from "@/app/axios";
import FormFieldComponent from "@/components/custom/form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

export default function PayrollForm({
    form,
    handleSubmit,
}: {
    form: UseFormReturn;
    handleSubmit: any;
}) {
    const { data } = useQuery({
        queryKey: ["municipalities"],
        queryFn: async () => await ax.get("/municipalities"),
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <Form {...form}>
                <form action="" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormFieldComponent
                            form={form}
                            name="from"
                            type="month"
                            label="From"
                        />

                        <FormFieldComponent
                            form={form}
                            name="to"
                            type="month"
                            label="To"
                        />
                        <FormFieldComponent
                            form={form}
                            name="rate"
                            type="number"
                            label="Rate"
                        />
                        <FormFieldComponent
                            form={form}
                            name="municipality_code"
                            type="select"
                            selectItems={data?.data?.map(
                                (item: any) => (
                                    <SelectItem
                                        key={item.id}
                                        value={`${item.code}`}
                                    >
                                        {item.name}
                                    </SelectItem>
                                )
                            )}
                            label="Municipality / City"
                        />
                        <FormFieldComponent
                            form={form}
                            name="fund"
                            type="select"
                            label="Fund"
                            selectItems={
                                <>
                                    <SelectItem value="NNC">NNC</SelectItem>
                                    <SelectItem value="LOCAL">LOCAL</SelectItem>
                                    <SelectItem value="BOTH">BOTH</SelectItem>
                                </>
                            }
                        />
                    </div>
                </form>
            </Form>
        </>
    );
}
