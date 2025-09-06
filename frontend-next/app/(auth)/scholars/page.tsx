"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/ui/searchbar";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import DataTable from "@/components/ui/datatable";
import Link from "next/link";
import { useScholarView } from "@/app/global/scholars/useScholarView";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ViewScholar from "./(view)/ViewScholar";
import useGetScholar from "@/hooks/scholars/useGetScholar";
import { scholarColumns } from "./(columns}/scholarColumns";

export default function Page() {
    const { open, setOpen } = useScholarView();
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [searchDebounce] = useDebounce(search, 500);
    let searchValue = search == "" ? search : searchDebounce;

    const { data, isFetching } = useGetScholar({
        page: page,
        search: searchValue,
    });
    const scholars = data?.data?.get_scholars;
    const pagination = data?.data?.pagination;

    const columns = scholarColumns();
    return (
        <>
            <title>BNS | Scholars</title>
            <div className="flex gap-2">
                <Link href={"/scholars/create"}>
                    <Button>
                        <Plus /> Add Scholar
                    </Button>
                </Link>
                <Button>
                    <Download /> Download
                </Button>
            </div>
            <Card className="px-6">
                <SearchBar onInput={(e: any) => setSearch(e.target.value)} />
                <DataTable
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                    data={scholars}
                    columns={columns}
                    isFetching={isFetching}
                    totalPage={pagination?.total_page}
                />
            </Card>
            <ResponsiveDialog
                className="min-w-[1000px] max-h-[90vh] overflow-auto"
                title="View Scholar"
                open={open}
                setOpen={setOpen}
            >
                <ViewScholar />
            </ResponsiveDialog>
        </>
    );
}
