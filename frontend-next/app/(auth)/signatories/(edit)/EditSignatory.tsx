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
import { useEditSignatory } from "@/app/global/signatories/useEditSignatory";
import { useEffect } from "react";

export default function EditSignatory() {
    const { open, setOpen, signatory } = useEditSignatory();
    const cquery = useQueryClient();
    const editSignatory = useMutation({
        mutationFn: async (data: any) =>
            await ax.post(`/signatories/${signatory?.id}/update`, data),
        onSuccess: (data) => {
            setOpen(false);
            form.reset();
            toast.success("Signatory Updated");
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

    useEffect(() => {
        form.reset({
            ...signatory,
        });
    }, [signatory?.id]);

    const handleSubmit = (data: any) => {
        editSignatory.mutate(data);
    };

    return (
        <ResponsiveDialog open={open} setOpen={setOpen} title="Edit Signatory">
            <SignatoryForm
                form={form}
                handleSubmit={handleSubmit}
                isPending={editSignatory.isPending}
            />
        </ResponsiveDialog>
    );
}
