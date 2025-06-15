import { UseLayout } from "@/Actions/LayoutAction";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import MunicipalityDropDown from "@/Reusable/MunicipalityDropDown";
import { PayrollSchema } from "@/Validation/PayrollValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function CreatePayroll() {
    const { setItem, setBItem } = UseLayout();
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        setItem("Payrolls");
        setBItem("Create");
    }, []);

    const defaultValues = {
        from: "",
        to: "",
        rate: "",
        municipality_code: "",
        fund: "",
    };

    const usePayrollForm = useForm<any>({
        resolver: zodResolver(PayrollSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = () => {};
    const data = [
        { id: 1, name: "RHoniel", month: "2" },
        { id: 2, name: "Rhon2", month: "3" },
    ];
    const [checked, setChecked] = useState([]);

    const allId = data.map((item) => item.id);
    // useEffect(() => {
    //     console.log(allId);
    // }, [allId]);

    return (
        <>
            <title>BNS | Create Payroll</title>
            <Link to={"/payrolls"}>
                <Button className="text-xs h-8" variant={"primary"}>
                    <ArrowLeftCircle /> Back
                </Button>
            </Link>
            <Card className="mt-5 p-0">
                <Form {...usePayrollForm}>
                    <form onSubmit={usePayrollForm.handleSubmit(handleSubmit)}>
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-5">
                            <FormField
                                name="from"
                                control={usePayrollForm.control}
                                render={({ field }: any) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>From</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="month"
                                                    value={field.value}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>

                            <FormField
                                name="to"
                                control={usePayrollForm.control}
                                render={({ field }: any) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>To</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="month"
                                                    value={field.value}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>

                            <FormField
                                name="rate"
                                control={usePayrollForm.control}
                                render={({ field }: any) => {
                                    const { error } = useFormField();
                                    return (
                                        <FormItem>
                                            <FormLabel>Rate</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(e) =>
                                                        field.onChange(e)
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger
                                                        className={`w-full hover:-translate-y-0.5 hover:shadow-lg hover:bg-muted ${
                                                            error &&
                                                            "border-red-500"
                                                        }`}
                                                    >
                                                        <SelectValue placeholder="-- Select Rate --"></SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="a">
                                                            a
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>

                            <FormField
                                name="municipality_code"
                                control={usePayrollForm.control}
                                render={({ field }: any) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Municipality</FormLabel>
                                            <FormControl>
                                                <MunicipalityDropDown
                                                    open={open}
                                                    setOpen={setOpen}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>

                            <FormField
                                name="fund"
                                control={usePayrollForm.control}
                                render={({ field }: any) => {
                                    const { error } = useFormField();
                                    return (
                                        <FormItem>
                                            <FormLabel>Fund</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(e) =>
                                                        field.onChange(e)
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`w-full hover:-translate-y-0.5 hover:shadow-lg hover:bg-muted ${
                                                            error &&
                                                            "border-red-500"
                                                        }`}
                                                        
                                                    >
                                                        <SelectValue placeholder="-- Select Fund --" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="aasdasd">
                                                            aasdad
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>
                        </div>
                        <div className="bg-muted p-2">
                            <Button className="ml-3" variant={"success"}>
                                Generate Scholars
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>

            <Label className="mt-5 ml-3 mb-3 flex gap-2 hover:font-semibold max-w-25">
                <Checkbox
                    onCheckedChange={(e: boolean) => setChecked(e ? allId : [])}
                />
                Check All
            </Label>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">
                                Action
                            </TableHead>
                            <TableHead className="text-center">
                                Scholar Name
                            </TableHead>
                            <TableHead className="text-center">Month</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data &&
                            data.map((d: any) => {
                                let id = d.id;
                                return (
                                    <TableRow
                                        className={`${
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
                                                          (item: any) =>
                                                              item != id
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
                            })}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
