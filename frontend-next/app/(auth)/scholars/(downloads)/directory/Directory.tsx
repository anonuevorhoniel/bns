import { useDirectory } from "@/app/global/scholars/downloads/useDirectory";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import ax from "@/app/axios";
import { toast } from "sonner";
import { masterlistDirectoryResolver } from "@/app/Schema/DirectorySchema";
import MasterlistDirectoryForm from "./masterlist-directory-form";

export default function Directory() {
    const { open, setOpen } = useDirectory();
    const form = useForm<any>({
        resolver: zodResolver(masterlistDirectoryResolver),
    });
    const directoryDownload = useMutation({
        mutationFn: async (data: any) =>
            await ax.post("/scholars/directory/download", data, {
                responseType: "blob",
            }),
        onError: (error: any) => {
            toast.error("Error", {
                description: error?.response?.data?.message,
            });
        },
        onSuccess: (data) => {
            const url = URL.createObjectURL(data?.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Directory.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Success", {
                description: "Directory Downloading..",
            });
        },
    });
    const handleSubmit = (data: any) => {
        directoryDownload.mutate(data);
    };
    return (
        <ResponsiveDialog open={open} setOpen={setOpen} title="Directory">
            <MasterlistDirectoryForm
                form={form}
                isPending={directoryDownload.isPending}
                handleSubmit={handleSubmit}
            />
        </ResponsiveDialog>
    );
}
