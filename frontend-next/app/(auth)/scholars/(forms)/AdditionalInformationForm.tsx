import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export default function AdditionalInformationForm({
    form,
}: {
    form: UseFormReturn;
}) {
    const status = form.watch("status");
    return (
        <>
            <Label className="font-bold text-xl mb-5">
                Additional Information
            </Label>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <FormFieldComponent
                    name="status"
                    label="Status"
                    form={form}
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="OLD">OLD</SelectItem>
                            <SelectItem value="REP">REP</SelectItem>
                            <SelectItem value="NEW">NEW</SelectItem>
                        </>
                    }
                />
                <FormFieldComponent
                    name="bns_type"
                    label="BNS Type"
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="BNS">BNS</SelectItem>
                            <SelectItem value="Assitant BNS">
                                Assitant BNS
                            </SelectItem>
                        </>
                    }
                    form={form}
                />
                <FormFieldComponent
                    name="place_of_assignment"
                    label="Place of Assignment"
                    form={form}
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="same_as_barangay">
                                Same as Barangay
                            </SelectItem>
                            <SelectItem value="BNS Coordinator">
                                BNS Coordinator
                            </SelectItem>
                        </>
                    }
                />
                <FormFieldComponent
                    name="educational_attainment"
                    label="Educational Attainment"
                    form={form}
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="Elementary Graduate">
                                Elementary Graduate
                            </SelectItem>
                            <SelectItem value="High School Graduate">
                                High School Graduate
                            </SelectItem>
                            <SelectItem value="Vocational">
                                Vocational
                            </SelectItem>
                            <SelectItem value="College Graduate">
                                College Graduate
                            </SelectItem>
                            <SelectItem value="Master's Degree">
                                Master's Degree
                            </SelectItem>
                        </>
                    }
                />
                <FormFieldComponent
                    name="first_employment_date"
                    type="date"
                    label="First Employment Date"
                    form={form}
                />
                {status == "REP" && (
                    <>
                        <div className="space-y-2">
                            <Label>Select BNS to Replace:</Label>
                            <Button
                                className="w-full flex justify-between"
                                type="button"
                                variant={"outline"}
                            >
                                <Label>Select BNS</Label>
                                <ChevronDown />
                            </Button>
                        </div>
                        <FormFieldComponent
                            name="service_period_status"
                            label="Service Period Status"
                            form={form}
                            type="select"
                            selectItems={
                                <>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="New Service Period">
                                        New Service Period
                                    </SelectItem>
                                    <SelectItem value="Update    Service Period">
                                        Update Service Period
                                    </SelectItem>
                                </>
                            }
                        />
                        <FormFieldComponent
                            name="replacement_date"
                            type="date"
                            label="Date of Replacement"
                            form={form}
                        />
                    </>
                )}
            </div>
        </>
    );
}
