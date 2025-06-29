import { UseScholarShow } from "@/Actions/ScholarAction";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LabelLoad from "@/Reusable/LabelLoad";

export default function TrainingTab() {
    const { trainings } = UseScholarShow();
    return (
        <>
            {trainings && trainings.length > 0 ? (
                Object.values(trainings).map((el: any) => {
                    return (
                        <div key={el.id}>
                        {/* <Separator className="mb-3"/> */}
                            <Card className="p-0 relative mb-4 border-1" key={el.id}>
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
                                         <TableRow>
                                            <TableCell className="p-3 break-words whiteelace-normal border-r-1">
                                                <Label className="font-bold">
                                                    Date:
                                                </Label>
                                            </TableCell>
                                            <TableCell className="p-3 break-words whiteelace-normal">
                                                <LabelLoad value={el.date} />
                                            </TableCell>
                                        </TableRow>
                                         <TableRow>
                                            <TableCell className="p-3 break-words whiteelace-normal border-r-1">
                                                <Label className="font-bold">
                                                    Trainor:
                                                </Label>
                                            </TableCell>
                                            <TableCell className="p-3 break-words whiteelace-normal">
                                                <LabelLoad value={el.trainor} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    );
                })
            ) : (
                <Badge>No trainings Yet</Badge>
            )}
        </>
    );
}
