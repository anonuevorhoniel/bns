"use client";

import ax from "@/app/axios";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/custom/datatable";
import StatusBar from "@/components/ui/status";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Pen, Plus } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/custom/searchbar";
import CreateSignatory from "./(create)/CreateSignatory";
import { useCreateSignatory } from "@/app/global/signatories/useCreateSignatories";
import EditSignatory from "./(edit)/EditSignatory";
import { useEditSignatory } from "@/app/global/signatories/useEditSignatory";

export default function Page() {
    const [page, setPage] = useState<number>(1);
    const { setOpen } = useCreateSignatory();
    const { setOpen: setEditOpen, setSignatory } = useEditSignatory();
    const [search, setSearch] = useState("");
    const { data, isFetching, isError, error, isSuccess } = useQuery({
        queryKey: ["signatories", page],
        queryFn: async () => await ax.post("/signatories", { page: page }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    if (isSuccess) {
        console.log(data);
    }
    if (isError) {
        console.log(isError);
    }

    const columns = [
        {
            accessKey: "name",
            header: "Name",
        },
        {
            accessKey: "designation",
            header: "Designation",
        },
        {
            accessKey: "description",
            header: "Description",
        },
        {
            header: "Status",
            cell: (data: any) => {
                return <StatusBar status={data?.status} />;
            },
        },
        {
            header: "Action",
            cell: (item: any) => {
                return (
                    <div className="flex">
                        <Button
                            size={"sm"}
                            onClick={() => {
                                setEditOpen(true);
                                setSignatory(item);
                            }}
                        >
                            <Pen />
                        </Button>
                    </div>
                );
            },
        },
    ];
    return (
        <>
            <title>BNS | Signatories</title>
            <div>
                <Button onClick={() => setOpen(true)}>
                    <Plus /> Add Signatories
                </Button>
            </div>
            <Card className="px-6">
                <SearchBar onInput={(e: any) => setSearch(e.target.value)} />
                <DataTable
                    page={page}
                    setPage={setPage}
                    isFetching={isFetching}
                    data={data?.data?.signatories}
                    columns={columns}
                    pagination={data?.data?.pagination}
                />
            </Card>
            <CreateSignatory />
            <EditSignatory />
        </>
    );
}
