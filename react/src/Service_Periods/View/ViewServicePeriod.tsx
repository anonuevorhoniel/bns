import DialogDrawer from "@/Reusable/DialogDrawer";
import { UseViewServicePeriod } from "../Actions/ServicePeriodAction";
import { Badge } from "@/components/ui/badge";

export default function ViewServicePeriod() {
    const {viewOpen, setViewOpen} = UseViewServicePeriod();
    const content = <>
    <Badge></Badge>
    </>

    return <DialogDrawer open={viewOpen} setOpen={setViewOpen} content={"a"} />
}