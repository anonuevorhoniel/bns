"use client";

import ax from "@/app/axios";
import { Button } from "@/components/ui/button";
import { lorelei, notionists } from "@dicebear/collection";

import DataTable from "@/components/custom/datatable";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MapPin, Pen, Trash2, Unlock } from "lucide-react";
import { useState } from "react";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/custom/searchbar";
import { Badge } from "@/components/ui/badge";

export default function Page() {
    const [page, setPage] = useState<number>(1);
    const { data, isFetching, isSuccess, isError, error } = useQuery({
        queryKey: ["users", page],
        queryFn: async () => await ax.post("/users", { page: page }),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    if (isSuccess) {
        console.log(data);
    }

    if (isError) {
        console.log(error);
    }

    const columns = [
        {
            header: "Name",
            cell: (data: any) => {
                const avatar = createAvatar(notionists, {
                    seed: data.id,
                });
                const dataUri = avatar.toDataUri();

                return (
                    <>
                        <div className="flex gap-2 items-center">
                            <Avatar className="border">
                                <AvatarImage src={dataUri} />
                                <AvatarFallback>User</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>{data.name}</Label>
                                <div className="flex items-center">
                                    <MapPin size={14} />
                                    <Label className="font-normal text-xs">
                                        {data.municipality_name}
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </>
                );
            },
        },
        {
            accessKey: "email",
            header: "Email",
        },
        {
            header: "Classification",
            cell: (data: any) => {
                return <Badge>{data.classification} </Badge>;
            },
        },
        {
            accessKey: "mobile",
            header: "Contact Number",
        },
        {
            header: "Action",
            cell: (data: any) => {
                return (
                    <div className="flex gap-3">
                        <Button>
                            <Unlock />
                        </Button>
                        <Button>
                            <Pen />
                        </Button>
                    </div>
                );
            },
        },
    ];
    return (
        <>
            <title>BNS | Users</title>
            <SearchBar />
            <DataTable
                setPage={setPage}
                page={page}
                isFetching={isFetching}
                columns={columns}
                data={data?.data?.users}
            />
        </>
    );
}
