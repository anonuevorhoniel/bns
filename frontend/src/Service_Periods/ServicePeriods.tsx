import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CirclePlus, Search } from "lucide-react";
import ServicePeriodTable from "./ServicePeriodTable";
import AutoPagination from "@/Reusable/AutoPagination";
import { Label } from "@/components/ui/label";
import LoadingScreen from "@/LoadingScreen";
import { Input } from "@/components/ui/input";
import ViewServicePeriod from "./View/ViewServicePeriod";
import { CreateServicePeriod } from "./CreateServicePeriod";
import { Toaster } from "sonner";
import UseServicePeriods from "./UseServicePeriod";

export default function ServicePeriods() {
    const {
        setspCreateOpen,
        setSearch,
        isFetching,
        totalPage,
        totalScholars,
        offset,
        csc,
        page,
        setPage,
        scholars,
    } = UseServicePeriods();

    return (
        <>
            <title>BNS | Service Periods</title>
            <Toaster />
            <ViewServicePeriod />
            <CreateServicePeriod />
            <Card className="p-0 pb-4">
                <CardHeader className="pt-2 bg-muted rounded-tl-lg rounded-tr-lg">
                    <div>
                        <Button
                            variant={"primary"}
                            onClick={() => setspCreateOpen(true)}
                        >
                            <CirclePlus /> Service Periods
                        </Button>
                        <div className="flex justify-center items-center bg-white rounded-lg  max-w-70 float-right px-3 py-1 space-x-2 ">
                            <Search className="text-gray-500 w-5 h-5" />
                            <Input
                                className="bg-transparent border-none hover:bg-gray-100"
                                placeholder="Search"
                                onInput={(e: any) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {isFetching && <LoadingScreen />}
                        <ServicePeriodTable scholars={scholars} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 mt-2">
                        <div className="flex items-center">
                            <Label>
                                Showing {totalScholars == 0 ? "0" : offset + 1}{" "}
                                to {offset + csc} of {totalScholars} Scholars
                                with Service Periods
                            </Label>
                        </div>
                        <div className="flex justify-end">
                            <div
                                className={`${
                                    isFetching && "pointer-events-none"
                                }`}
                            >
                                <AutoPagination
                                    page={page}
                                    setPage={setPage}
                                    totalPage={totalPage}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
