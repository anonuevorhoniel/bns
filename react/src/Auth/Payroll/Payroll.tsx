import { UseLayout } from "@/Actions/LayoutAction";
import { UsePayroll } from "@/Actions/PayrollAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { CirclePlus, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import ViewPayroll from "./ViewPayroll";
import PayrollTable from "./PayrollTable";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
export default function Payroll() {
    const { setItem, setBItem } = UseLayout();
    const {
        payrolls,
        getPayroll,
        indexPage,
        setIndexPage,
        totalPage,
        totalPayroll,
        offset,
        cpc,
    } = UsePayroll();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setItem("Payrolls");
        setBItem("");
    }, []);

    useEffect(() => {
        getPayroll(setLoading);
    }, [indexPage]);

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
                            <Button
                                variant={"outline"}
                                className="border-yellow-600 text-yellow-600 hover:text-yellow-600"
                            >
                                <ScrollText />
                                Summary
                            </Button>
                        </div>
                        <div className="flex justify-end mt-3 sm:mt-0">
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
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {loading && <LoadingScreen />}
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
