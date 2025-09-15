"use client";

import { Label } from "../ui/label";
import { Spinner } from "../ui/shadcn-io/spinner";

export default function LoadingScreen() {
    return (
        <div className="h-full w-full absolute inset-0">
            <div className="flex flex-col justify-center gap-2 h-full items-center">
              <div className="flex gap-2">
                <Spinner />  <Label>Barangay Nutrition Scholar System is loading...</Label>
              </div>
              <div className="flex">
                <Label className="text-xs">If you have any concerns, please acommodate with MISO</Label>
              </div>
            </div>
        </div>
    );
}
