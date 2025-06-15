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
                                <SelectContent>{selectItem}</SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        ></FormField>
    );
}
