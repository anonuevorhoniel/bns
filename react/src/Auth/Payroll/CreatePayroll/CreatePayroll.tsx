import { UseLayout } from "@/Actions/LayoutAction";
import { UsePayroll } from "@/Actions/PayrollAction";
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

import ButtonLoad from "@/Reusable/ButtonLoad";
import MunicipalityDropDown from "@/Reusable/MunicipalityDropDown";
import { PayrollSchema } from "@/Validation/PayrollValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftCircle, CirclePlus, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CreatePayrollTable from "./CreatePayrollTable";
import AutoPagination from "@/Reusable/AutoPagination";
import { Toaster } from "sonner";

export default function CreatePayroll() {
    const { setItem, setBItem } = UseLayout();
    const [open, setOpen] = useState<boolean>(false);
    const {
        getRates,
        rates,
        setForm,
        getScholars,
        scholars,
        total_page,
        submitPayroll,
        scholar_ids,
        form,
    } = UsePayroll();
    const [loading, setLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState([]);
    const [page, setPage] = useState<number>(1);
    const nav = useNavigate();

    useEffect(() => {
        setItem("Payrolls");
        setBItem("Create");
        getRates();
    }, []);

    useEffect(() => {
        getScholars({ setLoading, page, pageChange: true });
    }, [page]);

    useEffect(() => {
        console.log(form);
    }, [form]);

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

    const handleSubmit = () => {
        getScholars({ setLoading, page, pageChange: false });
    };

    const handleSubmitPayroll = () => {
        submitPayroll({ checked, form, nav });
    };

    return (
        <>
            <Toaster />
            <title>BNS | Create Payroll</title>
            <Link to={"/payrolls"}>
                <Button className="text-xs h-8" variant={"primary"}>
                    <ArrowLeftCircle /> Back
                </Button>
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-5">
                <div>
                    <Card className="mt-5 p-0">
                        <Form {...usePayrollForm}>
                            <form
                                onSubmit={usePayrollForm.handleSubmit(
                                    handleSubmit
                                )}
                            >
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-5">
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
                                                            onInput={(e) =>
                                                                setForm({
                                                                    name: "from",
                                                                    value: (
                                                                        e.target as HTMLInputElement
                                                                    ).value,
                                                                })
                                                            }
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
                                                            onInput={(e) =>
                                                                setForm({
                                                                    name: "to",
                                                                    value: (
                                                                        e.target as HTMLInputElement
                                                                    ).value,
                                                                })
                                                            }
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
                                                            onValueChange={(
                                                                e
                                                            ) => {
                                                                field.onChange(
                                                                    e
                                                                );
                                                                setForm({
                                                                    name: "rate",
                                                                    value: e,
                                                                });
                                                            }}
                                                            value={field.value}
                                                            disabled={
                                                                rates?.length ==
                                                                    0 || !rates
                                                            }
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
                                                                {rates &&
                                                                    rates?.map(
                                                                        (
                                                                            r: any
                                                                        ) => {
                                                                            return (
                                                                                <SelectItem
                                                                                    key={`${r.id}`}
                                                                                    value={`${r.id}`}
                                                                                >
                                                                                    ₱{" "}
                                                                                    {
                                                                                        r.rate
                                                                                    }
                                                                                </SelectItem>
                                                                            );
                                                                        }
                                                                    )}
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
                                                    <FormLabel>
                                                        Municipality
                                                    </FormLabel>
                                                    <FormControl>
                                                        <MunicipalityDropDown
                                                            open={open}
                                                            setOpen={setOpen}
                                                            field={field}
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
                                                            onValueChange={(
                                                                e
                                                            ) => {
                                                                field.onChange(
                                                                    e
                                                                );
                                                                setForm({
                                                                    name: "fund",
                                                                    value: e,
                                                                });
                                                            }}
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
                                                                <SelectItem value="NNC">
                                                                    NNC
                                                                </SelectItem>
                                                                <SelectItem value="LOCAL">
                                                                    LOCAL
                                                                </SelectItem>
                                                                <SelectItem value="BOTH">
                                                                    BOTH
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
                                <div className="bg-muted p-2 rounded-bl-lg rounded-br-lg flex justify-center">
                                    <ButtonLoad
                                        name={"Generate Scholars"}
                                        icon={<UsersRound />}
                                        loading={loading}
                                        variant={"success"}
                                    />
                                </div>
                            </form>
                        </Form>
                    </Card>
                </div>

                <Card className="pt-0 mt-5">
                    <div className="flex justify-between p-3">
                        <Label className="flex gap-2 hover:font-semibold max-w-25">
                            <Checkbox
                                //@ts-ignore
                                onCheckedChange={(e: boolean) =>
                                    setChecked(e ? scholar_ids : [])
                                }
                            />
                            Check All
                        </Label>
                        <Button
                            variant={"success"}
                            onClick={() => handleSubmitPayroll()}
                        >
                            {" "}
                            <CirclePlus /> Payroll
                        </Button>
                    </div>
                    <div className="pt-0 max-h-150 overflow-auto relative">
                        <CreatePayrollTable
                            scholars={scholars}
                            setChecked={setChecked}
                            checked={checked}
                        />
                        <AutoPagination
                            page={page}
                            setPage={setPage}
                            totalPage={total_page}
                        />
                    </div>
                </Card>
            </div>
        </>
    );
}
