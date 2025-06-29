import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronsUpDown } from "lucide-react";

export default function AddInfoTable() {
    return (
        <Table className="border-t-1">
            <TableHeader className="">
                <TableRow className="">
                    <TableHead className="hover:bg-gray-200">
                        <Label className="text-black/75 flex items-center justify-center">
                            Full Name <ChevronsUpDown size={15} />
                        </Label>
                    </TableHead>
                    {/* <TableHead className="hover:bg-gray-200">
                    <Label className="text-black/75 flex items-center justify-center">
                        Barangay <ChevronsUpDown size={15} />
                    </Label>
                </TableHead> */}
                    <TableHead className="hover:bg-gray-200">
                        <Label className="text-black/75 flex items-center justify-center">
                            Fund <ChevronsUpDown size={15} />
                        </Label>
                    </TableHead>
                    <TableHead>
                        <Label className="text-black/75 flex items-center justify-center">
                            Action{" "}
                        </Label>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody></TableBody>
        </Table>
    );
}
