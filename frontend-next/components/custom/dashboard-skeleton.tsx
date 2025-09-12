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
import DataTable from "@/components/custom/datatable";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import SkeletonTable from "./skeleton-table";

export default function DashboardSkeleton() {
    return (
        <>
            <title>BNS | Dashboard</title>
            <Label className="text-2xl font-bold">Dashboard</Label>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="px-6 py-4  ">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-50" />
                            <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-13 " />
                            <Skeleton className="h-3 w-50 " />
                        </div>
                    </div>
                </Card>

                <Card className="px-6 py-4  ">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-50" />
                            <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-13 " />
                            <Skeleton className="h-3 w-50 " />
                        </div>
                    </div>
                </Card>

                <Card className="px-6 py-4  ">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-50" />
                            <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-13 " />
                            <Skeleton className="h-3 w-50 " />
                        </div>
                    </div>
                </Card>
            </div>
            <div>
                <Card className="px-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-45" />
                        <Skeleton className="h-3 w-50 " />
                    </div>
                    <Skeleton className="h-40" />
                </Card>
            </div>

            <Card className="px-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-45" />
                    <Skeleton className="h-3 w-50 " />
                </div>
                <SkeletonTable columnTotal={2}/>
            </Card>
        </>
    );
}
