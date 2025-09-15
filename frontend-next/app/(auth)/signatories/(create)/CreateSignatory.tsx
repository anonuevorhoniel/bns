import ax from "@/app/axios";
import { useCreateSignatory } from "@/app/global/signatories/useCreateSignatories";
import { signatoryResolver } from "@/app/Schema/SignatorySchema";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, UseFormReturn } from "react-hook-form";
import SignatoryForm from "../(forms)/SignatoryForm";
import { toast } from "sonner";

export default function CreateSignatory() {
    const cquery = useQueryClient();
    const storeSignatory = useMutation({
        mutationFn: async (data: any) =>
            await ax.post("/signatories/store", data),
        onSuccess: (data) => {
            setOpen(false);
            form.reset();
            toast.success("Signatory Added");
            cquery.invalidateQueries({
                queryKey: ["signatories"],
            });
        },
        onError: (error: any) => {
            if (error?.response?.status == 422) {
                toast.error(error?.response?.data?.message);
            }
        },
    });

    const form = useForm<any>({
        resolver: zodResolver(signatoryResolver),
    });

    const handleSubmit = (data: any) => {
        storeSignatory.mutate(data);
    };

    const { open, setOpen } = useCreateSignatory();
    return (
        <ResponsiveDialog
            open={open}
            setOpen={setOpen}
            title="Create Signatory"
        >
            <SignatoryForm
                form={form}
                handleSubmit={handleSubmit}
                isPending={storeSignatory.isPending}
            />
        </ResponsiveDialog>
    );
}
