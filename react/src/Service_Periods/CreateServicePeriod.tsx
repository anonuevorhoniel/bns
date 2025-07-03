import { UseCreateServicePeriod } from "../Actions/ServicePeriodAction";
import DialogDrawer from "@/Reusable/DialogDrawer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSPSchema } from "@/Auth/Scholar/CreateScholarForm/Schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Building2,
    CalendarArrowDown,
    CalendarArrowUp,
    CalendarPlus2,
    CalendarSearch,
    ListChecks,
    Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MunicipalityDropDown from "@/Reusable/MunicipalityDropDown";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import AutoPagination from "@/Reusable/AutoPagination";
import LoadingScreen from "@/LoadingScreen";

export function CreateServicePeriod() {
    const [selectedIds, setSelectedIds] = useState<any>([]);
    const {
        spCreateOpen,
        setspCreateOpen,
        form,
        setForm,
        getScholars,
        pageData,
        scholars,
        batchStoreSP,
        clearForm,
        loading,
    } = UseCreateServicePeriod();
    const [muniOpen, setMuniOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [to, setTo] = useState("");

    function handleId(id: any) {
        setSelectedIds((prev: any) =>
            prev.includes(id)
                ? prev.filter((idd: any) => idd != id)
                : [...prev, id]
        );
    }

    const defaultValues = {
        from: "",
        specific_date: "", //laging date
        to: "", //present or specific
        municipality_code: "",
    };

    useEffect(() => {
        spForm.reset();
        clearForm();
        setSelectedIds([]);
    }, [spCreateOpen]);

    const spForm = useForm<any>({
        resolver: zodResolver(createSPSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = () => {
        batchStoreSP({ selectedIds, setspCreateOpen });
    };

    useEffect(() => {
        getScholars(page);
    }, [form?.municipality_code, page]);

    useEffect(() => {
        setSelectedIds([]);
    }, [form?.municipality_code]);

    const content = (
        <div className="max-h-[70vh] overflow-auto p-6">
            <Label className="text-lg">
                <div className="text-yellow-600">
                    <CalendarPlus2 />
                </div>{" "}
                Create Service Period
            </Label>
            <Form {...spForm}>
                <form onSubmit={spForm.handleSubmit(handleSubmit)}>
                    <div className="grid grid-cols-2 gap-5 mt-3">
                        <FormField
                            name="from"
                            control={spForm.control}
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="opacity-70">
                                            <CalendarArrowUp size={15} />
                                            From
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="month"
                                                {...field}
                                                // value={field.value}
                                                onInput={(e) => {
                                                    setForm({
                                                        name: "from",
                                                        value: (
                                                            e.target as HTMLInputElement
                                                        ).value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <div>
                            <FormField
                                name="to"
                                control={spForm.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="opacity-70">
                                                <CalendarArrowDown size={15} />{" "}
                                                To
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(e) => {
                                                        field.onChange(e);
                                                        setTo(e);
                                                        setForm({
                                                            name: "to",
                                                            value: e,
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        className="w-full"
                                                        value={field.value}
                                                    >
                                                        <SelectValue placeholder="-- Select --" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="present">
                                                            Present
                                                        </SelectItem>
                                                        <SelectItem value="specific">
                                                            Specific Date
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

                        <div>
                            <FormField
                                control={spForm.control}
                                name="municipality_code"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="opacity-70">
                                                <Building2 size={15} />{" "}
                                                Municipality
                                            </FormLabel>
                                            <FormControl>
                                                <MunicipalityDropDown
                                                    open={muniOpen}
                                                    setOpen={setMuniOpen}
                                                    field={field}
                                                    setForm={setForm}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>
                        </div>
                        {to == "specific" && (
                            <FormField
                                name="specific_date"
                                control={spForm.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="opacity-70">
                                                <CalendarSearch size={15} />{" "}
                                                Specific Date
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="month"
                                                    {...field}
                                                    value={field.value}
                                                    onInput={(e) => {
                                                        setForm({
                                                            name: "specific_date",
                                                            value: (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2"></div>

                    <div className="flex justify-center col-span-2 mt-5">
                        <Button variant={"success"}>Submit</Button>
                    </div>
                </form>
            </Form>

            <div className="mt-5 relative">
                {loading && <LoadingScreen />}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">
                                <div className="flex justify-center">
                                    <Label className="opacity-70">
                                        <ListChecks size={15} /> Select
                                    </Label>
                                </div>
                            </TableHead>
                            <TableHead className="text-center">
                                <div className="flex justify-center">
                                    <Label className="opacity-70">
                                        <Users size={15} /> Scholars
                                    </Label>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scholars?.map((s: any) => {
                            let id = s.id;
                            return (
                                <TableRow
                                    key={s.id}
                                    onClick={() => handleId(id)}
                                    className={`${
                                        selectedIds.includes(s.id)
                                            ? "bg-gray-500 text-white hover:bg-gray-700"
                                            : ""
                                    }`}
                                >
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={selectedIds.includes(s.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {s.full_name}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {scholars?.length == 0 ||
                        scholars?.length == undefined ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                    No Scholars
                                </TableCell>
                            </TableRow>
                        ) : (
                            ""
                        )}
                    </TableBody>
                </Table>
            </div>

            <AutoPagination
                page={page}
                setPage={setPage}
                totalPage={pageData?.total_page}
            />
        </div>
    );

    return (
        <>
            <DialogDrawer
                open={spCreateOpen}
                setOpen={setspCreateOpen}
                content={content}
                size={"sm:max-w-[900px] p-0"}
            />
        </>
    );
}
