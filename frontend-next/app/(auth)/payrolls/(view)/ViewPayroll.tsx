import ax from "@/app/axios";
import { usePayrollView } from "@/app/global/payrolls/usePayrollView";
import { useScholarView } from "@/app/global/scholars/useScholarView";
import DataTable from "@/components/custom/datatable";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, Search } from "lucide-react";
import { useState } from "react";
import ViewScholar from "../../scholars/(view)/ViewScholar";
import { AnimatePresence, motion } from "motion/react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewPayroll() {
    const { open, setOpen, id, setPage, page, payrollView, setPayrollView } =
        usePayrollView();
    const { setScholar } = useScholarView();

    const { data, isFetching } = useQuery({
        queryKey: ["viewPayroll", id, page],
        queryFn: async () =>
            await ax.post(`/payrolls/show/${id}`, { page: page }),
        placeholderData: keepPreviousData,
        enabled: !!id,
        refetchOnWindowFocus: false,
    });

    const payroll = data?.data?.payroll;
    const signatories = payroll?.signatories;
    const scholars = data?.data?.scholars;
    const pagination = data?.data?.pagination;

    const columns = [
        {
            accessKey: "full_name",
            header: "Full Name",
        },
        {
            accessKey: "service_period",
            header: "Service Period",
        },
        {
            header: "Fund",
            cell: (item: any) => <Badge>{item.fund}</Badge>,
        },
        {
            accessKey: "barangay_name",
            header: "Barangay",
        },
        {
            header: "Action",
            cell: (item: any) => (
                <>
                    <Button
                        size={"sm"}
                        onClick={() => {
                            setScholar(item);
                            setPayrollView(false);
                        }}
                    >
                        <Search />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <ResponsiveDialog
            open={open}
            setOpen={setOpen}
            title="Barangay Nutrition Scholar Directory"
            className="min-w-[900px] max-h-[91vh] overflow-auto"
        >
            <div className="relative">
                <AnimatePresence mode="wait">
                    {payrollView ? (
                        <motion.div
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "-100%" }}
                            transition={{ duration: 0.3 }}
                            key="box"
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
                                {payrollInformation(payroll)}
                                {signatoriesComponent(signatories)}
                            </div>
                            <div className="space-y-2">
                                <DataTable
                                    page={page}
                                    setPage={setPage}
                                    data={scholars}
                                    columns={columns}
                                    isFetching={isFetching}
                                    pagination={pagination}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ duration: 0.1 }}
                        >
                            <div>
                                <Button
                                    size={"sm"}
                                    onClick={() => setPayrollView(true)}
                                >
                                    <ChevronLeft /> Go back
                                </Button>
                            </div>
                            <ViewScholar />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ResponsiveDialog>
    );
}

const payrollInformation = (payroll: any) => {
    return (
        <>
            <Card className="px-6">
                <div className="space-y-3">
                    <Label className="font-bold mb-5 text-md">
                        Payroll Information
                    </Label>
                    <div className="flex justify-between">
                        <Label>City / Municipality: </Label>
                        <Label>{value(payroll?.municipality)}</Label>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <Label>Service Period: </Label>
                        <Label>
                            {value(payroll?.month_from)} -{" "}
                            {value(payroll?.month_to)}
                        </Label>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <Label>Grand Total: </Label>
                        <Label>{value(payroll?.grand_total)}</Label>
                    </div>
                </div>
            </Card>
        </>
    );
};

const signatoriesComponent = (signatories: any) => {
    return (
        <>
            <Card className="px-6">
                <div className="space-y-3">
                    <Label className="font-bold mb-5 text-md">
                        Signatories
                    </Label>
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
                        <Label className="opacity-70 font-thin">
                            {" "}
                            {value(signatories?.[0]?.description)}:
                        </Label>
                        <Label>{value(signatories?.[0]?.name)}</Label>
                    </div>
                    <Separator />
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
                        <Label className="opacity-70 font-thin">
                            {" "}
                            {value(signatories?.[1]?.description)}:
                        </Label>
                        <Label>{value(signatories?.[1]?.name)}</Label>
                    </div>
                    <Separator />
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
                        <Label className="opacity-70 font-thin">
                            {" "}
                            {value(signatories?.[2]?.description)}:
                        </Label>
                        <Label>{value(signatories?.[2]?.name)}</Label>
                    </div>
                    <Separator />
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
                        <Label className="opacity-70 font-thin">
                            {" "}
                            {value(signatories?.[3]?.description)}:
                        </Label>
                        <Label>{value(signatories?.[3]?.name)}</Label>
                    </div>
                </div>
            </Card>
        </>
    );
};

const value = (value: any) => {
    return value ? value : <Skeleton className="w-30 h-5" />;
};
