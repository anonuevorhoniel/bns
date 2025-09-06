import { UseAccountAction } from "@/Actions/AccountAction";
import { UseAuth } from "@/Actions/AuthAction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonLoad from "@/Reusable/ButtonLoad";
import FormHandler from "@/Reusable/FormHandler";
import { emailDefaultValues, emailSchema } from "@/Validation/AccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ChangeEmail({}: any) {
    const { user } = UseAuth();
    const qclient = useQueryClient();

    const useEmailForm = useForm({
        defaultValues: emailDefaultValues,
        resolver: zodResolver(emailSchema),
    });

    const { emailForm, setEmailForm, changeEmail, clearEmailForm } =
        UseAccountAction();

    const emailMutation = useMutation({
        mutationFn: changeEmail,
        onSuccess: () => {
            qclient.invalidateQueries({ queryKey: ["auth"] });
            setTimeout(() => {
                toast.success("Success", { description: "Email Changed!" });
            }, 400);
            setEmailForm({ name: "currentEmail", value: emailForm?.newEmail });
            useEmailForm.reset();
            clearEmailForm();
        },
        onError: (error: any) => {
            toast.error("Error", { description: error.response.data.message });
        },
    });

    let emailPending = emailMutation.isPending;

    const handleEmailSubmit = () => {
        emailMutation.mutate();
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Change Email Address
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...useEmailForm}>
                        <form
                            onSubmit={useEmailForm?.handleSubmit(
                                handleEmailSubmit
                            )}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="current-email">
                                    Current Email
                                </Label>
                                <Input
                                    id="current-email"
                                    type="email"
                                    value={
                                        emailForm?.currentEmail
                                            ? emailForm?.currentEmail
                                            : user?.email
                                    }
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <FormHandler
                                name="newEmail"
                                label="New Email Address"
                                schemaForm={useEmailForm}
                                setForm={setEmailForm}
                            />
                            <FormHandler
                                name="confirmNewEmail"
                                label="Confirm New Email Address"
                                schemaForm={useEmailForm}
                                setForm={setEmailForm}
                            />
                            <FormHandler
                                name="password"
                                label="Password"
                                schemaForm={useEmailForm}
                                setForm={setEmailForm}
                                type="password"
                            />
                            <ButtonLoad
                                loading={emailPending}
                                name="Update Email Address"
                                classNames="w-full"
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
