import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/custom/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

export default function FundForm({ form }: { form: UseFormReturn }) {
    const fund = form.watch("fund");
    const fundSelection = ["NNC", "LOCAL", "BOTH"];
    return (
        <>
            <Label className="font-bold text-xl mb-5">Fund</Label>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <FormFieldComponent
                    name="fund"
                    label="Fund"
                    form={form}
                    type="select"
                    selectItems={
                        <>
                            {!fundSelection.includes(fund) && fund != null && (
                                <SelectItem value={fund}>{fund}</SelectItem>
                            )}
                            <SelectItem value="NNC">NNC</SelectItem>
                            <SelectItem value="LOCAL">LOCAL</SelectItem>
                            <SelectItem value="BOTH">BOTH</SelectItem>
                        </>
                    }
                />
                <FormFieldComponent
                    name="incentive_prov"
                    label="Incentive Provincial"
                    type="number"
                    form={form}
                />
                <FormFieldComponent
                    name="incentive_mun"
                    label="Incentive Municipal"
                    type="number"
                    form={form}
                />
                <FormFieldComponent
                    name="incentive_brgy"
                    label="Incentive Barangay"
                    type="number"
                    form={form}
                />
            </div>
        </>
    );
}
