"use client";

import { GraduationCap, ShieldCheck, ShieldX, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ax from "@/app/axios";
import DataTable from "@/components/ui/datatable";
import { useState } from "react";

export default function Page() {
    const [page, setPage] = useState(1);
    const { data, isSuccess, isError, error, isFetching } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => ax.post("/dashboard", { page: page }),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    const scholarsPerMunicipality = data?.data?.scholarsPerMunicipality;

    const chartData = scholarsPerMunicipality?.map((data: any) => ({
        month: data.month,
        total: data.total,
    }));

    const columns = [
        {
            accessKey: "month",
            header: "Month",
        },
        {
            accessKey: "total",
            header: "Total",
        },
    ];

    const chartConfig = {
        total: {
            label: "Scholars",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig;

    if (isSuccess) {
        console.log(data?.data);
    }
    if (isError) {
        console.log(error);
    }
    return (
        <>
            <title>BNS | Dashboard</title>
            <Label className="text-2xl font-bold">Dashboard</Label>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="px-6 py-4  ">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Active Scholars</Label>
                            <ShieldCheck size={25} />
                        </div>
                        <div>
                            <Label className="text-xl font-bold">1200</Label>
                            <Label className="text-xs opacity-60 font-normal">
                                Showing the total active scholars
                            </Label>
                        </div>
                    </div>
                </Card>

                <Card className="px-6 py-4  ">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Inactive Scholars</Label>
                            <ShieldX size={25} />
                        </div>
                        <div>
                            <Label className="text-xl font-bold">1200</Label>
                            <Label className="text-xs opacity-60 font-normal">
                                Showing overall inactive scholars
                            </Label>
                        </div>
                    </div>
                </Card>

                 <Card className="px-6 py-4  ">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Total Scholars</Label>
                            <GraduationCap size={25} />
                        </div>
                        <div>
                            <Label className="text-xl font-bold">
                                {data?.data?.scholars_count}
                            </Label>
                            <Label className="text-xs opacity-60 font-normal">
                                Showing overall total scholars
                            </Label>
                        </div>
                    </div>
                </Card>
            </div>
            <div>
                <Card className="px-6">
                    <div>
                        <Label className="text-lg">Scholars Breakdown</Label>
                        <Label className="text-xs opacity-65">
                            Breakdown of Scholars per Municipality / City
                        </Label>
                    </div>
                    <ChartContainer config={chartConfig} className="h-40">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent indicator="line" />
                                }
                            />
                            <Area
                                dataKey="total"
                                type="natural"
                                fill="var(--color-total)"
                                fillOpacity={0.4}
                                stroke="var(--color-total)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </Card>
            </div>

            <Card className="px-6">
                <div>
                    <Label className="text-lg">Scholars Breakdown</Label>
                    <Label className="text-xs opacity-60">
                        List Breakdown of Scholars
                    </Label>
                </div>
                <DataTable
                    page={page}
                    setPage={setPage}
                    data={data?.data?.scholar_per_mun}
                    columns={columns}
                    totalPage={1}
                    isFetching={isFetching}
                />
            </Card>
        </>
    );
}
