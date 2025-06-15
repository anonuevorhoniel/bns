import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import FormFieldInput from "@/Reusable/FormFieldInput";
import FormFieldSelect from "@/Reusable/FormFieldSelect";
import { ClipboardPlus, Grid2x2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdditionalInfo } from "@/Actions/ScholarAction";
import { ShowTable } from "./ShowTable";

export default function AdditionalInformation(scholarForm: any) {
    const [replacement, setReplacement] = useState(false);
    const { form } = useCreateScholarForm();
    useEffect(() => {
        form.status == "REP" ? setReplacement(true) : setReplacement(false);
    }, [form.status]);
    const {setShow} = AdditionalInfo();

    return (
        <>
        <ShowTable />
            <Card className="p-0 mt-5 pb-5">
                <CardTitle className="p-3 bg-muted rounded-tl-lg rounded-tr-lg">
                    <p className="text-blue-900 flex items-center">
                        <ClipboardPlus className="mr-3" /> Additional
                        Information
                    </p>
                </CardTitle>
                <CardContent>
                    <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:grid-cols-2">
                        
                        <div>
                            <FormFieldSelect
                                scholarForm={scholarForm}
                                name="status"
                                formLabel="Status (OLD/REP/NEW)"
                                placeholder="-- Select Status --"
                                selectItem={
                                    <>
                                        <SelectItem value="OLD">OLD</SelectItem>
                                        <SelectItem value="REP">REP</SelectItem>
                                        <SelectItem value="NEW">NEW</SelectItem>
                                    </>
                                }
                            />
                        </div>

                        <div>
                            <FormFieldSelect
                                scholarForm={scholarForm}
                                name="bns_type"
                                formLabel="BNS Type"
                                placeholder="-- Select BNS Type --"
                                selectItem={
                                    <>
                                        <SelectItem value="BNS">BNS</SelectItem>
                                        <SelectItem value="Assitant BNS">
                                            Assitant BNS
                                        </SelectItem>
                                    </>
                                }
                            />
                        </div>

                        <div>
                            <FormFieldSelect
                                scholarForm={scholarForm}
                                name="place_of_assignment"
                                formLabel="Place of Assignment"
                                placeholder="-- Select Place of Assignment --"
                                selectItem={
                                    <>
                                        <SelectItem value="Same as Barangay">
                                            Same as Barangay
                                        </SelectItem>
                                        <SelectItem value="BNS">
                                            BNS Coordinator
                                        </SelectItem>
                                    </>
                                }
                            />
                        </div>

                        <div>
                            <FormFieldInput
                                scholarForm={scholarForm}
                                name="educational_attainment"
                                placeholder={"--Educational Attainment--"}
                                formLabel={"Educational Attainment"}
                            />
                        </div>

                        <div>
                            <FormFieldInput
                                scholarForm={scholarForm}
                                name="first_employment_date"
                                formLabel={"First Employment Date"}
                                type={"date"}
                            />
                        </div>

                        {replacement && (
                            <div className="grid w-full col-span-3 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-5 ">
                                <div>
                                    <Label className="mb-2">Replacing</Label>
                                    <Input
                                        type="text"
                                        disabled
                                        placeholder="--Replacement Person Name--"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2">
                                        Date of Replacement
                                    </Label>
                                    <Input type="date" />
                                </div>
                                <div>
                                    <Button
                                    onClick={() => setShow(true)}
                                        variant={"outline"}
                                        className="mt-5 border-blue-500 text-blue-500 hover:text-blue-500"
                                        type="button"
                                    >
                                        <Grid2x2 />
                                        BNS to be Replaced (Show Table)
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
