import { useCreateServicePeriod } from "@/app/global/service-periods/useCreateServicePeriod";
import { servicePeriodResolver } from "@/app/Schema/ServicePeriodSchema";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ServicePeriodForm from "../(forms)/ServicePeriodForm";
import { useMutation } from "@tanstack/react-query";
import ax from "@/app/axios";
import { toast } from "sonner";

export default function CreateServicePeriod() {
    const { open, setOpen } = useCreateServicePeriod();
    const form = useForm<any>({
        resolver: zodResolver(servicePeriodResolver),
    });
    const handleSubmit = () => {};

    const storeServicePeriod = useMutation({
        mutationFn: async (data: any) =>
            await ax.post("/service_periods/store", data),
        onSuccess: (data) => {
            console.log(data);
            toast.success("Success", { description: "Service Period Added!" });
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
            className="min-w-[600px]"
        >
            <ServicePeriodForm
                form={form}
                isPending={storeServicePeriod.isPending}
                handleSubmit={handleSubmit}
            />
        </ResponsiveDialog>
    );
}
