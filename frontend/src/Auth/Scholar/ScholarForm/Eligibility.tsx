import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus,  Trash2 } from "lucide-react";

export default function Elegibility({ eligibilities, setEligibilities }: any) {
    const setEligibility = (e: any) => {
        setEligibilities((prev: any) => [...prev, e]);
    };

    const removeEligibilities = (id: any) => {
        let updated = eligibilities.filter((e: any) => e.id != id);
        setEligibilities(updated);
    };

    const updateEligibilities = (id: any, value: any) => {
        let updated = eligibilities.map((el: any) => {
            return el.id == id ? { id: id, value: value } : el;
        });
        setEligibilities(updated);
    };

    const AddEligibility = () => {
        let id = Date.now();
        let obj = { id: id, value: "" };
        setEligibility(obj);
    };
    return (
        <>
            <div className="space-y-4 p-4">
                <div className="flex justify-between">
                    <p className="text-xl">Eligibilities</p>
                    <Button
                        variant={"primary"}
                        className="h-8 text-xs"
                        type="button"
                        onClick={() => AddEligibility()}
                    >
                        <CirclePlus /> Add
                    </Button>
                </div>
                {(eligibilities?.length == 0 || eligibilities?.length == undefined) && (
                    <div className="min-h-[120px] flex items-center justify-center">No Eligibilities</div>
                )}
                {eligibilities &&
                    eligibilities?.map((ev: any) => (
                        <div className="flex gap-2 mt-2" key={ev?.id}>
                            <Label className="mb-2">Name</Label>
                            <Input
                                placeholder="--Eligibility Name--"
                                type="text"
                                value={ev.value}
                                onInput={(e: any) => {
                                    updateEligibilities(ev.id, e.target.value);
                                }}
                                required
                            />
                            <Button
                                variant="destructive"
                                // onClick={() => removeInput(ev.id)}
                                onClick={() => removeEligibilities(ev.id)}
                                type="button"
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    ))}
            </div>
        </>
    );
}
