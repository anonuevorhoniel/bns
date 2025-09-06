import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LockKeyholeOpen, Trash2 } from "lucide-react";

export default function UserTable({userData}: any) {
  return   <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Classification</TableHead>
                <TableHead className="text-center">Contact No.</TableHead>
                <TableHead className="text-center">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {userData?.map((u: any) => {
                return (
                    <TableRow key={u.id}>
                        <TableCell className="text-center">{u.name}</TableCell>
                        <TableCell className="text-center">{u.email}</TableCell>
                        <TableCell className="text-center">
                            {u.classification}
                        </TableCell>
                        <TableCell className="text-center">
                            {u.mobile}
                        </TableCell>
                        <TableCell className="text-center">
                            <Button variant={"info"}>
                                <LockKeyholeOpen />
                            </Button>
                            <Button variant={"destructive"} className="ml-1">
                                {" "}
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                );
            })}
            {userData?.length == 0 || userData?.length == undefined ? (
                <TableRow>
                    <TableCell className="text-center" colSpan={5}>
                        No Users
                    </TableCell>
                </TableRow>
            ) : (
                ""
            )}
        </TableBody>
    </Table>;
}
