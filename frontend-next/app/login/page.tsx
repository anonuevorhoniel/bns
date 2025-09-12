import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import Provider from "../providers";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import logo from "../../public/images/laguna.png";

export default function LoginPage() {
    return (
        <>
            <title>BNS | Login</title>
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a
                            href="#"
                            className="flex md:hidden items-center gap-2 font-medium"
                        >
                            <Image src={logo} className="w-15 h-15" alt="Laguna Logo"/>
                            <Label className="font-bold text-lg">Provincial Nutrition Action Office of Laguna</Label>
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <Provider>
                                <LoginForm />
                            </Provider>
                        </div>
                    </div>
                </div>
                <div className="bg-muted relative hidden lg:block">
                    <div className="min-h-screen flex justify-center items-center">
                        <div className="flex flex-col items-center gap-3">
                            <Image
                                src={logo}
                                alt="Laguna Logo"
                                className="w-30 h-30"
                            />
                            <Label className="font-bold text-xl text-center ">
                                Provincial Nutrition Action <br /> Office Laguna
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
