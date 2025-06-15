import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ViewScholar } from "../ScholarState";
import user from "../../../../public/user.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseScholarShow } from "@/Actions/ScholarAction";
import "ldrs/react/Ring2.css";
import LabelLoad from "@/Reusable/LabelLoad";
import PersonalInformationTab from "./PersonalInformationTab";
import EmploymentStatusTab from "./EmploymentSstatusTab";
import ServicePeriodTab from "./ServicePeriodTab";
import {
    BriefcaseBusiness,
    CheckCheck,
    FileClock,
    School,
    UserCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import EligibilityTab from "./EligibilityTab";
import TrainingTab from "./TrainingTab";
import { useMediaQuery } from "usehooks-ts";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

export function ScholarShow() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { show, setShow } = ViewScholar();
    const { fullName } = UseScholarShow();

    const content = (
        <>
            <div className="h-[60vh] overflow-auto">
                <Tabs
                    defaultValue="personal_info"
                    className="flex justify-center items-center"
                >
                    <TabsList className="h-30 sm:h-20 md:h-20 lg:h-20 xl:h-20 m-2 gap-2  w-full">
                        <div className="grid xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-3 md:grid-cols-3 grid-cols-2 p-3 w-full ">
                            <TabsTrigger value="personal_info">
                                <UserCircle /> Personal Info
                            </TabsTrigger>
                            <TabsTrigger value="employment_status">
                                <BriefcaseBusiness /> Employment
                            </TabsTrigger>
                            <TabsTrigger value="service_periods">
                                <FileClock /> Service Periods
                            </TabsTrigger>
                            <TabsTrigger value="trainings">
                                <School /> Trainings
                            </TabsTrigger>
                            <TabsTrigger value="eligibilities">
                                <CheckCheck /> Eligibilities
                            </TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent value="personal_info">
                        <PersonalInformationTab />
                    </TabsContent>
                    <TabsContent value="employment_status">
                        <EmploymentStatusTab />
                    </TabsContent>
                    <TabsContent value="service_periods">
                        <ServicePeriodTab />
                    </TabsContent>
                    <TabsContent value="trainings">
                        <TrainingTab />
                    </TabsContent>
                    <TabsContent value="eligibilities">
                        <EligibilityTab />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );

    if (isDesktop)
        return (
            <Dialog open={show} onOpenChange={setShow}>
                <DialogContent className="min-w-50 xs:min-w-10 max-h-170 overflow-auto">
                    <DialogDescription />
                    <DialogHeader>
                        <div className="flex border-b-1 justify-center items-center pb-2">
                            <div className="flex gap-3 border-1 rounded-lg p-3 shadow-lg -translate-y-0.5 justify-center items-center ">
                                <div>
                                    <img
                                        src={user}
                                        className="h-10 rounded-full shadow-lg"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <Label className="font-bold text-shadow-md">
                                        <LabelLoad
                                            value={fullName && fullName}
                                        />
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogTitle />
                    {/* <Card className="relative flex items-center"> */}
                    {content}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );

    if (!isDesktop)
        return (
            <Drawer open={show} onOpenChange={setShow}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            <div className="flex gap-3 border-1 rounded-lg p-3 shadow-lg -translate-y-0.5 justify-center items-center ">
                                <div>
                                    <img
                                        src={user}
                                        className="h-10 rounded-full shadow-lg"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <Label className="font-bold text-shadow-md">
                                        <LabelLoad
                                            value={fullName && fullName}
                                        />
                                    </Label>
                                </div>
                            </div>
                        </DrawerTitle>
                        <DrawerDescription />
                    </DrawerHeader>
                    {content}
                    <DrawerFooter>
                        <DrawerClose className="border-1 shadow-lg rounded-lg p-2">
                            Close
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
}
