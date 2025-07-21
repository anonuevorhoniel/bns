import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Toaster } from "sonner";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import { useEffect, useState } from "react";
import { UseLayout } from "@/Actions/LayoutAction";

export default function Account() {
    const { setItem, setBItem } = UseLayout();
    useEffect(() => {
        setItem("Account");
        setBItem(null);
    }, []);


    return (
        <div className="min-h-screen py-8">
            <Toaster />
            <title>BNS | Account</title>
            <div className="container px-4">
                <Card className="border-blue-200 bg-blue-50 py-3 mb-5">
                    <CardContent className="">
                        <div className="flex items-start gap-3">
                            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">
                                    Security Tips
                                </h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>
                                        • Use a strong, unique password for your
                                        account
                                    </li>
                                    {/* <li>• Enable two-factor authentication for extra security</li> */}
                                    <li>
                                        • Never share your password with anyone
                                    </li>
                                    <li>• Update your password regularly</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChangeEmail />
                    <ChangePassword />
                </div>
            </div>
        </div>
    );
}
