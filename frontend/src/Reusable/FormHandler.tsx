import {
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
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function FormHandler({
    name,
    label,
    schemaForm,
    type,
    setForm,
    selectItems,
}: {
    name: string;
    label: string;
    schemaForm: any;
    type?: string;
    setForm: any;
    selectItems?: any;
}) {
    if (!schemaForm || !schemaForm.control) return null;
    const inputType = (type: any, field: any, name: any) => {
        if (
            type == "" ||
            type == null ||
            type == undefined ||
            type == "date" ||
            type == "time" ||
            type == "number" ||
            type == "password"
        ) {
            return (
                <Input
                    {...field}
                    value={field.value}
                    placeholder={`Enter ${label}`}
                    type={type}
                    onInput={(e: any) =>
                        setForm({ name: name, value: e.target.value })
                    }
                />
            );
        } else if (type == "select") {
            return (
                <Select
                    {...field}
                    value={field.value}
                    onValueChange={(e) => setForm({ name: name, value: e })}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>{selectItems}</SelectContent>
                </Select>
            );
        }
    };

    return (
        <>
            <FormField
                name={name}
                control={schemaForm?.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            {inputType(type, field, name)}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
