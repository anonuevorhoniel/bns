import { useScholarView } from "@/app/global/scholars/useScholarView";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import StatusBar from "@/components/ui/status";
import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useEffect } from "react";

export default function ViewScholar() {
    const { scholar } = useScholarView();
    const avatar = createAvatar(lorelei, {
        seed: scholar.id,
    });

    const dataUri = avatar.toDataUri();
    return (
        <div className="rounded-md overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <Card className="m-2 py-3 pb-5">
                    <div className="space-y-2 px-4">
                        <Label className="font-bold mt-2 mb-3">
                            Personal Information
                        </Label>
                        <div className="flex items-center gap-5 mb-4">
                            <div className="border rounded-full p-2 h-20 w-20 bg-primary-foreground flex justify-center">
                                <img src={dataUri} alt="" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">
                                    {scholar.first_name} {scholar.middle_name}{" "}
                                    {scholar.last_name}
                                </Label>
                                <StatusBar inverted status={scholar.replaced} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Name on ID:</Label>
                            <Label>{scholar.name_on_id}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">ID no: </Label>
                            <Label>{scholar.id_no}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Sex: </Label>
                            <Label>{scholar.sex}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Birth Date: </Label>
                            <Label>{scholar.birth_date}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Civil Status: </Label>
                            <Label>{scholar.civil_Status}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">
                                Contact Number:{" "}
                            </Label>
                            <Label>{scholar.contact_number}</Label>
                        </div>
                    </div>
                </Card>
                <div>
                    <Card className="p-4 m-2">
                        <div className="space-y-2">
                            <Label className=" font-bold mb-4">Location</Label>
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">District: </Label>
                                <Label>{scholar.district_id}</Label>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">
                                    Municipality:{" "}
                                </Label>
                                <Label>{scholar.municity_name}</Label>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">Barangay: </Label>
                                <Label>{scholar.barangay_name}</Label>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">
                                    Complete Address:{" "}
                                </Label>
                                <Label>{scholar.complete_address}</Label>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4 m-2">
                        <div className="space-y-2">
                            <Label className=" font-bold mb-4">Fund</Label>
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">Fund: </Label>
                                <Label>{scholar.fund}</Label>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">
                                    Incentive Prov:{" "}
                                </Label>
                                <Label>{scholar.incentive_prov}</Label>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">
                                    Incentive:{" "}
                                </Label>
                                <Label>{scholar.incentive_mun}</Label>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2">
                                <Label className="opacity-70">
                                    Incentive:{" "}
                                </Label>
                                <Label>{scholar.incentive_brgy}</Label>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-4 m-2">
                    <div className="space-y-2">
                        <Label className=" font-bold mb-5">
                            Additional Information
                        </Label>
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Status: </Label>
                            <Label>{scholar.status}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">BNS Type: </Label>
                            <Label>{scholar.bns_type}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">
                                Place of Assignment:{" "}
                            </Label>
                            <Label></Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">
                                Education Attainment:{" "}
                            </Label>
                            <Label></Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">
                                First Employment Date:{" "}
                            </Label>
                            <Label>{scholar.first_employment_date}</Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Replaced: </Label>
                            <Label>{scholar?.replaced_scholar?.full_name || 'N/A'}</Label>
                        </div>
                    </div>
                </Card>

                {/* <Card className="p-4 m-2">
                    <div className="space-y-2">
                        <Label className=" font-bold">Fund</Label>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Full Name: </Label>
                            <Label></Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Full Name: </Label>
                            <Label></Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Full Name: </Label>
                            <Label></Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2">
                            <Label className="opacity-70">Full Name: </Label>
                            <Label></Label>
                        </div>
                    </div>
                </Card> */}
                <div>
                    <Card className="p-4 m-2">
                        <div className="space-y-2">
                            <Label className="font-bold">Trainings</Label>
                            {scholar?.trainings?.length == 0 ? (
                                <div className="h-10 border border-dashed rounded-lg flex justify-center items-center">
                                    <p className="text-sm">No Trainings</p>
                                </div>
                            ) : (
                                scholar?.trainings?.map(
                                    (item: any, index: number) => (
                                        <div key={item.id}>
                                            <div className="mt-5 flex flex-col gap-2">
                                                <div className="grid grid-cols-2">
                                                    <Label className="opacity-70">
                                                        Name:{" "}
                                                    </Label>
                                                    <Label>{item.name}</Label>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <Label className="opacity-70">
                                                        From Date:{" "}
                                                    </Label>
                                                    <Label>
                                                        {item.from_date}
                                                    </Label>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <Label className="opacity-70">
                                                        To Date:{" "}
                                                    </Label>
                                                    <Label>
                                                        {item.to_date}
                                                    </Label>
                                                </div>
                                                {index + 1 !==
                                                    scholar?.trainings
                                                        ?.length && (
                                                    <Separator />
                                                )}
                                            </div>
                                            {index + 1 !==
                                                scholar?.trainings?.length && (
                                                <Separator className="mt-2" />
                                            )}
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </Card>

                    <Card className="p-4 m-2">
                        <div className="space-y-2">
                            <Label className=" font-bold">Eligibilities</Label>
                            {scholar?.eligibilities?.length == 0 ? (
                                <div className="h-10 border border-dashed rounded-lg flex justify-center items-center">
                                    <p className="text-sm">No Eligibilities</p>
                                </div>
                            ) : (
                                scholar?.eligibilities?.map(
                                    (item: any, index: number) => (
                                        <div key={item.id}>
                                            <div className="mt-5 flex flex-col gap-2">
                                                <div className="grid grid-cols-2">
                                                    <Label className="opacity-70">
                                                        Name:{" "}
                                                    </Label>
                                                    <Label>{item.name}</Label>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <Label className="opacity-70">
                                                        Date:{" "}
                                                    </Label>
                                                    <Label>{item.date}</Label>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <Label className="opacity-70">
                                                        Number:{" "}
                                                    </Label>
                                                    <Label>{item.number}</Label>
                                                </div>
                                            </div>
                                            {index + 1 !==
                                                scholar?.eligibilities
                                                    ?.length && (
                                                <Separator className="mt-2" />
                                            )}
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
