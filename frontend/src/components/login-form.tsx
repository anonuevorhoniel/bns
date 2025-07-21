import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import laguna from "../../public/laguna.png";
import loginbg from "../../public/login-bg.jpg";
import { UseLogin } from "@/Actions/LoginAction";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm() {
    const { setLogin, loading, authenticate } = UseLogin();
    const nav = useNavigate();

    const handleSubmit = () => {
        authenticate(nav);
    };

    const fschema = z.object({
        email: z
            .string()
            .email({ message: "The Email field is Invalid" })
            .trim(),
        password: z
            .string()
            .min(8, { message: "Password requires atleast 8 characters" })
            .trim(),
    });

    type formData = z.infer<typeof fschema>;
    const form = useForm<formData>({
        resolver: zodResolver(fschema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                <Form {...form}>
                    <form
                        className="p-6 md:p-8"
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <div className="flex flex-col gap-6 pb-5">
                            <div className="flex flex-col items-center text-center">
                                <img src={laguna} className="w-20" alt="" />
                                <h1 className="text-2xl font-bold">
                                    Welcome back
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to BNS Account
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    placeholder="Enter Email"
                                                    onInput={(e) => {
                                                        setLogin({
                                                            email: (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        });
                                                    }}
                                                    required
                                                    {...field}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                ></FormField>
                            </div>
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    placeholder="Enter Password"
                                                    onInput={(e) => {
                                                        setLogin({
                                                            password: (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        });
                                                    }}
                                                    type="password"
                                                    required
                                                    {...field}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                variant={"primary"}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Ring
                                        size="25"
                                        stroke="5"
                                        bgOpacity="0"
                                        speed="2"
                                        color="white"
                                    />
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
                <div className="relative flex flex-col sm:invisible invisible lg:visible xl:visible md:visible justify-center items-center bg-muted ">
                    <img
                        src={loginbg}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover z-0 dark:brightness-[0.2] dark:grayscale"
                    />
                    {/* Content Layer */}
                    <div className="relative z-10 flex flex-col justify-center items-center">
                        <div className="text-xs font-bold text-green-600">
                            Provincial Nutrition Action Office
                        </div>
                        <div className="text-blue-900 text-2xl p-5 text-center font-bold">
                            BARANGAY NUTRITION SCHOLAR (BNS)
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
