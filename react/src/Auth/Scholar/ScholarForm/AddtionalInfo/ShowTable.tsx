import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdditionalInfo, UseGetScholar, UseScholarShow } from "@/Actions/ScholarAction";
import "ldrs/react/Ring2.css";
import LabelLoad from "@/Reusable/LabelLoad";
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
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

export function ShowTable() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { fullName } = UseScholarShow();
    const {show, setShow} = AdditionalInfo();
    const {setCode} = UseGetScholar();

    useEffect(() => {
        setCode()
    }, [])
    

    const content = (
        <>
            <div className="h-[60vh] overflow-auto">
            </div>
        </>
    );

    if (isDesktop)
        return (
            <Dialog open={show} onOpenChange={setShow}>
                <DialogContent className="min-w-50 xs:min-w-10 max-h-170 overflow-auto">
                    <DialogDescription />
                    <DialogHeader />
                    <DialogTitle />
                    {content}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );

    if (!isDesktop)
        return (
            <Drawer open={show} onOpenChange={setShow}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            <div className="flex gap-3 border-1 rounded-lg p-3 shadow-lg -translate-y-0.5 justify-center items-center ">
                                <div>
                                    <img
                                        src={user}
                                        className="h-10 rounded-full shadow-lg"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <Label className="font-bold text-shadow-md">
                                        <LabelLoad
                                            value={fullName && fullName}
                                        />
                                    </Label>
                                </div>
                            </div>
                        </DrawerTitle>
                        <DrawerDescription />
                    </DrawerHeader>
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
