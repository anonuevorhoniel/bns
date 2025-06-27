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
import {
    AdditionalInfo,
    UseGetScholar,
    UseScholarShow,
} from "@/Actions/ScholarAction";
import "ldrs/react/Ring2.css";
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
import { useEffect, useState } from "react";
import AddInfoTable from "./AddInfoTable";
import { Input } from "@/components/ui/input";
import SelectCode from "../SelectCode";

export function ShowTable() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { show, setShow } = AdditionalInfo();
    // const { setCode } = UseGetScholar();
    const [open, setOpen] = useState();
    const {code, setCode} = AdditionalInfo();

    useEffect(() => {
        setCode();
    }, []);

    const content = (
        <>
            <div className="h-[60vh] overflow-auto">
                <AddInfoTable />
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
                    <div className="grid gap-3 grid-cols-2 gap-3 ">
                        <SelectCode open={open} setOpen={setOpen} />
                        <Input placeholder="Search" />
                    </div>
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
                        <DrawerTitle />
                        <DrawerDescription />
                    </DrawerHeader>
                     <div className="grid gap-3 grid-cols-2 gap-3 ">
                        <Input placeholder="Search" />
                    </div>
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
