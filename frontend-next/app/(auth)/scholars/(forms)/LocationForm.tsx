import ax from "@/app/axios";
import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { readonly } from "zod";

export default function LocationForm({ form }: { form: UseFormReturn }) {
    const district = form.watch("district_id");
    const municipality = form.watch("citymuni_id");
    const {
        data: municipalities,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ["municipalities", district],
        queryFn: async () =>
            await ax.post("/getMunicipalities", { district: district }),
        enabled: !!district,
    });

    const { data: barangays } = useQuery({
        queryKey: ["barangays", municipalities],
        queryFn: async () =>
            await ax.post("/getBarangays", { code: municipality }),
        enabled: !!municipality,
    });

    if (isError) {
        console.log(error);
    }
    return (
        <>
            <Label className="font-bold text-xl mb-5">Location</Label>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <FormFieldComponent
                    name="district_id"
                    label="District"
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="1">District 1</SelectItem>
                            <SelectItem value="2">District 2</SelectItem>
                            <SelectItem value="3">District 3</SelectItem>
                            <SelectItem value="4">District 4</SelectItem>
                        </>
                    }
                    form={form}
                />
                <FormFieldComponent
                    name="citymuni_id"
                    label="Municipality"
                    type="select"
                    selectItems={municipalities?.data.map((muni: any) => (
                        <SelectItem key={muni.id} value={muni.code}>
                            {muni.name}
                        </SelectItem>
                    ))}
                    form={form}
                />
                <FormFieldComponent
                    name="barangay_id"
                    label="Barangay"
                    type="select"
                     selectItems={barangays?.data.map((barangay: any) => (
                        <SelectItem key={barangay.id} value={barangay.code}>
                            {barangay.name}
                        </SelectItem>
                    ))}
                    form={form}
                />

                <div className="space-y-2">
                    <Label>Region</Label>
                    <Input readOnly value={"IV-A"} />
                </div>

                <div className="space-y-2">
                    <Label>Province</Label>
                    <Input readOnly value={"Laguna"} />
                </div>

                <div className="lg:col-span-2">
                    <FormFieldComponent
                        name="complete_address"
                        label="Complete Address"
                        type="textarea"
                        form={form}
                    />
                </div>
            </div>
        </>
    );
}
