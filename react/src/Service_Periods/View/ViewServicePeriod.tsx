import DialogDrawer from "@/Reusable/DialogDrawer";
import { UseViewServicePeriod } from "../Actions/ServicePeriodAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { CirclePlus, Clock, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import ServicePeriodViewTab from "./Tabs/ServicePeriodViewTab";
import ServicePeriodCreateTab from "./Tabs/ServicePeriodCreateTab";
import { Separator } from "@/components/ui/separator";

export default function ViewServicePeriod() {
    const { viewOpen, setViewOpen, dataView } = UseViewServicePeriod();
    const content = (
        <div className="space-y-2">
            <div className=" relative bg-gradient-to-r from-slate-600 to-slate-700 text-white px-5 rounded-tl-lg rounded-tr-lg py-5">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-white/20 ">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" />
                        <AvatarFallback className="bg-white text-black text-xl font-semibold">
                            {(dataView != null && dataView?.[0]) && dataView?.[0].full_name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-bold">
                            {(dataView != null &&  dataView?.[0]) && dataView?.[0].full_name}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="px-5 py-3 space-y-2">
                <div className="flex items-center gap-3">
                    <Clock size={20} color="blue" />
                    <Label className="text-lg">Service Periods</Label>
                </div>

                <div>
                    <Tabs defaultValue="data">
                        <TabsList>
                            <TabsTrigger value="data">
                                <Eye /> View
                            </TabsTrigger>
                            <TabsTrigger value="create">
                                <CirclePlus /> Create
                            </TabsTrigger>
                        </TabsList>
                <Separator />

                        <TabsContent value="data">
                            <ServicePeriodViewTab />
                        </TabsContent>
                        <TabsContent value="create">
                            <ServicePeriodCreateTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );

    return (
        <DialogDrawer
            open={viewOpen}
            setOpen={setViewOpen}
            content={content}
            size={"p-0 md:max-w-[800px]"}
        />
    );
}
