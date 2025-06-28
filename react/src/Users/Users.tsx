import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AutoPagination from "@/Reusable/AutoPagination";
import { CirclePlus, LockKeyholeOpen, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Users() {
    const [page, setPage] = useState(1);
    return (
        <>
            <Card className="p-0">
                <CardHeader className="bg-muted p-3 rounded-tl-lg rounded-tr-lg">
                    <div>
                        <Button variant={"primary"}>
                            <CirclePlus /> Users
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">
                                    Name
                                </TableHead>
                                <TableHead className="text-center">
                                    Email
                                </TableHead>
                                <TableHead className="text-center">
                                    Classification
                                </TableHead>
                                <TableHead className="text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-center">
                                    Rhoniel Anonuevo
                                </TableCell>
                                <TableCell className="text-center">
                                    rhon2692@gmail.com
                                </TableCell>
                                <TableCell className="text-center">
                                    Admin
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant={"info"}><LockKeyholeOpen /></Button>
                                    <Button variant={"destructive"} className="ml-1"> <Trash2 /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <AutoPagination page={page} setPage={setPage} totalPage={1} />
                </CardContent>
            </Card>
        </>
    );
}
