import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FormFieldComponent({
    form,
    type,
    name,
    label,
    selectItems,
}: {
    form: UseFormReturn;
    type?: string;
    name: string;
    label: string;
    selectItems?: any;
}) {
    const input = [
        "",
        undefined,
        "text",
        "number",
        "password",
        "date",
        "month",
    ];

    const content = ({ field }: { field: any }) => {
        const value = field.value == undefined ? "" : field.value;
        if (input.includes(type)) {
            return (
                <Input
                    type={type}
                    {...field}
                    value={value}
                    placeholder={`Enter ${label}`}
                />
            );
        }

        if (type == "textarea") {
            return (
                <Textarea
                    type={type}
                    {...field}
                    value={value}
                    placeholder={`Enter ${label}`}
                    style={{ resize: "none" }}
                />
            );
        }

        if (type == "select") {
            const { error } = useFormField();
            return (
                <Select
                    value={String(value)}
                    onValueChange={field.onChange}
                    key={name}
                >
                    <SelectTrigger
                        className={`w-full ${error && "border-red-500"}`}
                    >
                        <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>{selectItems}</SelectContent>
                </Select>
            );
        }
    };

    const formfield = (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>{content({ field })}</FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return formfield;
}
