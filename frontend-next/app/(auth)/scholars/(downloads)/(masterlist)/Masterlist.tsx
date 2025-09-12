import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import ax from "@/app/axios";
import { toast } from "sonner";
import { useMasterlist } from "@/app/global/scholars/downloads/useMasterlist";
import { masterlistDirectoryResolver } from "@/app/Schema/DirectorySchema";
import MasterlistDirectoryForm from "../directory/masterlist-directory-form";

export default function Masterlist() {
    const { open, setOpen } = useMasterlist();
    const form = useForm<any>({
        resolver: zodResolver(masterlistDirectoryResolver),
    });

    const masterlistDownload = useMutation({
        mutationFn: async (data: any) =>
            await ax.post("/scholars/masterlist/download", data, {responseType: "blob"}),
        onError: (error: any) => {
            toast.error("Error", {
                description: error?.response?.data?.message,
            });
            console.log(error);
        },
        onSuccess: (data) => {
            const url = URL.createObjectURL(data.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Masterlist.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Success", {
                description: "Masterlist Downloading..",
            });
            console.log(data);
        },
    });

    const handleSubmit = (data: any) => {
        masterlistDownload.mutate(data);
    };
    return (
        <ResponsiveDialog open={open} setOpen={setOpen} title="Masterlist">
            <MasterlistDirectoryForm
                form={form}
                isPending={masterlistDownload.isPending}
                handleSubmit={handleSubmit}
            />
        </ResponsiveDialog>
    );
}
