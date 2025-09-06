"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useMediaQuery } from "@react-hook/media-query";
import { useEffect, useState } from "react";
import SkeletonTable from "./skeleton-table";
import ResponsivePagination from "./responsive-pagination";
import { FileX } from "lucide-react";

export default function DataTable({
    columns,
    data,
    isFetching,
    page,
    setPage,
    totalPage,
    pagination,
}: {
    columns: any;
    data: any;
    isFetching: boolean;
    page: number;
    setPage: any;
    totalPage: number;
    pagination: {
        offset: number;
        limit: number;
        total: number;
        total_page: number;
    };
}) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [mount, setMount] = useState(false);

    useEffect(() => setMount(true), []);

    if (mount) {
        if (isDesktop) {
            if (isFetching) {
                return (
                    <>
                        <SkeletonTable columnTotal={columns.length} />
                        <div className="flex justify-between items-center">
                            <div>
                                <Label className="font-thin ">
                                    Showing{" "}
                                    {pagination?.total == 0
                                        ? 0
                                        : pagination?.offset + 1}{" "}
                                    to {pagination?.offset + pagination?.limit}{" "}
                                    of {pagination?.total} data
                                </Label>
                            </div>
                            <div>
                                <ResponsivePagination
                                    isFetching={isFetching}
                                    totalPage={totalPage}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </div>
                    </>
                );
            }
            return (
                <>
                    <Card className="py-0 shadow-none">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns?.map((c: any, c_index: number) => (
                                        <TableHead
                                            key={c_index}
                                            className={`font-normal ${c.headerClass}`}
                                        >
                                            {c.header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map((d: any, d_index: number) => {
                                    return (
                                        <TableRow key={d_index}>
                                            {columns?.map(
                                                (c: any, c_index: number) => (
                                                    <TableCell
                                                        key={c_index}
                                                        className={`break-words h-13 ${c.cellClass}`}
                                                    >
                                                        <div className="text-wrap">
                                                            {c.cell
                                                                ? c.cell(d)
                                                                : d[
                                                                      c
                                                                          .accessKey
                                                                  ]}
                                                        </div>
                                                    </TableCell>
                                                )
                                            )}
                                        </TableRow>
                                    );
                                })}
                                {data?.length == 0 && (
                                    <TableRow>
                                        <TableCell
                                            className="text-center h-40"
                                            colSpan={columns.length}
                                        >
                                            <div className="flex justify-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="bg-primary text-primary-foreground p-3 rounded-full">
                                                        <FileX size={30} />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <Label className="font-bold">
                                                            No Data Found
                                                        </Label>
                                                        <Label className="text-xs">
                                                            There are no items
                                                            to display at the
                                                            moment
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                    <div className="flex justify-between items-center">
                        <div>
                            <Label className="font-thin ">
                                Showing{" "}
                                {pagination?.total == 0
                                    ? 0
                                    : pagination?.offset + 1}{" "}
                                to {pagination?.offset + pagination?.limit} of{" "}
                                {pagination?.total} data
                            </Label>
                        </div>
                        <div>
                            <ResponsivePagination
                                isFetching={isFetching}
                                totalPage={totalPage}
                                page={page}
                                setPage={setPage}
                            />
                        </div>
                    </div>
                </>
            );
        }

        return (
            <div className="space-y-4">
                {data?.map((d: any, index: any) => (
                    <Card key={index}>
                        {columns?.map((c: any, c_index: any) => (
                            <div
                                key={c_index}
                                className="flex justify-between items-center px-6"
                            >
                                <Label>{c.header}:</Label>
                                <Label className="font-normal">
                                    {c.cell ? c.cell(d) : d[c.accessKey]}
                                </Label>
                            </div>
                        ))}
                    </Card>
                ))}
                {(data?.length == 0 || data?.length == undefined) && (
                    <Card className="flex justify-center items-center">
                        No Data in Table
                    </Card>
                )}
            </div>
        );
    }
}
