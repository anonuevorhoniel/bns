"use client";

import ax from "@/app/axios";
import FormFieldComponent from "@/components/custom/form-field";
import LoadingScreen from "@/components/custom/loading-screen";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { useUser } from "@/hooks/user/useUser";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export default function PayrollForm({
    form,
    classification,
}: {
    form: UseFormReturn;
    classification: string;
}) {
    const { data, isFetching: municipalitiesLoading } = useQuery({
        queryKey: ["municipalities"],
        queryFn: async () => await ax.get("/municipalities"),
        refetchOnWindowFocus: false,
    });
    const [isMounted, setIsMounted] = useState(false);
    const { data: rateData, isFetching: ratesLoading } = useQuery({
        queryKey: ["rates"],
        queryFn: async () => await ax.get("/rates"),
        enabled: classification == "System Administrator",
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <LoadingScreen />;
    }

    const rates = rateData?.data?.rates;
    const fund = form.watch("fund");

    return (
        <>
            <Form {...form}>
                <form action="">
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

                        {classification == "System Administrator" && (
                            <FormFieldComponent
                                form={form}
                                name="municipality_code"
                                type="select"
                                selectItems={data?.data?.map((item: any) => (
                                    <SelectItem
                                        key={item.id}
                                        value={`${item.code}`}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                                label="Municipality / City"
                            />
                        )}
                        {classification == "System Administrator" && (
                            <FormFieldComponent
                                form={form}
                                name="fund"
                                type="select"
                                label="Fund"
                                selectItems={
                                    <>
                                        <SelectItem value="NNC">NNC</SelectItem>
                                        <SelectItem value="Province">
                                            PROVINCE
                                        </SelectItem>
                                    </>
                                }
                            />
                        )}

                        {classification == "System Administrator" &&
                            fund == "NNC" && (
                                <FormFieldComponent
                                    form={form}
                                    name="rate"
                                    type="select"
                                    selectItems={
                                        <>
                                            {rates?.map((item: any) => (
                                                <SelectItem
                                                    value={`${item.id}`}
                                                    key={item.id}
                                                >
                                                    {item.rate}
                                                </SelectItem>
                                            ))}
                                        </>
                                    }
                                    label="Rate"
                                />
                            )}
                    </div>
                </form>
            </Form>
        </>
    );
}
