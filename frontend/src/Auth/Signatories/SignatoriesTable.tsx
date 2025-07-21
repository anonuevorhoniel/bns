import { UseSignatoryIndex } from "@/Actions/SignatoriesAction";
import { Badge } from "@/components/ui/badge";
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
import { MapPinHouse, Pencil, ShieldCheck, Text, User } from "lucide-react";
import { useEffect } from "react";

export default function SignatoriesTable() {
    const { signatoryIndex, setSignatoryIndex, indexPage, setOpenEdit, getEditSignatory, refresh, pageInfo } =
        UseSignatoryIndex();

    useEffect(() => {
        setSignatoryIndex();
    }, [indexPage, refresh]);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="opacity-70">
                        <TableHead>
                            <div className="flex justify-center">
                                <Label>
                                    <User size={15} /> Name
                                </Label>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex justify-center gap-1">
                                <Label>
                                    <MapPinHouse size={15} /> Designation
                                </Label>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex justify-center gap-1">
                                <Label>
                                    <Text size={15} /> Description
                                </Label>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex justify-center gap-1">
                                <Label>
                                    <ShieldCheck size={15} /> Status
                                </Label>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex justify-center gap-1">
                                <Label>Action</Label>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {signatoryIndex?.map((s: any) => {
                        return (
                            <TableRow className="text-center" key={s.id}>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.designation}</TableCell>
                                <TableCell>{s.description}</TableCell>
                                <TableCell>
                                    {s.status == 1 ? (
                                        <Badge variant={"success"}>
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant={"destructive"}>
                                            Inactive
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant={"primary"}
                                        onClick={() => {setOpenEdit(true); getEditSignatory(s.id)}}
                                    >
                                        <Pencil />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {pageInfo?.total_data == 0  || pageInfo?.total_data == undefined  && <TableRow><TableCell colSpan={5} className="text-center">No Signatories Yet</TableCell></TableRow>}
                </TableBody>
            </Table>
        </>
    );
}
