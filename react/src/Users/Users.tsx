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
import { useEffect, useState } from "react";
import { UseUser } from "./Actions/UserAction";

export default function Users() {
    const [page, setPage] = useState(1);
    const { userData, getUserData } = UseUser();

    useEffect(() => {
        getUserData(page);
    }, [page]);

    return (
        <>
            <title>BNS | Users</title>
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
                                    Contact No.
                                </TableHead>
                                <TableHead className="text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userData?.map((u: any) => {
                              return  <TableRow>
                                    <TableCell className="text-center">
                                        {u.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {u.email}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {u.classification}
                                    </TableCell>
                                     <TableCell className="text-center">
                                        {u.mobile   }
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant={"info"}>
                                            <LockKeyholeOpen />
                                        </Button>
                                        <Button
                                            variant={"destructive"}
                                            className="ml-1"
                                        >
                                            {" "}
                                            <Trash2 />
                                        </Button>
                                    </TableCell>
                                </TableRow>;
                            })}
                            {userData?.length == 0 || userData?.length == undefined ? <TableRow><TableCell className="text-center" colSpan={5}>No Users</TableCell></TableRow> : ""}
                        </TableBody>
                    </Table>
                    <AutoPagination
                        page={page}
                        setPage={setPage}
                        totalPage={1}
                    />
                </CardContent>
            </Card>
        </>
    );
}
