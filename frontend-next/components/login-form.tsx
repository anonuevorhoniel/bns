"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginResolver } from "@/app/Schema/LoginSchema";
import FormFieldComponent from "./custom/form-field";
import { useMutation } from "@tanstack/react-query";
import ax from "@/app/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/app/global/user/useUser";
import ButtonLoad from "./custom/button-load";

export function LoginForm() {
    const router = useRouter();
    const { setUser } = useUser();
    const userLogin = useMutation({
        mutationFn: async (data) => await ax.post("/users/authenticate", data),
        onSuccess: (data: any) => {
            router.push("/dashboard");
            console.log(data);
            setUser({
                email: data?.data?.user?.email,
                name: data?.data?.user?.name,
            });
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error?.response.data?.message,
            });
        },
    });
    const form = useForm<any>({
        resolver: zodResolver(loginResolver),
    });
    const handleSubmit = (data: any) => {
        console.log(data);
        userLogin.mutate(data);
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">
                        Barangay Nutrition Scholar
                    </h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormFieldComponent
                        form={form}
                        name="email"
                        label="Email"
                    />
                    <FormFieldComponent
                        form={form}
                        type="password"
                        name="password"
                        label="Password"
                    />
8                    <ButtonLoad
                        isPending={userLogin.isPending}
                        label="Login"
                        className="w-full"
                    />
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                        Sign up
                    </a>
                </div>
            </form>
        </Form>
    );
}
