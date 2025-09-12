"use client";

import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scholarResolver } from "@/app/Schema/ScholarSchema";
import { useMutation } from "@tanstack/react-query";
import ax from "@/app/axios";
import { toast } from "sonner";
import ScholarForm from "../(forms)/ScholarForm";
export default function Page() {
    const form = useForm<any>({
        resolver: zodResolver(scholarResolver),
    });
    const storeScholar = useMutation({
        mutationFn: async (data: any) => await ax.post("/scholars/store", data),
        onError: (error: any) => {
            console.log(error);
            toast.error("Error", {
                description: error?.response?.data.message,
            });
        },
        onSuccess: (data: any) => {
            toast.success("Success", { description: data?.data.message });
            form.reset();
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
    });
    const handleSubmit = (data: any) => {
        console.log(data);
        storeScholar.mutate(data);
    };

    return (
        <>
            <title>BNS | Create Scholar</title>
            <Card className="px-6">
                <ScholarForm
                    form={form}
                    handleSubmit={handleSubmit}
                    isPending={storeScholar.isPending}
                />
            </Card>
        </>
    );
}
