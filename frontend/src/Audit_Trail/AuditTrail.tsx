import { UseLayout } from "@/Actions/LayoutAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect } from "react";
import AuditTrailTable from "./AuditTrailTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AutoPagination from "@/Reusable/AutoPagination";
import { UseAuditTrail } from "@/Actions/AuditTrailAction";
import LoadingScreen from "@/LoadingScreen";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export default function AuditTrail() {
    const { setItem, setBItem } = UseLayout();
    useEffect(() => {
        setItem("Audit Trails");
        setBItem("");
    }, []);

    const { page, setPage, setSearch, search } = UseAuditTrail();
    const [searchD] = useDebounce(search, 500);
    const searchVal = search == "" ? search : searchD;
    const { setData } = UseAuditTrail();

    const { data, isFetching } = useQuery({
        queryKey: ["auditTrail", searchVal, page],
        queryFn: () => setData(),
        placeholderData: keepPreviousData,
    });
    const auditData = data?.data;
    const pageInfo = data?.pageInfo;
    return (
        <>
            <title>BNS | Audit Trails</title>
            <Card className="p-0">
                <CardHeader className="p-1 rounded-tl-lg rounded-tr-lg bg-muted flex justify-end py-3">
                    <div className="flex relative hover:-translate-y-1.5     transition-all">
                        <Search className="text-gray-500 w-4 h-4 absolute z-10 top-2 left-2" />
                        <Input
                            className="bg-white  hover:bg-white pl-7"
                            placeholder="Search"
                            value={search}
                            onInput={(e: any) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="pb-5">
                    <div className="relative">
                        {isFetching && <LoadingScreen />}
                        <AuditTrailTable auditData={auditData} />
                    </div>
                    <div className="grid grid-cols-2">
                        <div></div>
                        <div>
                            <div className="float-right">
                                <AutoPagination
                                    page={page}
                                    setPage={setPage}
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
