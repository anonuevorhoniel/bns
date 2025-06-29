import { useMediaQuery } from "usehooks-ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

export default function DialogDrawer({content, open, setOpen, size}: any) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

   if (isDesktop) {
    console.log("haha");
        return (
            <>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTitle />
                    <DialogContent className={`${size}`}>
                        <DialogHeader />
                        {content}
                        <DialogDescription />
                        <DialogFooter />
                    </DialogContent>
                </Dialog>
            </>
        );
    } else {
        return (
            <>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTitle />
                    <DrawerContent className="">
                        <div className="overflow-auto p-3">{content}</div>

                        <DrawerDescription />
                        <DrawerHeader />
                        <DrawerFooter>
                            <DrawerClose className="border-1 shadow-lg rounded-lg p-2">
                                Close
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }
}