import { AdditionalInfo } from "@/Actions/ScholarAction";
import ax from "@/Axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function AddInfoTable({ search }: any) {
    const [page, setPage] = useState(1);
    const id = useParams().id;
    const { setFormData } = useCreateScholarForm();
    const { setReplacementPersonID, setReplacementPersonName, setShow } =
        AdditionalInfo();

    async function getScholars(page: any, search: string, id: any) {
        const r = await ax.post("/scholars/get", {
            page: page,
            search: search,
            except_scholar_id: id,
        });
        return r.data;
    }

    const [search_debounce] = useDebounce(search, 500);
    let searchVal = search == "" ? search : search_debounce;

    const { data, isFetching, isError, error } = useQuery({
        queryKey: ["add_info_table", page, searchVal],
        queryFn: () => getScholars(page, searchVal, id),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    if (isError) {
        console.log(error);
    }

    useEffect(() => console.log(data), [data]);

    return (
        <div className="relative">
            {isFetching && <LoadingScreen />}
            <Table className="border-t-1">
                <TableHeader className="">
                    <TableRow className="">
                        <TableHead className="hover:bg-gray-200">
                            <Label className="text-black/75 flex items-center justify-center">
                                Full Name
                            </Label>
                        </TableHead>
                        <TableHead className="hover:bg-gray-200">
                            <Label className="text-black/75 flex items-center justify-center">
                                Fund
                            </Label>
                        </TableHead>
                        <TableHead>
                            <Label className="text-black/75 flex items-center justify-center">
                                Action{" "}
                            </Label>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.get_scholars?.map((s: any) => (
                        <TableRow className="text-center" key={s.id}>
                            <TableCell>{s.full_name}</TableCell>
                            <TableCell>{s.fund}</TableCell>
                            <TableCell>
                                <Button
                                    className="h-7"
                                    variant={"outline"}
                                    onClick={() => {
                                        setReplacementPersonID(s.id),
                                            setReplacementPersonName(
                                                s.full_name
                                            );
                                        setShow(false);
                                        setFormData({
                                            name: "replaced_scholar_id",
                                            value: s.id,
                                        });
                                    }}
                                >
                                    Select
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {(data?.get_scholars?.length == 0 ||
                        data?.get_scholars?.length == undefined) && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No Scholars Found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AutoPagination
                page={page}
                setPage={setPage}
                totalPage={data?.total_page}
            />
        </div>
    );
}
