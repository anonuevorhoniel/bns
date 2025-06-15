import { UseScholarShow } from "@/Actions/ScholarAction";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LabelLoad from "@/Reusable/LabelLoad";

export default function ServicePeriodTab() {
    const { servicePeriods } = UseScholarShow();
    return (
        <>
            {servicePeriods && servicePeriods.length > 0 ? (
                Object.values(servicePeriods).map((sp: any) => {
                    return (
                        <div key={sp.id}>
                            <Separator className="mb-3" />
                            <Card className="p-0 relative mb-4">
                                <Table className="table-fixed">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                                <Label className="font-bold">
                                                    From:
                                                </Label>
                                            </TableCell>
                                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                                <LabelLoad
                                                    value={sp.month_from}
                                                /> -
                                                <LabelLoad
                                                    value={sp.year_from}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="p-3 break-words whitespace-normal">
                                                <Label className="font-bold">
                                                    To:
                                                </Label>
                                            </TableCell>
                                            <TableCell className="p-3 break-words whitespace-normal">
                                                <LabelLoad
                                                    value={
                                                        sp.month_to > 0
                                                            ? sp.month_to
                                                            : "Present"
                                                    }
                                                />
                                                 <LabelLoad
                                                    value={
                                                        sp.month_to > 0 && "-"
                                                    }
                                                />
                                                 <LabelLoad
                                                    value={
                                                        sp.month_to > 0
                                                            ? sp.year_to
                                                            : ""
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    );
                })
            ) : (
                <Badge>No Service Periods Yet</Badge>
            )}
        </>
    );
}
