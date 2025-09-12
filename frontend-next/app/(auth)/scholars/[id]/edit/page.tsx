"use client";

import ax from "@/app/axios";
import { scholarResolver } from "@/app/Schema/ScholarSchema";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ScholarForm from "../../(forms)/ScholarForm";
import { useEffect, useState } from "react";
import ScholarLoad from "@/components/custom/scholar-load";

export default function Page() {
    const [delay, setDelay] = useState(true);
    const params = useParams();
    const id = params.id;

    const form = useForm<any>({
        resolver: zodResolver(scholarResolver),
    });
    const updateScholar = useMutation({
        mutationFn: async (data: any) =>
            await ax.post(`/scholars/${id}/update`, data),
        onError: (error: any) => {
            console.log(error);
            toast.error("Error", {
                description: error?.response?.data.message,
            });
        },
        onSuccess: (data: any) => {
            toast.success("Success", { description: data?.data.message });
            console.log(data);
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
    });
    const handleSubmit = (data: any) => {
        updateScholar.mutate(data);
    };

    const { data, isSuccess, isError, error, isFetching } = useQuery({
        queryKey: ["editScholar", id],
        queryFn: async () => ax.get(`/scholars/${id}/edit`),
    });

    useEffect(() => {
        if (isSuccess) {
            const scholar = data?.data?.scholar;
            console.log(scholar);
            form.reset({
                ...scholar,
                with_philhealth: scholar.classification != null ? "Yes" : "No",
                place_of_assignment:
                    scholar.place_of_assignment != "BNS Coordinator"
                        ? "same_as_barangay"
                        : "BNS Coordinator",
            });
            const timer = setTimeout(() => {
                setDelay(false);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    if (isError) {
        console.log(error);

        return (
            <>
            There seems to be a problem with the data, please try again
                later
            </>
        );
    }

    if (isFetching || delay) {
        return <ScholarLoad />;
    }

    return (
        <>
            <title>BNS | Create Scholar</title>
            <Card className="px-6">
                <ScholarForm
                    form={form}
                    isPending={updateScholar.isPending}
                    handleSubmit={handleSubmit}
                />
            </Card>
        </>
    );
}
