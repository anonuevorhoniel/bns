import { UseLayout } from "@/Actions/LayoutAction";
import { UsePayroll } from "@/Actions/PayrollAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { CirclePlus, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import ViewPayroll from "./ViewPayroll";
import PayrollTable from "./PayrollTable";
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
                <CardHeader className="bg-muted">
                    <div className="flex justify-between gap-3 mb-3 mt-3 ">
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
                        <div>
                            <Input placeholder="Search" className="bg-white" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border-1 relative">
                        {loading && <LoadingScreen />}
                        <PayrollTable payrolls={payrolls} />
                    </div>
                    <AutoPagination
                        page={indexPage}
                        setPage={setIndexPage}
                        totalPage={totalPage}
                    />
                </CardContent>
            </Card>
        </>
    );
}
