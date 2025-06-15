import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { UserPen } from "lucide-react";
import EditFrillCredentials from "./EditFillCredentials";
import FormFieldInput from "@/Reusable/FormFieldInput";
import FormFieldSelect from "@/Reusable/FormFieldSelect";

export default function PersonalInformation({ scholarForm, scholarData }: any) {
    EditFrillCredentials({ scholarData });

    return (
        <>
            <Card className="p-0 mt-5 pb-5">
                <CardTitle className="p-3 bg-muted rounded-tl-lg rounded-tr-lg">
                    <p className="text-blue-900 flex items-center">
                        <UserPen className="mr-3" /> Personal Information
                    </p>
                </CardTitle>
                <CardContent>
                    <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:grid-cols-2">
                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"first_name"}
                            formLabel="First Name"
                            placeholder="--First Name--"
                        />

                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"middle_name"}
                            formLabel="Middle Name"
                            placeholder="--Middle Name--"
                        />

                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"last_name"}
                            formLabel="Last Name"
                            placeholder="--Last Name--"
                        />

                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"name_on_id"}
                            formLabel="Name on ID"
                            placeholder="--Name on ID--"
                        />

                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"id_no"}
                            formLabel="ID No"
                            placeholder="--ID No--"
                        />

                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name="sex"
                            formLabel="Sex"
                            placeholder="--Sex--"
                            selectItem={
                                <>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">
                                        Female
                                    </SelectItem>
                                </>
                            }
                        />

                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"birth_date"}
                            formLabel="Birth Date"
                            placeholder="--Birth Date--"
                            type="date"
                        />

                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name="civil_status"
                            formLabel="Civil Status"
                            placeholder="--Civil Status--"
                            selectItem={
                                <>
                                    <SelectItem value="Single">
                                        Single
                                    </SelectItem>
                                    <SelectItem value="Married">
                                        Married
                                    </SelectItem>
                                    <SelectItem value="Widowed/Widow">
                                        Widowed/Widow
                                    </SelectItem>
                                    <SelectItem value="Separated">
                                        Separated
                                    </SelectItem>
                                </>
                            }
                        />

                        <FormFieldInput
                            scholarForm={scholarForm}
                            name={"contact_number"}
                            formLabel="Contact Number"
                            placeholder="--Contact Number--"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
