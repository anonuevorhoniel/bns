import { UseLayout } from "@/Actions/LayoutAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect } from "react";
import AuditTrailTable from "./AuditTrailTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AutoPagination from "@/Reusable/AutoPagination";
import { UseAuditTrail } from "@/Actions/AuditTrailAction";
import LoadingScreen from "@/LoadingScreen";

export default function AuditTrail() {
    const { setItem, setBItem } = UseLayout();
    useEffect(() => {
        setItem("Audit Trails");
        setBItem("");
    }, []);

    const {page, setPage, pageInfo, setSearch, loading, search} = UseAuditTrail();

    return (
        <>
            <title>BNS | Audit Trails</title>
            <Card className="p-0">
                <CardHeader className="p-1 rounded-tl-lg rounded-tr-lg bg-muted flex justify-end py-3">
                    <div className="flex justify-center items-center bg-white rounded-lg  max-w-70 float-right px-3 py-1 space-x-2">
                        <Search className="text-gray-500 w-5 h-5" />
                        <Input
                            className="bg-transparent border-none hover:bg-gray-100"
                            placeholder="Search"
                            value={search}
                            onInput={(e: any) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="relative">
                    {loading && <LoadingScreen />}
                      <AuditTrailTable />
                  </div>
                    <div className="grid grid-cols-2">
                        <div></div>
                        <div>
                            <div className="float-right">
                                <AutoPagination  page={page} setPage={setPage} totalPage={pageInfo?.total_page}/>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
