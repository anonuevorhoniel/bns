import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    UseServicePeriod,
    UseViewServicePeriod,
} from "./Actions/ServicePeriodAction";
import { Building2, CalendarRange, ChevronsUpDown, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ServicePeriodTable() {
    const { data, pages } = UseServicePeriod();
    const { setViewOpen } = UseViewServicePeriod();
    let totalScholars = pages?.total_scholars;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="opacity-50 flex justify-center items-center gap-2"> <User size={15}/> Name</TableHead>
                    <TableHead >
                        {" "}
                        <div className="flex gap-2 justify-center items-center opacity-50">
                          <Building2 size={15}/>  Municipality
                        </div>
                    </TableHead>
                    <TableHead className=" flex justify-center items-center gap-2 opacity-50 hidden sm:flex">
                        <CalendarRange size={15}/>
                        Recent Period</TableHead>
                    <TableHead className="text-center opacity-50">
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((s: any) => {
                    return (
                        <TableRow key={s.id}>
                            <TableCell className="text-center">
                              {s.full_name}
                            </TableCell>
                            <TableCell className="text-center">
                                {s.name}
                            </TableCell>
                            <TableCell className="text-center  hidden sm:table-cell">
                               <Badge> {s.recent_period}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    size={"icon"}
                                    variant={"primary"}
                                    onClick={() => setViewOpen(true)}
                                >
                                    <Eye />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
                {totalScholars == 0 ? (
                    <TableRow>
                        <TableCell className="text-center" colSpan={3}>
                            No Scholars with Service Periods
                        </TableCell>
                    </TableRow>
                ) : (
                    ""
                )}
            </TableBody>
        </Table>
    );
}
