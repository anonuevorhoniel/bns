import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import FormFieldInput from "@/Reusable/FormFieldInput";
import FormFieldSelect from "@/Reusable/FormFieldSelect";
import { HandCoins } from "lucide-react";

export default function Incentive(scholarForm: any) {
    return (
        <>
            <Card className="p-0 mt-5 pb-5">
                <CardTitle className="p-3 bg-muted rounded-tl-lg rounded-tr-lg">
                    <p className="text-blue-900 flex items-center">
                        <HandCoins className="mr-3" /> Fund
                    </p>
                </CardTitle>
                <CardContent>
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
                                        <SelectItem value="LOCAL">
                                            LOCAL
                                        </SelectItem>
                                        <SelectItem value="BOTH">
                                            BOTH
                                        </SelectItem>
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
                </CardContent>
            </Card>
        </>
    );
}
