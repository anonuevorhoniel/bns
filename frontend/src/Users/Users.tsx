import { Card, CardContent, CardHeader } from "@/components/ui/card";

import AutoPagination from "@/Reusable/AutoPagination";
import { useEffect, useState } from "react";
import { UseUser } from "../Actions/UserAction";
import { UseLayout } from "@/Actions/LayoutAction";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/LoadingScreen";
import UserTable from "./UserTable";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export default function Users() {
    const [page, setPage] = useState(1);
    const { getUserData } = UseUser();
    const { setItem, setBItem } = UseLayout();

    useEffect(() => {
        setItem("Users");
        setBItem("");
    }, []);

    const { data, isFetching } = useQuery({
        queryKey: ["users", page],
        queryFn: () => getUserData(page),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const userData = data?.userData;
    const totalPage = data?.total_page;

    return (
        <>
            <title>BNS | Users</title>
            <Card className="p-0">
                <CardHeader className="bg-muted p-3 rounded-tl-lg rounded-tr-lg">
                    <div>
                        <Button variant={"primary"}>
                            <CirclePlus /> Users
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-3 relative">
                    {isFetching && <LoadingScreen />}
                    <UserTable userData={userData} />
                    <AutoPagination
                        page={page}
                        setPage={setPage}
                        totalPage={totalPage}
                    />
                </CardContent>
            </Card>
        </>
    );
}
