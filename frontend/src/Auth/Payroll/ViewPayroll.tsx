import { Label } from "@/components/ui/label";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DialogDrawer from "@/Reusable/DialogDrawer";
import ViewPayrollTable from "./CreatePayroll/ViewPayrollTable";
import { Card } from "@/components/ui/card";
import UseViewPayroll from "./UseViewPayroll";
import { useEffect } from "react";

export default function ViewPayroll() {
    const {
        payroll,
        setSearch,
        search,
        isFetching,
        page,
        setPage,
        totalPage,
        viewPayroll,
        setViewPayroll,
        viewPayrollScholar,
    } = UseViewPayroll();

    useEffect(() => console.log(viewPayrollScholar), [viewPayrollScholar]);

    const content = (
        <div className="overflow-auto space-y-5 h-full">
            <Card className="p-2">
                <div>
                    <Label className="flex justify-center font-bold text-xl text-center">
                        Barangay Nutrition Scholar Directory ({payroll?.fund})
                    </Label>
                    <Label className="flex justify-center text-lg">
                        {payroll?.municipality} (2025)
                    </Label>
                    <div className="flex flex-col items-center  ">
                        <Label className="text-md font-bold opacity-60">
                            {payroll?.month_from} - {payroll?.month_to}{" "}
                            {payroll?.year}
                        </Label>
                        <Label className="text-xl">
                            ₱ {payroll?.grand_total}
                        </Label>
                    </div>
                </div>
            </Card>

            <Card className="p-3 rounded-md">
                <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4">
                    {payroll?.signatories.map((s: any) => {
                        return (
                            <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2 text-wrap break-all px-3 text-center">
                                <Label className="underline font-bold ">
                                    {s.name}
                                </Label>{" "}
                                <Label className="mt-2 text-xs opacity-60   ">
                                    {s.description}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </Card>
            <div className="flex justify-end flex-col mt-3 mb-3">
                <div>
                    <div className="flex relative hover:-translate-y-1.5 transition-all">
                        <Search className="opacity-60 w-4 h-4 absolute left-2 top-2 z-10" />
                        <Input
                            className="pl-8"
                            placeholder="Search"
                            onInput={(e: any) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </div>
            </div>
            <Card className="relative p-0 rounded-md">
                {isFetching && <LoadingScreen />}
                <ViewPayrollTable viewPayrollScholar={viewPayrollScholar} />
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2  mt-3 pl-3 pr-3 ">
                <div>
                    <Label>
                        Showing{" "}
                        {viewPayrollScholar?.length == 0
                            ? 0
                            : payroll?.offset + 1}{" "}
                        to {payroll?.offset + payroll?.current} of{" "}
                        {payroll?.total_scholar} Payroll Members
                    </Label>
                </div>

                <div
                    className={`${
                        isFetching && "pointer-events-none"
                    } flex justify-end`}
                >
                    <div>
                        <AutoPagination
                            page={page}
                            totalPage={totalPage}
                            setPage={setPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <DialogDrawer
            size="sm:max-w-[1000px] sm:min-h-[90vh] "
            content={content}
            open={viewPayroll}
            setOpen={setViewPayroll}
        />
    );
}
