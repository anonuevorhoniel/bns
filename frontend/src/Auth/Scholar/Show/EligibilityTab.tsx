import { UseScholarShow } from "@/Actions/ScholarAction";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle, FolderPen } from "lucide-react";

export default function EligibilityTab() {
    const { eligibilities } = UseScholarShow();
    return (
        <>
            <Card className="px-6">
                <div className="flex justify-between">
                    <Label className="font-medium text-lg">
                        <div className="bg-green-200 rounded-md h-8 w-8 flex justify-center items-center">
                            <CheckCircle className="text-green-600" size={15} />
                        </div>{" "}
                        Eligibility Records
                    </Label>
                    <Badge
                        variant={"outline"}
                        className="text-green-500 border-green-500 hover:text-white hover:bg-green-500"
                    >
                        <CheckCircle /> {eligibilities?.length} Total
                        Eligibilities
                    </Badge>
                </div>
                <div>
                    {eligibilities?.length > 0 && (
                        <div className="flex justify-center gap-1 bg-muted items-center p-2">
                            <FolderPen
                                className="text-md opacity-70"
                                size={15}
                            />
                            <Label className="text-md opacity-70">Name</Label>
                        </div>
                    )}

                    {eligibilities?.length > 0 &&
                        eligibilities?.map((e: any) => {
                            return (
                                <div className="flex justify-center border-t-1 py-2">
                                    <label className="font-medium text-md">
                                        {e.name}
                                    </label>
                                </div>
                            );
                        })}
                </div>
                {eligibilities?.length == 0 && (
                    <CardContent className="p-5">
                        <div className="text-center">
                            <div className="flex justify-center items-center">
                               <div className="bg-muted p-3 rounded-full"> <CheckCircle className=" text-gray-400" /></div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
                                No Eligibilities
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Eligibility information will be displayed here.
                            </p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </>
    );
}
