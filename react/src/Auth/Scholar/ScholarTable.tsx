import {  UseGetScholar, UseScholarShow } from "@/Actions/ScholarAction";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronsUpDown, Edit, Search, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { ViewScholar } from "./ScholarState";
import { Label } from "@/components/ui/label";

export default function ScholarTable() {
    const { scholars } = UseGetScholar();
    const { setShow } = ViewScholar();
    const {getScholarShowData} = UseScholarShow();
    return (
        <>
            <Table>
                <TableHeader className="">
                    <TableRow className="">
                        <TableHead  className="hover:bg-gray-200">
                            <Label className="text-black/75 flex items-center justify-center">Full Name <ChevronsUpDown size={15} /></Label>
                        </TableHead>
                      <TableHead className="hover:bg-gray-200">
                            <Label className="text-black/75 flex items-center justify-center">Barangay <ChevronsUpDown size={15} /></Label>
                        </TableHead>
                           <TableHead className="hover:bg-gray-200">
                            <Label className="text-black/75 flex items-center justify-center">Fund <ChevronsUpDown size={15} /></Label>
                        </TableHead>
                        <TableHead >
                            <Label className="text-black/75 flex items-center justify-center">Action </Label>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scholars?.length > 0 ? (
                        Object.values(scholars).map((s: any) => {
                            return (
                                <TableRow key={s.id}>
                                    <TableCell className="text-center">
                                        {s.full_name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {s.barangay_name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {s.fund}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant={"info"}
                                            size={"icon"}
                                            className="mr-2"
                                            onClick={() => {
                                                setShow(true);
                                                getScholarShowData(s.id);
                                            }}
                                        >
                                            <Search />
                                        </Button>
                                        <Link to={`/scholars/${s.id}/edit`}>
                                            <Button
                                                variant={"warning"}
                                                size={"icon"}
                                                className="mr-2"
                                            >
                                                <Edit />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant={"destructive"}
                                            size={"icon"}
                                        >
                                            <Trash />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell className="text-center h-20" colSpan={4}>
                                No Scholars
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
