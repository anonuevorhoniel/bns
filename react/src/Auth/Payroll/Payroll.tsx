import { UseLayout } from "@/Actions/LayoutAction";
import { UsePayroll } from "@/Actions/PayrollAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { CirclePlus, ScrollText, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import ViewPayroll from "./ViewPayroll";
import PayrollTable from "./PayrollTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
export default function Payroll() {
    const { setItem, setBItem } = UseLayout();
    const { payrolls, getPayroll, indexPage, setIndexPage, totalPage } =
        UsePayroll();
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
                    <div className="grid  grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 mb-3 mt-3 ">
                        <div className="flex gap-3 ">
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
                            {/* <Select>
                                <SelectTrigger className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                                    <SelectValue
                                        className="placeholder-black::placeholder"
                                        placeholder="-- Fund --"
                                    >
                                        asdasd
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NNC">NNC</SelectItem>
                                </SelectContent>
                            </Select> */}
                        </div>
                        <div className="">
                            <div className="flex justify-center items-center bg-white rounded-lg  max-w-70 float-right px-3 py-1 space-x-2 ">
                                <Search className="text-gray-500 w-5 h-5" />
                                <Input
                                    className="bg-transparent border-none hover:bg-gray-100"
                                    placeholder="Search"
                                />
                            </div>
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
                            <Label>Showing 1 to 1 of 1 Payrolls</Label>
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
