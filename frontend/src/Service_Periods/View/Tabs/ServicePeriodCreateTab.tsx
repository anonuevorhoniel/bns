import { spSchema } from "@/Auth/Scholar/CreateScholarForm/Schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    UseStoreServicePeriod,
    UseViewServicePeriod,
} from "@/Actions/ServicePeriodAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ServicePeriodCreateTab() {
    const [to, setTo] = useState("");
    const defaultValues = {
        from: "",
        to: "",
        select_to: "",
    };
    const qclient = useQueryClient();
    const { setSpFormData, storeSP } = UseStoreServicePeriod();
    const spForm = useForm<any>({
        resolver: zodResolver(spSchema),
        defaultValues: defaultValues,
    });
    const { scholarId } = UseViewServicePeriod();
    const storeSPMutate = useMutation({
        mutationFn: () => storeSP(scholarId),
        onSuccess: () => {
            toast.success("Added", {
                description: "Service Period has been added",
            });
            qclient.invalidateQueries({ queryKey: ["viewServicePeriod"] }),
                qclient.invalidateQueries({ queryKey: ["servicePeriod"] });
        },
        onError: (data: any) => {
            toast.error("Error", { description: data?.response.data});
            console.log(data);
        },
    });
    const handleSubmit = () => {
        storeSPMutate.mutate();
    };

    return (
        <>
            <div>
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
                                                    value={field.value}
                                                    onInput={(e) => {
                                                        setSpFormData({
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
                                    name="select_to"
                                    control={spForm.control}
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel className="opacity-70">
                                                    <CalendarArrowDown
                                                        size={15}
                                                    />{" "}
                                                    To
                                                </FormLabel>
                                                <FormControl>
                                                    {/* <Input type="month" {...field}/> */}
                                                    <Select
                                                        onValueChange={(e) => {
                                                            field.onChange(e);
                                                            setTo(e);
                                                            setSpFormData({
                                                                name: "to_date",
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
                            <div></div>
                            {to == "specific" && (
                                <FormField
                                    name="to"
                                    control={spForm.control}
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="month"
                                                        {...field}
                                                        value={field.value}
                                                        onInput={(e) => {
                                                            setSpFormData({
                                                                name: "to",
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

                        <div className="flex justify-center col-span-2 mt-5">
                            <Button variant={"success"}>Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}
