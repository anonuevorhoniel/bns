import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CirclePlus, School, Trash2 } from "lucide-react";

export default function Training({trainings, setTrainings}: any) {

    const AddTrainings = () => {
        const id = Date.now();
        const obj = { id: id, name: "", date: "", trainor: "" };
        setTrainings((prev: any) => [...prev, obj]);
    };

    const removeTraining = (id: any) => {
        const removed = trainings.filter((e: any) => e.id != id);
        setTrainings(removed);
    };

    const updateTraining = (name: any, value: any, id: any) => {
       const updated = trainings.map((t: any) => {
            return t.id == id ? { ...t, [name]: value } : t;
        });
        setTrainings(updated)
    };

    return (
        <>
            <Card className="p-0 mt-5 pb-5 w-full">
                <CardTitle className="p-3 bg-muted rounded-tl-lg rounded-tr-lg flex justify-between">
                    <p className="text-blue-900 flex items-center">
                        <School className="mr-3" /> Training
                    </p>
                    <Button
                        variant={"primary"}
                        className="h-8 text-xs"
                        type="button"
                        onClick={() => AddTrainings()}
                    >
                        <CirclePlus /> Add
                    </Button>
                </CardTitle>
                <CardContent>
                    {trainings &&
                        trainings?.map((training: any) => {
                            return (
                                <div key={training.id}>
                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                                        <div>
                                            <Label className="mb-2">Name</Label>
                                            <Input
                                                placeholder="--Training Name--"
                                                type="text"
                                                required
                                                value={training.name}
                                                onInput={(e: any) =>
                                                    updateTraining(
                                                        "name",
                                                        e.target.value,
                                                        training.id
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-2">Date</Label>
                                            <Input
                                                placeholder="--Date--"
                                                type="date"
                                                required
                                                value={training.date}
                                                  onInput={(e: any) =>
                                                    updateTraining(
                                                        "date",
                                                        e.target.value,
                                                        training.id
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-2">
                                                Trainor
                                            </Label>
                                            <Input
                                                placeholder="--Trainor--"
                                                type="text"
                                                required
                                                value={training.trainor}
                                                  onInput={(e: any) =>
                                                    updateTraining(
                                                        "trainor",
                                                        e.target.value,
                                                        training.id
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Button
                                                size={"icon"}
                                                className="mt-5"
                                                variant={"destructive"}
                                                type="button"
                                                onClick={() =>
                                                    removeTraining(training.id)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </div>
                                    <Separator className="mt-6 mb-6" />
                                </div>
                            );
                        })}
                </CardContent>
            </Card>
        </>
    );
}
