import ax from "@/app/axios";
import { useDownload } from "@/app/global/scholars/downloads/useDowload";
import useDownloadLink from "@/hooks/useDownloadLink";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function payrollMutations() {
    const { id: payrollID } = useDownload();
    const cquery = useQueryClient();

    const downloadPayroll = useMutation({
        mutationFn: async () =>
            await ax.get(
                `/payrolls/${payrollID}/download`,
                    {
                    responseType: "blob",
                }
            ),
        onSuccess: (data: any) => {
            useDownloadLink({ data: data?.data, name: "Payroll" });
            toast.success("Success", { description: "Downloading Payroll..." });
        },
        onError: (error: any) => {
            toast.error("Something went wrong");
            console.log(error);
        },
    });

    const downloadMasterlist = useMutation({
        mutationFn: async () =>
            await ax.get(`/payrolls/masterlists/${payrollID}/download`, {
                responseType: "blob",
            }),
        onSuccess: (data: any) => {
            useDownloadLink({ data: data?.data, name: "Masterlist" });
            toast.success("Success", {
                description: "Downloading Masterlist...",
            });
        },
        onError: (error: any) => {
            toast.error("Something went wrong");
        },
    });

    const approvePayroll = useMutation({
        mutationFn: async () => await ax.post(`/payrolls/${payrollID}/approve`),
        onSuccess: (data) => {
            toast.success(data?.data?.message);
            cquery.invalidateQueries({
                queryKey: ["payrolls"],
            });
        },
        onError: (err) => {
            toast.error("Something went wrong");
            console.log(err);
        },
    });

    const downloadSummary = useMutation({
        mutationFn: async (data: any) =>
            await ax.post("/payrolls/summary", data, { responseType: "blob" }),
        onSuccess: (data: any) => {
            toast.success("Downloading Summary...");
            useDownloadLink({ data: data?.data, name: "Summary_of_Payroll" });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    return {
        downloadMasterlist,
        downloadPayroll,
        approvePayroll,
        downloadSummary,
    };
}
