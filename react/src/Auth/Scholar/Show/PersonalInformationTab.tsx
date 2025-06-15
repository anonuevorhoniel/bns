import { UseScholarShow } from "@/Actions/ScholarAction";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LabelLoad from "@/Reusable/LabelLoad";

export default function PersonalInformationTab() {
    const { scholarData } = UseScholarShow();
    return (
        <Card className="p-0 relative">
            <Table className="table-fixed">
                <TableBody>
                    <TableRow>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <Label className="">First Name:</Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad value={scholarData?.first_name} />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <Label className="">Middle Name:</Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad
                                value={scholarData && scholarData.middle_name}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <Label className="">Last Name:</Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad
                                value={scholarData && scholarData.last_name}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <Label className="">Civil Status:</Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad
                                value={scholarData && scholarData.civil_status}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <Label className="">Sex:</Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad value={scholarData && scholarData.sex} />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <Label className="">Contact Number:</Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad
                                value={
                                    scholarData && scholarData.contact_number
                                }
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <Label className="">Address:</Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad
                                value={scholarData && scholarData.full_address}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className=" border-b-1 p-3">
                            <Label className="">
                                Educational Attainment:
                            </Label>
                        </TableCell>
                        <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                            <LabelLoad
                                value={
                                    scholarData &&
                                    scholarData.educational_attainment
                                }
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="p-3">
                            <Label className=" mb-2">
                                Complete Address:
                            </Label>
                        </TableCell>
                        <TableCell className=" p-3">
                            <LabelLoad
                                value={
                                    scholarData && scholarData.complete_address
                                }
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    );
}
