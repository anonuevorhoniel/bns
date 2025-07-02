import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AutoPagination from "@/Reusable/AutoPagination";
import {
    deleteServicePeriod,
    UseViewServicePeriod,
} from "@/Actions/ServicePeriodAction";
import { CalendarArrowUp, X } from "lucide-react";
import { useState } from "react";
import AlertReusable from "@/Reusable/AlertReusable";

export default function ServicePeriodViewTab() {
    const { dataView, setViewOpen,  viewPageInfo } = UseViewServicePeriod();
    const [page, setPage] = useState(1);
    const {
        setAlertDelete,
        alertDelete,
        setSPID,
        setDeleteSP,
        deleteBtnDisable,
    } = deleteServicePeriod();
    return (
        <>
            <AlertReusable
                open={alertDelete}
                setOpen={setAlertDelete}
                loading={deleteBtnDisable}
                message={"Do you want to delete this Service Period?"}
                onClick={() => setDeleteSP(setViewOpen)}
            />
            <Table className="mt-4">
                <TableHeader>
                    <TableRow className="bg-muted">
                        <TableHead>
                            <div className="flex items-center gap-2 opacity-70">
                                <CalendarArrowUp size={15} /> From
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex items-center gap-2 opacity-70">
                                <CalendarArrowUp size={15} /> To
                            </div>
                        </TableHead>
                        <TableHead className="opacity-70">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataView?.map((s: any) => {
                        return (
                            <TableRow key={s.id}>
                                <TableCell>
                                    {s.month_from} - {s.year_from}
                                </TableCell>
                                <TableCell>
                                    {s.status == "present" ? (
                                        "Present"
                                    ) : (
                                        <>
                                            {s.month_to} - {s.year_to}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant={"destructive"}
                                        className="h-6 w-5"
                                        onClick={() => {
                                            setAlertDelete(true);
                                            setSPID(s.id);
                                        }}
                                    >
                                        <X />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-center">
                    <Label>Showing {viewPageInfo?.offset + 1} to {viewPageInfo?.offset + viewPageInfo?.limit} of {viewPageInfo?.total} Service Periods</Label>
                </div>
                <div className="flex justify-end">
                    <div>
                        <AutoPagination
                            page={page}
                            setPage={setPage}
                            totalPage={1}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
