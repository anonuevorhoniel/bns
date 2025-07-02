import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CirclePlus, Search } from "lucide-react";
import ServicePeriodTable from "./ServicePeriodTable";
import AutoPagination from "@/Reusable/AutoPagination";
import { deleteServicePeriod, UseServicePeriod } from "./Actions/ServicePeriodAction";
import { Label } from "@/components/ui/label";
import LoadingScreen from "@/LoadingScreen";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import ViewServicePeriod from "./View/ViewServicePeriod";

export default function ServicePeriods() {
    const { pages, page, setPage, loading, getData } = UseServicePeriod();
    const {refresh} = deleteServicePeriod();
    let totalPage = pages?.total_page;
    let offset = pages?.offset;
    let totalScholars = pages?.total_scholars;
    let csc = pages?.current_scholar_count;
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        if (search == "") {
            getData(search);
        } else {
            const timeout = setTimeout(() => {
                getData(search);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [page, search, refresh]);


    return (
        <>
            <title>BNS | Service Periods</title>
            <ViewServicePeriod />
            <Card className="p-0 pb-4">
                <CardHeader className="pt-2 bg-muted rounded-tl-lg rounded-tr-lg">
                    <div>
                        <Button variant={"primary"}>
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
                        {loading && <LoadingScreen />}
                        <ServicePeriodTable />
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
                                    loading && "pointer-events-none"
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
