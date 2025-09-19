import ax from "@/app/axios";
import { useRates } from "@/app/global/payrolls/rates/useRates";
import DataTable from "@/components/custom/datatable";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import RateForm from "../(form)/RateForm";
import { toast } from "sonner";
import { AlertDialogComponent } from "@/components/custom/alert-dialog";

export default function Rates() {
    const { open, setOpen } = useRates();
    const [page, setPage] = useState(1);
    const [view, setView] = useState("view");
    const qclient = useQueryClient();
    const [alertDelete, setAlertDelete] = useState(false);
    const [rateId, setRateId] = useState();

    const form = useForm<any>({
        resolver: zodResolver(
            z.object({
                rate: z.string({ error: "Rate is required" }),
            })
        ),
    });

    const handleSubmit = (data: any) => {
        storeRate.mutate(data);
    };

    const storeRate = useMutation({
        mutationFn: async (data) => await ax.post("/rates/store", data),
        onSuccess: () => {
            toast.success("Rate Added");
            qclient.invalidateQueries({
                queryKey: ["rates"],
            });
            qclient.invalidateQueries({
                queryKey: ["ratesAll"],
            });
            setView("view");
            form.reset();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message);
            console.log(error);
        },
    });

    const deleteRate = useMutation({
        mutationFn: async () => await ax.post(`/rates/${rateId}/destroy`),
        onSuccess: () => {
            setAlertDelete(false);
            toast.warning("Rate has been deleted");
            qclient.invalidateQueries({
                queryKey: ["rates"],
            });
            qclient.invalidateQueries({
                queryKey: ["ratesAll"],
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message);
        },
    });

    const {
        data: rates,
        isFetching,
        isSuccess,
    } = useQuery({
        queryKey: ["ratesAll"],
        queryFn: async () => await ax.post("/rates/all", { page: page }),
        refetchOnWindowFocus: false,
    });

    const columns = [
        {
            accessKey: "rate",
            header: "Rate",
        },
        {
            header: "Action",
            cell: (item: any) => (
                <Button
                    size={"sm"}
                    variant={"destructive"}
                    onClick={() => {
                        setAlertDelete(true);
                        setRateId(item.id);
                    }}
                >
                    <Trash2 />
                </Button>
            ),
        },
    ];

    const ViewComponent = () => (
        <>
            <div>
                <Button onClick={() => setView("create")}>
                    <Plus /> Add Rate
                </Button>
            </div>
            <DataTable
                data={rates?.data?.rates}
                columns={columns}
                page={page}
                setPage={setPage}
                pagination={rates?.data?.pagination}
                isFetching={isFetching}
            />
        </>
    );

    const CreateComponent = () => (
        <>
            <div>
                <Button onClick={() => setView("view")}>Back</Button>
                <div className="mt-5">
                    <RateForm
                        form={form}
                        handleSubmit={handleSubmit}
                        isPending={storeRate.isPending}
                    />
                </div>
            </div>
        </>
    );

    return (
        <ResponsiveDialog open={open} setOpen={setOpen} title="Rates">
            {view == "view" ? ViewComponent() : CreateComponent()}
            <AlertDialogComponent
                open={alertDelete}
                setOpen={setAlertDelete}
                isPending={deleteRate.isPending}
                onContinue={() => deleteRate.mutate()}
            />
        </ResponsiveDialog>
    );
}
