import { UseMuni } from "@/Actions/MunicipalityAction";
import { useEffect, useState } from "react";
import { UseLayout } from "@/Actions/LayoutAction";
import { UseGetScholar } from "@/Actions/ScholarAction";
import { useDirectory, useMasterlist } from "@/Actions/DownloadAction";
import { UseAuth } from "@/Actions/AuthAction";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export default function UseScholar() {
    const { user } = UseAuth();
    const { getAllMuni } = UseMuni();
    const { GetScholars, code, setCode } = UseGetScholar();
    const [page, setPage] = useState<number>(1);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchD] = useDebounce(search, 500);
    const searchVal = search == "" ? search : searchD;
    const [scholarStatus, setScholarStatus] = useState('active');
    const { setItem, setBItem } = UseLayout();
    const { setOpenDirectoryDialog } = useDirectory();
    const { setOpenMasterlistDialog } = useMasterlist();

    useEffect(() => {
        if (user?.assigned_muni_code != null) {
            setCode(user?.assigned_muni_code);
        } else {
            setCode(null);
        }
    }, [user]);

    useEffect(() => {
        setItem("Scholars");
        setBItem(null);
        getAllMuni();
    }, []);

    const { data, isFetching } = useQuery({
        queryKey: ["scholars", code, page, searchVal, scholarStatus],
        queryFn: () => GetScholars(code, page, searchVal, scholarStatus),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const scholars = data?.scholars;
    const offset = data?.offset ?? 0;
    const totalScholar = data?.totalScholar ?? 0;
    const totalPage = data?.totalPage ?? 0;
    const cs_count = data?.cs_count ?? 0;

    return {
        scholars,
        offset,
        totalScholar,
        totalPage,
        cs_count,
        user,
        isFetching,
        setOpenDirectoryDialog,
        setOpen,
        setSearch,
        page,
        setPage,
        setOpenMasterlistDialog,
        open,
        setScholarStatus,
    };
}
