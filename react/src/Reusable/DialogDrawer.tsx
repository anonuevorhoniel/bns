import { useMediaQuery } from "usehooks-ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
export default function DialogDrawer({ content, open, setOpen, size }: any) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${size}`}>
          {content}
          <div className="flex justify-end px-5">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
            <DialogTitle />
            <DialogDescription />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-3">
          {content}
          <DrawerFooter>
            <DrawerClose className="border shadow-lg rounded-lg p-2">
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
}
