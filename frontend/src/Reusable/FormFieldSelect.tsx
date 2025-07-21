import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";

export default function FormFieldSelect({
    scholarForm,
    name,
    formLabel,
    placeholder,
    selectItem,
    onChange,
    disabled,
}: any) {
    const { setFormData } = useCreateScholarForm();

    const customValue = (field: any) => {
        if (name == "status") {
            if (
                field.value !== "OLD" &&
                field.value !== "REP" &&
                field.value !== "NEW" &&
                field.value !== null &&
                field.value !== undefined &&
                field.value !== ""
            ) {
                return (
                    <SelectItem value={field.value}>{field.value}</SelectItem>
                );
            } else {
                return;
            }
        } else if (name == "fund") {
            if (
                field.value !== "NNC" &&
                field.value !== "LOCAL" &&
                field.value !== "BOTH" &&
                field.value !== ""
            ) {
                return (
                    <SelectItem value={field.value}>{field.value}</SelectItem>
                );
            } else {
                return;
            }
        }
    };

    return (
        <FormField
            name={name}
            control={scholarForm.control}
            render={({ field }) => {
                const { error } = useFormField();
                return (
                    <FormItem>
                        <FormLabel>{formLabel}</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={(e: any) => {
                                    if (onChange) {
                                        onChange(e);
                                    }
                                    if (e != "" || e == null) {
                                        field.onChange(e);
                                    }
                                    setFormData({ name: name, value: e });
                                }}
                                value={field.value}
                            >
                                <SelectTrigger
                                    disabled={disabled}
                                    className={`w-full ${
                                        error && "border-red-500"
                                    } `}
                                >
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {customValue(field)}
                                    {selectItem}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        ></FormField>
    );
}
