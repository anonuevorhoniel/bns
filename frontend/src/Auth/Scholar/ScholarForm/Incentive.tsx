import { SelectItem } from "@/components/ui/select";
import FormFieldInput from "@/Reusable/FormFieldInput";
import FormFieldSelect from "@/Reusable/FormFieldSelect";

export default function Incentive(scholarForm: any) {
    return (
        <>
            <div className="space-y-4 p-4">
                <p className="text-xl mb-6">Fund</p>
                <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:grid-cols-2">
                    <div>
                        <FormFieldSelect
                            name="fund"
                            scholarForm={scholarForm}
                            formLabel="Fund"
                            placeholder="-- Select --"
                            selectItem={
                                <>
                                    <SelectItem value="NNC">NNC</SelectItem>
                                    <SelectItem value="LOCAL">LOCAL</SelectItem>
                                    <SelectItem value="BOTH">BOTH</SelectItem>
                                </>
                            }
                        />
                    </div>
                    <div>
                        <div>
                            <FormFieldInput
                                scholarForm={scholarForm}
                                name={"incentive_prov"}
                                formLabel={"Incentive Provincial"}
                                placeholder="--Incentive Provincial--"
                                type="number"
                            />
                        </div>
                    </div>
                    <div>
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"incentive_mun"}
                            formLabel={"Incentive Municipal"}
                            placeholder="--Incentive Municipal--"
                            type="number"
                        />
                    </div>
                    <div>
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"incentive_brgy"}
                            formLabel={"Incentive Barangay"}
                            placeholder="--Incentive Barangay--"
                            type="number"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
