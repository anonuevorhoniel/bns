"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import Head from "next/head";
import { ReactNode } from "react";

export default function ContentLayout({
    title,
    children,
    buttonEvent,
}: {
    title: string;
    children: ReactNode;
    buttonEvent: any;
}) {
    return (
        <>
            <Head>
                <title>BNS | {title}</title>
            </Head>
            <div>
                <Button onClick={buttonEvent}>
                    <Plus /> Add {title}
                </Button>
            </div>
            <Card className="px-6">
                {/* <div className="flex justify-between">
                    <Label className="text-2xl font-bold">{title}</Label>
                </div> */}
                {children}
            </Card>
        </>
    );
}
