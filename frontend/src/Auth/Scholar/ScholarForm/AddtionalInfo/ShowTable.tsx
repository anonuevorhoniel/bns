import { AdditionalInfo } from "@/Actions/ScholarAction";
import "ldrs/react/Ring2.css";
import { useEffect, useState } from "react";
import AddInfoTable from "./AddInfoTable";
import { Input } from "@/components/ui/input";
import DialogDrawer from "@/Reusable/DialogDrawer";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function ShowTable() {
    const { show, setShow } = AdditionalInfo();
    const { setCode } = AdditionalInfo();
    const [search, setSearch] = useState("");

    useEffect(() => {
        setCode();
    }, []);

    const content = (
        <>
            <div className="space-y-5">
                <Label className="text-xl">Select Scholar</Label>
                <div className="relative flex items-center text-black">
                    <Search className="absolute left-2 z-10" size={15} />
                    <Input
                        onInput={(e) =>
                            setSearch((e.target as HTMLInputElement).value)
                        }
                        className="pl-8"
                        placeholder="Search Scholars"
                        value={search}
                    />
                </div>
                <AddInfoTable search={search} />
            </div>
        </>
    );

    return (
        <DialogDrawer
            content={content}
            open={show}
            setOpen={setShow}
            size="sm:min-w-[700px] sm:max-h-[900px] overflow-auto pb-0 "
        />
    );
}
