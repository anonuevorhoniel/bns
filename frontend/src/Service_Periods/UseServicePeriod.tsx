import {
    UseCreateServicePeriod,
    UseServicePeriodAction,
} from "../Actions/ServicePeriodAction";
import { useEffect, useState } from "react";
import { UseLayout } from "@/Actions/LayoutAction";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export default function UseServicePeriods() {
    const { page, setPage, getData } = UseServicePeriodAction();
    const { setspCreateOpen } = UseCreateServicePeriod();
    const { setBItem, setItem } = UseLayout();
    const [search, setSearch] = useState<string>("");
    const [searchD] = useDebounce(search, 500);
    const searchVal = search == "" ? search : searchD;

    const { data, isFetching } = useQuery<any>({
        queryKey: ["servicePeriod", page, searchVal],
        queryFn: () => getData(searchVal),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });
    let totalPage = data?.pages.total_page;
    let offset = data?.pages.offset;
    let totalScholars = data?.pages.total_scholars;
    let csc = data?.pages.current_scholar_count;
    let scholars = data?.data;

    useEffect(() => {
        setItem("Service Periods");
        setBItem("");
    }, []);

    return {
        setspCreateOpen,
        setSearch,
        isFetching,
        totalPage,
        offset,
        totalScholars,
        csc,
        page,
        setPage,
        scholars,
    };
}
