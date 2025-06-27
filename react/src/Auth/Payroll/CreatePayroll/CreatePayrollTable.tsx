import { UsePayroll } from "@/Actions/PayrollAction";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import LoadingScreen from "@/LoadingScreen";

export default function CreatePayrollTable({scholars, setChecked, checked}: any) {

    const {tableLoad} = UsePayroll();

    return (
        <>
        {tableLoad && <LoadingScreen />}
            <Table>
                <TableHeader>
                    <TableRow className="border-t-1">
                        <TableHead className="text-center">Action</TableHead>
                        <TableHead className="text-center">
                            Scholar Name
                        </TableHead>
                        <TableHead className="text-center">Month</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scholars && scholars.length > 0 ?
                        scholars?.map((d: any) => {
                            let id = d.volunteer_id;
                            return (
                                <TableRow
                                    className={`cursor-pointer ${
                                        //@ts-ignore
                                        checked.includes(id)
                                            ? "bg-slate-400 text-white hover:bg-slate-500"
                                            : ""
                                    }`}
                                    key={d.id}
                                    onClick={() =>
                                        setChecked((prev: any) =>
                                            //if includes na sya, dahil nasa loob sya ng setChecked mag fifilter ng hindi katulad ng id
                                            prev.includes(id)
                                                ? prev.filter(
                                                      (item: any) => item != id
                                                  )
                                                : [...prev, id]
                                        )
                                    }
                                >
                                    <TableCell className="text-center">
                                        <Checkbox
                                            //@ts-ignore
                                            checked={checked.includes(id)}
                                            value={d.id}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {d.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {d.month}
                                    </TableCell>
                                </TableRow>
                            );
                        }) : <TableRow>
                            <TableCell colSpan={3} key={1} className="text-center">No Scholars</TableCell>
                            </TableRow>}
                </TableBody>
            </Table>
        </>
    );
}
