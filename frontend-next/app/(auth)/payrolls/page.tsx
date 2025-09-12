"use client";

import ax from "@/app/axios";
import ContentLayout from "@/app/ContentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DataTable from "@/components/custom/datatable";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/custom/searchbar";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { CalendarDays, Download, Plus, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ViewPayroll from "./view/ViewPayroll";
import { usePayrollView } from "@/app/global/payrolls/usePayrollView";
import { useDebounce } from "use-debounce";
import ButtonLoad from "@/components/custom/button-load";
import { toast } from "sonner";
import { useDownload } from "@/app/global/scholars/downloads/useDowload";

export default function Page() {
    const { setOpen, setId, setPayrollView } = usePayrollView();
    const { setId: setDownloadId, id: downloadID } = useDownload();
    const [search, setSearch] = useState("");
    const [searchDebounce] = useDebounce(search, 500);
    const searchValue = search == "" ? search : searchDebounce;
    const [page, setPage] = useState(1);

    const { data, isFetching } = useQuery({
        queryKey: ["payrolls", page, searchValue],
        queryFn: async () =>
            await ax.post("/payrolls", { page: page, search: searchValue }),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    const downloadPayroll = useMutation({
        mutationFn: async () =>
            await ax.get(`/payrolls/${downloadID}/download`, {
                responseType: "blob",
            }),
        onSuccess: (data: any) => {
            const url = URL.createObjectURL(data?.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Payroll.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Success", { description: "Downloading Payroll..." });
        },
        onError: (error: any) => {
            console.log(error);
        },
    });

    const downloadMasterlist = useMutation({
        mutationFn: async () =>
            await ax.get(`/payrolls/masterlists/${downloadID}/download`, {
                responseType: "blob",
            }),
        onSuccess: (data: any) => {
            const url = URL.createObjectURL(data?.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Masterlist.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Success", {
                description: "Downloading Masterlist...",
            });
        },
        onError: (error: any) => {
            console.log(error);
        },
    });

    const columns = [
        {
            header: "Fund",
            cell: (data: any) => {
                return <Badge>{data.fund}</Badge>;
            },
        },
        {
            header: "Created At",
            cell: (data: any) => (
                <div className="flex justify-start items-end">
                    <div className="flex gap-1 items-start">
                        <CalendarDays className="stroke-1 " />
                        <div className="text-left flex flex-col items-start">
                            <Label>{data.created_at}</Label>
                            <Label className="text-xs font-normal opacity-60 text-right">
                                {data?.diff_time}
                            </Label>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessKey: "name",
            header: "Muni / City",
        },
        {
            accessKey: "period_cover",
            header: "Period Covered",
        },
        {
            header: "Action",
            cell: (data: any) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            size={"sm"}
                            onClick={() => {
                                setOpen(true);
                                setId(data.id);
                                setPayrollView(true);
                            }}
                        >
                            <Search />
                        </Button>
                        <ButtonLoad
                            size={"sm"}
                            label={
                                <>
                                    <Download /> Payroll
                                </>
                            }
                            onClick={() => {
                                setDownloadId(data.id);
                                downloadPayroll.mutate();
                            }}
                            isPending={
                                downloadPayroll.isPending &&
                                downloadID == data.id
                            }
                        />
                        <ButtonLoad
                            size={"sm"}
                            label={
                                <>
                                    <Download /> Masterlist
                                </>
                            }
                            onClick={() => {
                                setDownloadId(data.id);
                                downloadMasterlist.mutate();
                            }}
                            isPending={
                                downloadMasterlist.isPending &&
                                downloadID == data.id
                            }
                        />
                    </div>
                );
            },
        },
    ];
    return (
        <>
            <title>BNS | Payrolls</title>
            <Link href={"/payrolls/create"}>
                <Button>
                    <Plus /> Add Payroll
                </Button>
            </Link>
            <Card className="px-6">
                <SearchBar onInput={(e: any) => setSearch(e.target.value)} />
                <DataTable
                    page={page}
                    setPage={setPage}
                    columns={columns}
                    data={data?.data?.payrolls}
                    isFetching={isFetching}
                    pagination={data?.data?.pagination}
                />
            </Card>
            <ViewPayroll />
        </>
    );
}
