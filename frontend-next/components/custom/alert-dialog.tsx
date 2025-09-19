import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ButtonLoad from "./button-load";

export function AlertDialogComponent({
    open,
    setOpen,
    isPending,
    onContinue
}: {
    open: boolean;
    setOpen: any;
    isPending: boolean
    onContinue: any
}) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this?
                    </AlertDialogTitle>
                    {/* <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </AlertDialogDescription> */}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <ButtonLoad isPending={isPending} label="Continue" onClick={onContinue} />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
