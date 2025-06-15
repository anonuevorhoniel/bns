import { UseScholarShow } from "@/Actions/ScholarAction";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LabelLoad from "@/Reusable/LabelLoad";

export default function EmploymentStatusTab() {
    const { scholarData } = UseScholarShow();
    return (
               <Card className="p-0  relative">
                 <Table className="w-full table-fixed">
                    <TableBody>
                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">Name on ID:</Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad value={scholarData?.name_on_id} />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">
                                    ID no:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData && scholarData.id_no
                                    }
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">Status:</Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={scholarData && scholarData.status}
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">
                                    First Employment Date:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData && scholarData.first_employment_date
                                    }
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">Years in Service:</Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={scholarData && scholarData.years_in_service}
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">
                                    Place of Assignment:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.place_of_assignment
                                    }
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">Fund</Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData && scholarData.fund
                                    }
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">
                                    Incentive Provincial:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.incentive_prov
                                    }
                                />
                            </TableCell>
                        </TableRow>

                         <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">
                                    Incentive Municipal:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.incentive_mun
                                    }
                                />
                            </TableCell>
                        </TableRow>

                         <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className="">
                                    Incentive Barangay:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.incentive_brgy
                                    }
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className=" mb-2">
                                    Beneficiary:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.benificiary_name
                                    }
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className=" mb-2">
                                    Relationship:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.relationship
                                    }
                                />
                            </TableCell>
                        </TableRow>

                         <TableRow>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <Label className=" mb-2">
                                    PhilHealth No:
                                </Label>
                            </TableCell>
                            <TableCell className=" border-b-1 p-3 break-words whitespace-normal">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.philhealth_no
                                    }
                                />
                            </TableCell>
                        </TableRow>

                         <TableRow>
                            <TableCell className="p-3">
                                <Label className=" mb-2">
                                    PhilHealth Classification:
                                </Label>
                            </TableCell>
                            <TableCell className="p-3">
                                <LabelLoad
                                    value={
                                        scholarData &&
                                        scholarData.classification
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
               </Card>
    );
}
