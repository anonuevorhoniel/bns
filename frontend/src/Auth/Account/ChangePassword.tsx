import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { UseAccountAction } from "@/Actions/AccountAction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import FormHandler from "@/Reusable/FormHandler";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    passwordDefaultValues,
    PasswordSchema,
} from "@/Validation/AccountSchema";
import ButtonLoad from "@/Reusable/ButtonLoad";
export default function ChangePassword() {
    const { setPasswordForm, changePassword } =
        UseAccountAction();

    const UsePasswordForm = useForm({
        defaultValues: passwordDefaultValues,
        resolver: zodResolver(PasswordSchema),
    });

    const passwordMutation = useMutation({
        mutationFn: () => changePassword(),
        onSuccess: () => {
            toast.success("Success", {
                description: "Password has been changed!",
            });
        },
        onError: (error: any) => {
            toast.error("Error", { description: error.response.data.message });
            console.log(error);
        },
    });
    const handlePasswordSubmit = () => {
        passwordMutation.mutate();
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...UsePasswordForm}>
                        <form
                            onSubmit={UsePasswordForm.handleSubmit(
                                handlePasswordSubmit
                            )}
                            className="space-y-4"
                        >
                            <FormHandler
                                name="password"
                                label="Current Password"
                                schemaForm={UsePasswordForm}
                                type="password"
                                setForm={setPasswordForm}
                            />

                            <FormHandler
                                name="newPassword"
                                label="New Password"
                                schemaForm={UsePasswordForm}
                                type="password"
                                setForm={setPasswordForm}
                            />

                            <FormHandler
                                name="confirmNewPassword"
                                label="Confirm New Password"
                                schemaForm={UsePasswordForm}
                                type="password"
                                setForm={setPasswordForm}
                            />

                            <ButtonLoad
                                loading={passwordMutation.isPending}
                                name="Update Password"
                                classNames="w-full"
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
