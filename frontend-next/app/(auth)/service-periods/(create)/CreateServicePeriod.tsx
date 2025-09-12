import { useCreateServicePeriod } from "@/app/global/service-periods/useCreateServicePeriod";
import { servicePeriodResolver } from "@/app/Schema/ServicePeriodSchema";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ServicePeriodForm from "../(forms)/ServicePeriodForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ax from "@/app/axios";
import { toast } from "sonner";

export default function CreateServicePeriod() {
    const { open, setOpen, selectedIds, clearSelected } =
        useCreateServicePeriod();
    const form = useForm<any>({
        resolver: zodResolver(servicePeriodResolver),
    });
    const qClient = useQueryClient();

    const handleSubmit = (data: any) => {
        if (selectedIds.length == 0 || selectedIds.length == undefined) {
            toast.error("Please select atleast one scholar");
        } else {
            const newData = { ...data, members: selectedIds };
            storeServicePeriod.mutate(newData);
        }
    };

    const storeServicePeriod = useMutation({
        mutationFn: async (data: any) =>
            await ax.post("/service_periods/store", data),
        onSuccess: (data) => {
            toast.success("Success", { description: "Service Period Added!" });
            setOpen(false);
            form.reset();
            clearSelected();
            qClient.invalidateQueries({
                queryKey: ['servicePeriods']
            })
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return (
        <ResponsiveDialog
            open={open}
            setOpen={setOpen}
            title="Create Service Period"
            className="min-w-[700px] max-h-[91vh] overflow-auto"
        >
            <ServicePeriodForm
                form={form}
                isPending={storeServicePeriod.isPending}
                handleSubmit={handleSubmit}
            />
        </ResponsiveDialog>
    );
}
