import { UseViewPayrollAction } from "@/Actions/PayrollAction";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function UseViewPayroll() {
    const { viewPayroll, setViewPayroll, page, setPage, id, getViewPayroll } =
        UseViewPayrollAction();
    const [search, setSearch] = useState<string>("");
    const [searchD] = useDebounce(search, 500);
    const searchVal = search == "" ? search : searchD;

    const { data, isFetching } = useQuery({
        queryKey: ["viewPayroll", page, searchVal, id],
        queryFn: () => getViewPayroll(page, searchVal),
        placeholderData: keepPreviousData,
        enabled: id !== null && id !== undefined,
        refetchOnWindowFocus: false,
    });

    let totalPage = data?.totalPage;
    let payroll = data?.payroll;
    let viewPayrollScholar = data?.viewPayrollScholar;

    useEffect(() => {
        setPage(1);
    }, [viewPayroll]);

    return {
        totalPage,
        payroll,
        search,
        searchVal,
        setSearch,
        isFetching,
        page,
        setPage,
        viewPayroll,
        setViewPayroll,
        viewPayrollScholar,
    };
}
