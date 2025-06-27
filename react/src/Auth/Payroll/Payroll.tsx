import { UseLayout } from "@/Actions/LayoutAction";
import { UsePayroll } from "@/Actions/PayrollAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { ChartArea, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Payroll() {
    const { setItem, setBItem } = UseLayout();
    const { payrolls, getPayroll, indexPage } = UsePayroll();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setItem("Payrolls");
        setBItem("");
    }, []);

    useEffect(() => {
        getPayroll(setLoading);
        console.log(payrolls);
    }, [indexPage]);

    useEffect(() => {
        console.log(payrolls?.length);
    }, [payrolls]);

    return (
        <>
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
                                <ChartArea />
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="rounded-tl-lg text-center text-black/50">
                                        Fund
                                    </TableHead>
                                    <TableHead className="text-center  text-black/50">
                                        Date Created
                                    </TableHead>
                                    <TableHead className="text-center  text-black/50">
                                        Municipality
                                    </TableHead>
                                    <TableHead className="text-center  text-black/50 rounded-tr-lg">
                                        Period Covered
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payrolls &&
                                    payrolls.map((p: any) => {
                                        return (
                                            <TableRow>
                                                <TableCell className="text-center">
                                                    {p.fund}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {p.created_at}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {p.name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {p.period_cover}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {payrolls?.length > 0 ? (
                                    ""
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No Payrolls
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <AutoPagination page={1} setPage={""} totalPage={1} />
                </CardContent>
            </Card>
        </>
    );
}
