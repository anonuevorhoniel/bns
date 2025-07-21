import { UseScholarShow } from "@/Actions/ScholarAction";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NAValues } from "@/Reusable/NAValues";
import { GraduationCap, MapPin, Phone, User } from "lucide-react";

export default function PersonalInformationTab() {
    const { scholarData } = UseScholarShow();
    return (
        <div className="pb-2 max-h-[350px] overflow-auto">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div>
                    <Card className=" p-0 shadow-sm ">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Basic Information
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            First Name
                                        </label>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {NAValues(scholarData?.first_name)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Middle Name
                                        </label>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {NAValues(scholarData?.middle_name)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Last Name
                                        </label>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {NAValues(scholarData?.last_name)}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Civil Status
                                        </label>
                                        <Badge
                                            variant={"outline"}
                                            className="mt-1 ml-2"
                                        >
                                            {NAValues(
                                                scholarData?.civil_status
                                            )}
                                        </Badge>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Sex
                                        </label>
                                        <Badge
                                            variant="outline"
                                            className="mt-1 ml-1"
                                        >
                                            {NAValues(scholarData?.sex)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="shadow-sm">
                        <CardContent className="">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-green-600" />
                                Contact Details
                            </h3>
                            <div className="">
                                <div className="mb-2">
                                    <label className="text-sm font-medium text-gray-600 flex">
                                        Contact Number:
                                        <div className="flex ml-2 items-center">
                                            <Phone className="h-4 w-4 text-gray-400 items-center" />
                                            <label htmlFor="" className="ml-2">
                                                {" "}
                                                {NAValues(
                                                    scholarData?.contact_number
                                                )}
                                            </label>
                                        </div>
                                    </label>
                                    <p className="text-gray-900 font-medium mt-1 flex items-center gap-2"></p>
                                </div>

                                <div className="flex mb-3">
                                    <label className="text-sm font-medium text-gray-600">
                                        Address:
                                    </label>
                                    <label className="text-sm font-semibold ml-1">
                                        {NAValues(scholarData?.full_address)}
                                    </label>
                                </div>

                                <div className="flex">
                                    <label className="text-sm font-medium text-gray-600">
                                        Complete Address:
                                    </label>
                                    <label className="text-sm font-semibold ml-1">
                                        {NAValues(
                                            scholarData?.complete_address
                                        )}
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="shadow-sm mt-5 sm:mt-3">
                <CardContent className="">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        Educational Background
                    </h3>
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Educational Attainment:
                        </label>
                        <Badge className="mt-2 bg-purple-100 text-purple-800 hover:bg-purple-200 ml-4">
                            {NAValues(scholarData?.educational_attainment)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
