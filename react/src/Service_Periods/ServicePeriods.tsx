import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CirclePlus } from "lucide-react";
import ServicePeriodTable from "./ServicePeriodTable";

export default function ServicePeriods() {
    return (
        <>
            <title>BNS | Service Periods</title>
            <Card className="p-0">
                <CardHeader className="p-3 bg-muted rounded-tl-lg rounded-tr-lg">
                    <div>
                        <Button variant={"primary"}>
                            <CirclePlus /> Service Periods
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ServicePeriodTable />
                </CardContent>
            </Card>
        </>
    );
}
