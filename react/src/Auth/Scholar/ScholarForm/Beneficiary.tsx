import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import FormFieldInput from "@/Reusable/FormFieldInput";
import FormFieldSelect from "@/Reusable/FormFieldSelect";
import { BookUser } from "lucide-react";
import { useEffect, useState } from "react";

export default function Beneficiary({ scholarForm }: any) {
    const [withPH, setWithPH] = useState(false);
    const { form, setFormData } = useCreateScholarForm();

    useEffect(() => {
        if (form.withPhilHealth == "YES") {
            setWithPH(true);
        } else {
            setWithPH(false);
            setFormData({ name: "classification", value: "" });
            setFormData({ name: "philhealth_no", value: "" });
        }
    }, [form.withPhilHealth]);

    return (
        <>
            <Card className="p-0 mt-5 pb-5">
                <CardTitle className="p-3 bg-muted rounded-tl-lg rounded-tr-lg">
                    <p className="text-blue-900 flex items-center">
                        <BookUser className="mr-3" /> Beneficiary
                    </p>
                </CardTitle>
                <CardContent>
                    <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:grid-cols-2">
                        <div>
                            <FormFieldInput
                                scholarForm={scholarForm}
                                name={"benificiary_name"}
                                formLabel={"Beneficiary Name"}
                                placeholder="--Beneficiary Name--"
                            />
                        </div>
                        <div>
                            <FormFieldInput
                                scholarForm={scholarForm}
                                name={"relationship"}
                                formLabel={"Relationship"}
                                placeholder="--Relationship--"
                            />
                        </div>
                        <div>
                            <FormFieldSelect
                                scholarForm={scholarForm}
                                name={"withPhilHealth"}
                                formLabel="With PhilHealth?"
                                placeholder="-- Select --"
                                selectItem={
                                    <>
                                        <SelectItem value="YES">Yes</SelectItem>
                                        <SelectItem value="NO">No</SelectItem>
                                    </>
                                }
                            />
                        </div>

                        {withPH && (
                            <div>
                                <FormFieldInput
                                    scholarForm={scholarForm}
                                    name={"classification"}
                                    formLabel={"Classification"}
                                    placeholder="--Classification--"
                                />
                            </div>
                        )}

                        {withPH && (
                            <div>
                                <FormFieldInput
                                    scholarForm={scholarForm}
                                    name={"philhealth_no"}
                                    formLabel={"PhilHealth no."}
                                    placeholder="--PhilHealth no.--"
                                    type={"number"}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
