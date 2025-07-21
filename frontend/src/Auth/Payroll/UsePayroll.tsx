import { UseLayout } from "@/Actions/LayoutAction";
import { UsePayrollAction } from "@/Actions/PayrollAction";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useEffect } from "react";

export default function UsePayroll() {
    const { setItem, setBItem } = UseLayout();
    const { getPayroll, indexPage } = UsePayrollAction();

    useEffect(() => {
        setItem("Payrolls");
        setBItem("");
    }, []);

    const { data, isFetching } = useQuery({
        queryKey: ["payroll", indexPage],
        queryFn: () => getPayroll(),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });
    let payrolls = data?.payrolls;
    let totalPage = data?.totalPage;
    let totalPayroll = data?.totalPayroll;
    let offset = data?.offset;
    let cpc = data?.cpc;

    return {
        payrolls,
        totalPage,
        totalPayroll,
        offset,
        cpc,
        isFetching
    };
}
