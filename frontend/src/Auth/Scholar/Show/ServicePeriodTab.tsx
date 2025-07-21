import { UseScholarShow } from "@/Actions/ScholarAction";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarCheck2, CalendarX2, Clock } from "lucide-react";

export default function ServicePeriodTab() {
    const { servicePeriods } = UseScholarShow();
    return (
        <>
            <Card className=" p-0 max-h-[350px]">
                <CardContent className="p-6 space-y-5">
                    <div className="flex gap-3 items-center">
                        <div className="text-blue-600">
                            <Clock />
                        </div>
                        <Label className="text-lg">Service Periods</Label>
                    </div>
                    <div>
                    {servicePeriods && servicePeriods.length > 0 && (
                        <div className="grid grid-cols-2 bg-muted">
                            <Label className="text-md opacity-70">
                              <CalendarCheck2 size={15}/>  Start Date
                            </Label>
                            <Label className="text-md opacity-70">
                               <CalendarX2 size={15}/> End Date
                            </Label>
                        </div>
                    )}

                    <div className="space-y-3">
                        {servicePeriods && servicePeriods.length > 0 ? (
                            Object.values(servicePeriods).map((sp: any) => {
                                return (
                                    <div className="grid grid-cols-2 py-2 border-t-1">
                                        <Label className="text-sm">
                                            {sp.month_from} - {sp.year_from}
                                        </Label>
                                        <Label className="text-sm">
                                            {sp.month_to > 0
                                                ? sp.month_to
                                                : <><Label className="text-md text-green-500">Present</Label></>}{" "}
                                            {sp.year_to > 0 ? sp.year_to : ""}
                                        </Label>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Service Periods
                                </h3>
                                <p className="text-gray-600">
                                    Service period information will be displayed
                                    here.
                                </p>
                            </div>
                        )}
                    </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
