import { UseScholarShow } from "@/Actions/ScholarAction";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LabelLoad from "@/Reusable/LabelLoad";

export default function EligibilityTab() {
    const { eligibilities } = UseScholarShow();
    return (
        <>
            {eligibilities && eligibilities.length > 0 ? (
                Object.values(eligibilities).map((el: any) => {
                    return (
                        <div key={el.id}>
                        <Separator className="mb-3" />
                            <Card className="p-0 relative mb-4">
                                <Table className="table-fixed">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="p-3 break-words whiteelace-normal border-r-1">
                                                <Label className="font-bold">
                                                    Name:
                                                </Label>
                                            </TableCell>
                                            <TableCell className="p-3 break-words whiteelace-normal">
                                                <LabelLoad value={el.name} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    );
                })
            ) : (
                <Badge>No Eligibilities Yet</Badge>
            )}
        </>
    );
}
