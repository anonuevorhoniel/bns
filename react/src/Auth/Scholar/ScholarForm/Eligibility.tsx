import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Elegibility({eligibilities, setEligibilities}: any) {


    const setEligibility = (e: any) => {
        setEligibilities((prev: any) => [...prev, e]);
    };

    useEffect(() => {
        console.log(eligibilities);
    }, [eligibilities]);

    // const clearEligibilities = () => set({ eligibilities: [] });

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
            <Card className="p-0 mt-5 pb-5">
                <CardTitle className="p-3 bg-muted rounded-tl-lg rounded-tr-lg flex justify-between">
                    <p className="text-blue-900 flex items-center">
                        <ShieldCheck className="mr-3" /> Eligibilities
                    </p>
                    <Button
                        variant={"primary"}
                        className="h-8 text-xs"
                        type="button"
                        onClick={() => AddEligibility()}
                    >
                        <CirclePlus /> Add
                    </Button>
                </CardTitle>
                <CardContent>
                    {eligibilities &&
                        eligibilities?.map((ev: any) => (
                            <div className="flex gap-2 mt-2" key={ev?.id}>
                                <Label className="mb-2">Name</Label>
                                <Input
                                    placeholder="--Eligibility Name--"
                                    type="text"
                                    onInput={(e: any) => {
                                        updateEligibilities(
                                            ev.id,
                                            e.target.value
                                        );
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
                        ))
                        }
                </CardContent>
            </Card>
        </>
    );
}
