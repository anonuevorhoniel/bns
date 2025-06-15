import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";


export default function FormFieldInput({scholarForm, name, formLabel, placeholder, type}: any) {

    const {setFormData } = useCreateScholarForm();
    return (
        <FormField
            control={scholarForm.control}
            name={name}
            render={({ field }) => (
                <>
                    <FormItem>
                        <FormLabel>{formLabel}</FormLabel>
                        <FormControl>
                            <Input  placeholder={placeholder} type={type}  {...field} value={field.value}  onInput={(e: any) => {
                                setFormData({name: name, value: e.target.value});
                            }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </>
            )}
        />
    );
}
