"use client";

import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PayrollForm from "../(forms)/PayrollForm";
import { payrollResolver } from "@/app/Schema/PayrollSchema";
import { Label } from "@/components/ui/label";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import ax from "@/app/axios";
import DataTable from "@/components/custom/datatable";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ButtonLoad from "@/components/custom/button-load";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function page() {
    const scholarData = () => {
        if (isLoading) {
            return (
                <div className="border border-dashed h-20 rounded-lg flex items-center justify-center">
                    <Label>
                        <Spinner /> Loading.. Please wait
                    </Label>
                </div>
            );
        }
        return data?.data ? (
            <DataTable
                data={data?.data?.results}
                columns={columns}
                page={page}
                setPage={setPage}
                isFetching={isFetching}
                pagination={data?.data?.pagination}
            />
        ) : (
            <div className="border border-dashed h-20 rounded-lg flex items-center justify-center">
                <Label>
                    Please enter the filter above to generate scholars
                </Label>
            </div>
        );
    };

    const handleSubmit = (data: any) => {
        console.log(data);
    };
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState<any>([]);
    const form = useForm<any>({ resolver: zodResolver(payrollResolver) });
    const fund = form.watch("fund");
    const from = form.watch("from");
    const to = form.watch("to");
    const municipality_code = form.watch("municipality_code");
    const storePayroll = useMutation({
        mutationFn: async () =>
            await ax.post("/payrolls/store", {
                scholars: selected,
                fund: fund,
                from: from,
                to: to,
                municipality_code: municipality_code,
                rate: 1,
            }),
        onSuccess: (data: any) => {
            router.push("/payrolls");
            toast.success("Success", { description: "Payroll Added" });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const formData = {
        page: page,
        from: from,
        to: to,
        fund: fund,
        municipality_code: municipality_code,
    };

    const { data, isFetching, isLoading, isError, error } = useQuery({
        queryKey: ["scholars", fund, from, to, municipality_code, page],
        queryFn: async () => await ax.post("/getScholars", formData),
        enabled: !!fund && !!from && !!to && !!municipality_code,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });
    const scholarIds = data?.data?.scholar_ids;

    if (isError) {
        console.log(error);
    }

    const removeId = (id: any) => {
        setSelected((item: any) => item.filter((prev: any) => prev != id));
    };

    useEffect(() => {
        if (scholarIds?.length > 0 && selectAll) {
            setSelected([...scholarIds]);
        } else {
            setSelected([]);
        }
    }, [selectAll]);

    const columns = [
        {
            header: "Action",
            cell: (item: any) => (
                <div>
                    <Checkbox
                        checked={selected.includes(item?.id)}
                        onCheckedChange={(e) => {
                            if (e) {
                                setSelected([...selected, item.id]);
                            } else {
                                removeId(item?.id);
                            }
                        }}
                    />
                </div>
            ),
        },
        {
            accessKey: "name",
            header: "Full Name",
        },
        {
            accessKey: "barangay",
            header: "Barangay",
        },
        {
            accessKey: "months",
            header: "Service Period",
        },
    ];

    return (
        <>
            <title>BNS | Create Payroll</title>
            <Card className="px-6">
                <PayrollForm form={form} handleSubmit={handleSubmit} />
            </Card>
            <Card className="px-6">
                <div className="flex gap-5 items-center cursor-pointer">
                    <ButtonLoad
                        onClick={() => {
                            if (
                                selected?.length == 0 ||
                                selected?.length == undefined
                            ) {
                                toast.error("None Selected", {
                                    description:
                                        "Please select atleast one scholar",
                                });
                            } else {
                                storePayroll.mutate();
                            }
                        }}
                        label={
                            <>
                                <Plus /> Add To Payroll
                            </>
                        }
                        isPending={storePayroll.isPending}
                    />

                    <div
                        className={`flex gap-2 border p-2 rounded-md ${
                            selectAll && "border-primary"
                        }`}
                        onClick={() => {
                            setSelectAll((prev) => !prev);
                        }}
                    >
                        <Checkbox checked={selectAll} />{" "}
                        <Label className="cursor-pointer">Select All</Label>
                    </div>
                </div>
                {scholarData()}
            </Card>
        </>
    );
}
