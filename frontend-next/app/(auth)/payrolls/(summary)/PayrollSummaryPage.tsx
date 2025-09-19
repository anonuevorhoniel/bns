import { usePayrollSummary } from "@/app/global/payrolls/usePayrollSummary";
import { payrollSummaryResolver } from "@/app/Schema/PayrollSummarySchema";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PayrollSummaryForm from "./(form)/PayrollSummaryForm";
import payrollMutations from "../(mutations)/payrollMutations";

export default function PayrollSummaryPage() {
    const { open, setOpen } = usePayrollSummary();
    const form = useForm<any>({
        resolver: zodResolver(payrollSummaryResolver),
    });
    const handleSubmit = (data: any) => {
        downloadSummary.mutate(data);
    };
    const { downloadSummary } = payrollMutations();

    return (
        <ResponsiveDialog
            open={open}
            setOpen={setOpen}
            title="Download Payroll Summary"
        >
            <PayrollSummaryForm
                form={form}
                handleSubmit={handleSubmit}
                isPending={downloadSummary.isPending}
            />
        </ResponsiveDialog>
    );
}
