import { ViewScholar } from "../ScholarState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseScholarShow } from "@/Actions/ScholarAction";
import "ldrs/react/Ring2.css";
import PersonalInformationTab from "./PersonalInformationTab";
import {
    Briefcase,
    CheckCircle,
    Clock,
    GraduationCap,
    Phone,
    User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DialogDrawer from "@/Reusable/DialogDrawer";
import EmploymentStatusTab from "./EmploymentSstatusTab";
import ServicePeriodTab from "./ServicePeriodTab";
import TrainingTab from "./TrainingTab";
import EligibilityTab from "./EligibilityTab";
import { NAValues } from "@/Reusable/NAValues";

export function ScholarShow() {
    const { show, setShow } = ViewScholar();
    const { fullName, scholarData } = UseScholarShow();
    const content = (
        <>
            <div className="space-y-2">
                 <div className=" relative bg-gradient-to-r from-slate-600 to-slate-700 text-white px-5 rounded-tl-lg rounded-tr-lg py-5">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-white/20 ">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" />
                        <AvatarFallback className="bg-white text-black text-xl font-semibold">
                                {fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold">{fullName}</h2>
                            <p className="text-blue-100 flex items-center gap-2 mt-1">
                                <Phone className="h-4 w-4" />
                                {NAValues(scholarData?.contact_number)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-gray-50/50">
                            <TabsTrigger
                                value="personal"
                                className="flex items-center gap-2"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Personal Info
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="employment"
                                className="flex items-center gap-2"
                            >
                                <Briefcase className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Employment
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="service"
                                className="flex items-center gap-2"
                            >
                                <Clock className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Service Periods
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="trainings"
                                className="flex items-center gap-2"
                            >
                                <GraduationCap className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Trainings
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="eligibilities"
                                className="flex items-center gap-2"
                            >
                                <CheckCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Eligibilities
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="personal"
                            className="pt-3 space-y-6 px-6"
                        >
                            <PersonalInformationTab />
                        </TabsContent>

                        <TabsContent value="employment" className="p-6">
                            <EmploymentStatusTab />
                        </TabsContent>

                        <TabsContent value="service" className="p-6">
                          <ServicePeriodTab />
                        </TabsContent>

                        <TabsContent value="trainings" className="p-6">
                           <TrainingTab />
                        </TabsContent>

                        <TabsContent value="eligibilities" className="p-6">
                           <EligibilityTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
    return (
        <DialogDrawer
            open={show}
            setOpen={setShow}
            content={content}
            size={"sm:max-w-[900px] max-h-[90vh] p-0 "}
        />
    );
}
