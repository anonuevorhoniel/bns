import { useCreateServicePeriod } from "@/app/global/service-periods/useCreateServicePeriod";
import ButtonLoad from "@/components/custom/button-load";
import DataTable from "@/components/custom/datatable";
import FormFieldComponent from "@/components/custom/form-field";
import SearchBar from "@/components/custom/searchbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import useMunicipalities from "@/hooks/municipalities/useMunicipalities";
import useGetScholar from "@/hooks/scholars/useGetScholar";
import { formType } from "@/types/formType";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function ServicePeriodForm({
    form,
    handleSubmit,
    isPending,
}: formType) {
    const to = form.watch("to");
    const municipality_code = form.watch("municipality_code");
    const { selectedIds, setSelectedIds, removeSeleted } =
        useCreateServicePeriod();
    const [page, setPage] = useState(1);
    const { data: municipalities } = useMunicipalities();
    const [search, setSearch] = useState("");
    const [searchDebounce] = useDebounce(search, 500);
    const searchValue = search == "" ? search : searchDebounce;

    const { data: scholars, isFetching: scholarIsFetching } = useGetScholar({
        page: page,
        changeVariable: [municipality_code],
        search: searchValue,
        code: municipality_code,
    });

    const columns = [
        {
            header: "Select",
            cell: (item: any) => (
                <Checkbox
                    checked={selectedIds.includes(item?.id)}
                    onCheckedChange={(e: boolean) =>
                        e ? setSelectedIds(item.id) : removeSeleted(item.id)
                    }
                />
            ),
        },
        {
            accessKey: "full_name",
            header: "First Name",
        },
        {
            header: "Fund",
            cell: (item: any) =>
                item.fund ? (
                    <Badge>{item.fund}</Badge>
                ) : (
                    <Badge className="border-red-500" variant={"outline"}>
                        Unknown
                    </Badge>
                ),
        },
        {
            header: "Action",
            cell: (item: any) => (
                <Button size={"sm"} type="button">
                    <Search />
                </Button>
            ),
        },
    ];

    return (
        <Form {...form}>
            <form
                action=""
                onSubmit={form.handleSubmit(handleSubmit)}
                className=""
            >
                <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormFieldComponent
                        label="From"
                        type="date"
                        form={form}
                        name="from"
                    />

                    <FormFieldComponent
                        label="To"
                        type="select"
                        form={form}
                        name="to"
                        selectItems={
                            <>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="specific">
                                    Specific Date
                                </SelectItem>
                            </>
                        }
                    />

                    <FormFieldComponent
                        label="City / Municipality"
                        type="select"
                        form={form}
                        name="municipality_code"
                        selectItems={
                            <>
                                {municipalities?.data?.map((item: any) => (
                                    <SelectItem
                                        key={item.id}
                                        value={`${item.code}`}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </>
                        }
                    />

                    {to == "specific" && (
                        <FormFieldComponent
                            label="Specific Date"
                            type="date"
                            form={form}
                            name="specific_date"
                        />
                    )}
                </div>

                <Card className="mt-5 shadow-none border-none lg:px-6 lg:shadow-md lg:border-20 bg-transparent lg:bg-card">
                    <div className="space-y-4">
                        <SearchBar
                            onInput={(e: any) => setSearch(e.target.value)}
                        />
                       {municipality_code ?  <DataTable
                            page={page}
                            data={scholars?.data?.get_scholars}
                            setPage={setPage}
                            isFetching={scholarIsFetching}
                            pagination={scholars?.data?.pagination}
                            columns={columns}
                        /> : <div className="border border-dashed h-30 w-full flex justify-center items-center rounded-lg">
                            <Label className="opacity-70">Please select City / Municipality to generate Scholars</Label>
                            </div>}
                    </div>
                </Card>
                <ButtonLoad
                    isPending={isPending}
                    label="Submit"
                    className="w-full mt-5"
                />
            </form>
        </Form>
    );
}
