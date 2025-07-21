import { UseScholarShow } from "@/Actions/ScholarAction";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { NAValues } from "@/Reusable/NAValues";
import { Calendar, Cross,  IdCard, Landmark } from "lucide-react";

export default function EmploymentStatusTab() {
    const { scholarData } = UseScholarShow();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-auto max-h-[350px] pb-3">
            <div>
                <Card className="p-0">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-blue-900">
                                <IdCard size={20} />
                            </div>
                            <Label className="text-bold text-lg">
                                Identifications
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <div className="grid grid-cols-2">
                                <label className="opacity-60 font-medium">
                                    Name on ID
                                </label>
                                <label className="opacity-60 font-medium">
                                    ID No.
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="font-medium">
                                    {NAValues(scholarData?.name_on_id)}
                                </label>
                                <label className="font-medium">
                                    {NAValues(scholarData?.id_no)}
                                </label>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex gap-4 ">
                            <label className="text-sm opacity-70 font-medium">
                                Status:{" "}
                            </label>
                            <Badge
                                variant={"outline"}
                                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                            >
                                {NAValues(scholarData?.status)}
                            </Badge>
                        </div>
                    </div>
                </Card>
            </div>
            <div>
                <Card className="p-0">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-yellow-600">
                                <Calendar size={20} />
                            </div>
                            <Label className="text-bold text-lg">
                                Employment History
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <div className="grid grid-cols-2">
                                <label className="opacity-70">
                                    First Employment Date
                                </label>
                                <label className="opacity-70">
                                    Years in Service
                                </label>
                            </div>
                            <div className="grid grid-cols-2">
                                <label className="font-medium">
                                    {NAValues(
                                        scholarData?.first_employment_date
                                    )}
                                </label>
                                <label className="font-medium">
                                    {NAValues(scholarData?.years_in_service)}
                                </label>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <label className="text-sm opacity-70 font-medium">
                                Place of Assingment:{" "}
                            </label>
                            <label className="text-sm font-medium">
                                {NAValues(scholarData?.place_of_assignment)}
                            </label>
                        </div>
                    </div>
                </Card>
            </div>
            <div>
                <Card className="p-0">
                    <div className="p-6 space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="text-green-600">
                                <Landmark size={20} />
                            </div>
                            <Label className="text-bold text-lg">Funds</Label>
                        </div>
                        <div className="flex gap-4">
                            <Label className=" text-md opacity-70 font-medium">
                                Fund:{" "}
                            </Label>
                            <Badge
                                variant={"outline"}
                                className="border-green-500 text-green-500 hover:text-white hover:bg-green-500"
                            >
                                {NAValues(scholarData?.fund)}
                            </Badge>
                        </div>
                        <div className="flex gap-4">
                            <Label className=" text-md opacity-70 font-medium">
                                Provincial Incentive:
                            </Label>
                            <Badge variant={"outline"}>
                                {NAValues(scholarData?.incentive_prov)}
                            </Badge>
                        </div>
                        <div className="flex gap-4">
                            <Label className=" text-md opacity-70 font-medium">
                                Municipal Incentive:
                            </Label>
                            <Badge variant={"outline"}>
                                {NAValues(scholarData?.incentive_mun)}
                            </Badge>
                        </div>
                        <div className="flex gap-4">
                            <Label className=" text-md opacity-70 font-medium">
                                Barangay Incentive:
                            </Label>
                            <Badge variant={"outline"}>
                                {NAValues(scholarData?.incentive_brgy)}
                            </Badge>
                        </div>
                    </div>
                </Card>
            </div>
            <div>
                <Card className="p-0">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-red-600">
                                <Cross size={20} />
                            </div>
                            <Label className="text-bold text-lg">
                                PhilHealth
                            </Label>
                        </div>
                        <div className="space-y-1">
                            <div className="grid grid-cols-2">
                                <Label className="text-md opacity-60">
                                    PhilHealth No.
                                </Label>
                                <Label className="text-md opacity-60">
                                    PhilHealth Classification
                                </Label>
                            </div>
                            <div className="grid grid-cols-2">
                                <label className="text-md font-medium">
                                    {NAValues(scholarData?.philhealth_no)}
                                </label>
                                <label className="text-md font-medium">
                                    {NAValues(scholarData?.classification)}
                                </label>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex gap-4">
                            <Label className="text-md opacity-70 text-sm">Beneficiary Name:</Label>
                            <label className="text-sm font-medium">{NAValues(scholarData?.benificiary_name)}</label>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
