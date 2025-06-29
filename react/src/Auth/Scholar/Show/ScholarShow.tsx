import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { ViewScholar } from "../ScholarState";
import user from "../../../../public/user.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseScholarShow } from "@/Actions/ScholarAction";
import "ldrs/react/Ring2.css";
import LabelLoad from "@/Reusable/LabelLoad";
import PersonalInformationTab from "./PersonalInformationTab";
import {
    Briefcase,
    CheckCircle,
    Clock,
    GraduationCap,
    Phone,
    User,
} from "lucide-react";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";


export function ScholarShow() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { show, setShow } = ViewScholar();
    const { fullName } = UseScholarShow();

    const content = (
        <>
                   <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-4 border-white/20">
                                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                                <AvatarFallback className="bg-blue-500 text-white text-xl font-semibold">
                                   J
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {fullName}
                                </h2>
                                <p className="text-blue-100 flex items-center gap-2 mt-1">
                                    <Phone className="h-4 w-4" />
                                    cnum
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
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-center py-12">
                                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Employment History
                                            </h3>
                                            <p className="text-gray-600">
                                                Employment information will be
                                                displayed here.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="service" className="p-6">
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-center py-12">
                                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Service Periods
                                            </h3>
                                            <p className="text-gray-600">
                                                Service period information will
                                                be displayed here.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="trainings" className="p-6">
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-center py-12">
                                            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Training Records
                                            </h3>
                                            <p className="text-gray-600">
                                                Training information will be
                                                displayed here.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="eligibilities" className="p-6">
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="text-center py-12">
                                            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Eligibilities
                                            </h3>
                                            <p className="text-gray-600">
                                                Eligibility information will be
                                                displayed here.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
        </>
    );
    // max-w-[805px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1205px]
    if (isDesktop)
        return (
            <Dialog open={show} onOpenChange={setShow}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden">
                    {content}
                    <div className="border-t bg-gray-50/50 px-6 py-4 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShow(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );

    if (!isDesktop)
        return (
            <Drawer open={show} onOpenChange={setShow}>
                <DrawerContent className="p-3">
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
