"use client";

import ax from "@/app/axios";
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
import ViewPayroll from "./(view)/ViewPayroll";
import { usePayrollView } from "@/app/global/payrolls/usePayrollView";
import { useDebounce } from "use-debounce";
import ButtonLoad from "@/components/custom/button-load";
import { toast } from "sonner";
import { useDownload } from "@/app/global/scholars/downloads/useDowload";
import useDownloadLink from "@/hooks/useDownloadLink";
import payrollColumn from "./(columns)/payrollColumn";

export default function Page() {
    const { id: downloadID } = useDownload();
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
            useDownloadLink({ data: data?.data, name: "Payroll" });
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
            useDownloadLink({ data: data?.data, name: "Masterlist" });
            toast.success("Success", {
                description: "Downloading Masterlist...",
            });
        },
        onError: (error: any) => {
            console.log(error);
        },
    });

    const columns = payrollColumn({
        downloadMasterlist: downloadMasterlist,
        downloadPayroll: downloadPayroll,
    });

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
