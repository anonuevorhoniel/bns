"use client";

import ax from "@/app/axios";
import ContentLayout from "@/app/ContentLayout";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/datatable";
import StatusBar from "@/components/ui/status";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Pen } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [page, setPage] = useState<number>(1);
    const { data, isFetching, isError, error, isSuccess } = useQuery({
        queryKey: ["signatories"],
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
                return <StatusBar status={data?.status}/>
            }
        },
        {
            header: "Action",
            cell: (data: any) => {
                // return <>a</>
                return <div className="flex">
                    <Button size={"sm"}><Pen /></Button>
                </div>
            }
        }
        
    ];
    return (
        <ContentLayout title="Signatories" buttonEvent={() => console.log("a")}>
            <title>BNS | Signatories</title>
            <DataTable
                page={page}
                setPage={setPage}
                totalPage={1}
                isFetching={isFetching}
                data={data?.data?.signatories}
                columns={columns}
            />
        </ContentLayout>
    );
}
