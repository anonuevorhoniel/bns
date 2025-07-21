import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import ViewPayroll from "./ViewPayroll";
import PayrollTable from "./PayrollTable";

import { Label } from "@/components/ui/label";
import UsePayroll from "./UsePayroll";
import { UsePayrollAction } from "@/Actions/PayrollAction";
export default function Payroll() {

    const { payrolls, totalPage, totalPayroll, offset, cpc, isFetching } =
        UsePayroll();
    const {indexPage, setIndexPage} = UsePayrollAction();

    return (
        <>
            <Toaster />
            <ViewPayroll />
            <title>BNS | Payroll</title>
            <Card className="p-0 pb-5">
                <CardHeader className="bg-muted rounded-tl-lg rounded-tr-lg">
                    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 mb-3 mt-3 ">
                        <div className="flex gap-3">
                            <Link to={"/payrolls/create"}>
                                <Button variant={"primary"}>
                                    <CirclePlus /> Payroll
                                </Button>
                            </Link>
                            {/* <Button
                                variant={"outline"}
                                className="border-yellow-600 text-yellow-600 hover:text-yellow-600"
                            >
                                <ScrollText />
                                Summary
                            </Button> */}
                        </div>
                        {/* <div className="flex justify-end mt-3 sm:mt-0">
                            <Select>
                                <SelectTrigger className="w-[180px] bg-white hover:-translate-y-1 transition-all">
                                    <SelectValue placeholder="-- Select Fund --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="NNC">NNC</SelectItem>
                                        <SelectItem value="LOCAL">
                                            LOCAL
                                        </SelectItem>
                                        <SelectItem value="BOTH">
                                            BOTH
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div> */}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {isFetching && <LoadingScreen />}
                        <PayrollTable payrolls={payrolls} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 mt-3">
                        <div className="flex items-center">
                            <Label>
                                Showing {cpc == 0 ? 0 : offset + 1} to{" "}
                                {offset + cpc} of {totalPayroll} Payrolls
                            </Label>
                        </div>
                        <div className="flex justify-end">
                            <div>
                                <AutoPagination
                                    page={indexPage}
                                    setPage={setIndexPage}
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
