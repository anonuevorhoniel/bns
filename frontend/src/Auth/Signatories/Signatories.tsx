import { UseLayout } from "@/Actions/LayoutAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CirclePlus } from "lucide-react";
import { useEffect } from "react";
import SignatoriesTable from "./SignatoriesTable";
import { UseSignatoryIndex } from "@/Actions/SignatoriesAction";
import AutoPagination from "@/Reusable/AutoPagination";
import { Label } from "@/components/ui/label";
import CreateSignatories from "./CreateSignatories";
import EditSignatories from "./EditSignatories";
import { Toaster } from "sonner";
import LoadingScreen from "@/LoadingScreen";

export default function Signatories() {
    const { setItem, setBItem } = UseLayout();

    useEffect(() => {
        setItem("Signatories");
        setBItem("");
    }, []);

    const { indexPage, setIndexPage, pageInfo, setOpenCreate, indexTableLoad } =
        UseSignatoryIndex();
    return (
        <>
            <title>BNS | Signatories</title>
            <CreateSignatories />
            <EditSignatories />
            <Toaster />
            <Card className="p-0">
                <CardHeader className="bg-muted p-3 rounded-tl-lg rounded-tr-lg">
                    <div>
                        <Button
                            variant={"primary"}
                            onClick={() => setOpenCreate(true)}
                        >
                            <CirclePlus /> Signatories
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pb-5">
                    <div className="relative">
                        {indexTableLoad && <LoadingScreen />}
                        <SignatoriesTable />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div className="flex items-center">
                            <Label className="opacity-70">
                                Showing{" "}
                                {pageInfo?.total_data == 0
                                    ? 0
                                    : pageInfo?.offset + 1}{" "}
                                of{" "}
                                {pageInfo?.offset +
                                    pageInfo?.current_data_count}{" "}
                                to {pageInfo?.total_data} Signatories
                            </Label>
                        </div>
                        <div>
                            <div className="float-right">
                                <AutoPagination
                                    page={indexPage}
                                    setPage={setIndexPage}
                                    totalPage={pageInfo?.total_page}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
