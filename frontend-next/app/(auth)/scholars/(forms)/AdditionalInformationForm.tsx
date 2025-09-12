import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import FormFieldComponent from "@/components/custom/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import ResponsivePagination from "@/components/custom/responsive-pagination";
import SearchBar from "@/components/custom/searchbar";
import { SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useGetScholar from "@/hooks/scholars/useGetScholar";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDebounce } from "use-debounce";

export default function AdditionalInformationForm({
    form,
}: {
    form: UseFormReturn;
}) {
    const [search, setSearch] = useState("");
    const [searchDebounce] = useDebounce(search, 500);
    const searchValue = search == "" ? search : searchDebounce;
    const status = form.watch("status");
    const municipality_code = form.watch("citymuni_id");
    const [page, setPage] = useState(1);
    const [replacedScholar, setReplacedScholar] = useState({
        full_name: "",
        id: null,
    });
    const [openReplacement, setOpenReplacement] = useState(false);

    const { data, isFetching, isSuccess } = useGetScholar({
        page: page,
        search: searchValue,
        code: municipality_code,
    });

    const pagination = data?.data?.pagination;

    return (
        <>
            <Label className="font-bold text-xl mb-5">
                Additional Information
            </Label>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <FormFieldComponent
                    name="status"
                    label="Status"
                    form={form}
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="OLD">OLD</SelectItem>
                            <SelectItem value="REP">REP</SelectItem>
                            <SelectItem value="NEW">NEW</SelectItem>
                        </>
                    }
                />
                <FormFieldComponent
                    name="bns_type"
                    label="BNS Type"
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="BNS">BNS</SelectItem>
                            <SelectItem value="Assitant BNS">
                                Assitant BNS
                            </SelectItem>
                        </>
                    }
                    form={form}
                />
                <FormFieldComponent
                    name="place_of_assignment"
                    label="Place of Assignment"
                    form={form}
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="same_as_barangay">
                                Same as Barangay
                            </SelectItem>
                            <SelectItem value="BNS Coordinator">
                                BNS Coordinator
                            </SelectItem>
                        </>
                    }
                />
                <FormFieldComponent
                    name="educational_attainment"
                    label="Educational Attainment"
                    form={form}
                    type="select"
                    selectItems={
                        <>
                            <SelectItem value="Elementary Graduate">
                                Elementary Graduate
                            </SelectItem>
                            <SelectItem value="High School Graduate">
                                High School Graduate
                            </SelectItem>
                            <SelectItem value="Vocational">
                                Vocational
                            </SelectItem>
                            <SelectItem value="College Graduate">
                                College Graduate
                            </SelectItem>
                            <SelectItem value="Master's Degree">
                                Master's Degree
                            </SelectItem>
                        </>
                    }
                />
                <FormFieldComponent
                    name="first_employment_date"
                    type="date"
                    label="First Employment Date"
                    form={form}
                />
                {status == "REP" && (
                    <>
                        <div className="space-y-2">
                            <Label>Select BNS to Replace:</Label>
                            <Popover
                                open={openReplacement}
                                onOpenChange={setOpenReplacement}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        className="w-full flex justify-between"
                                        type="button"
                                        variant={"outline"}
                                    >
                                        <Label>
                                            {replacedScholar.full_name
                                                ? replacedScholar?.full_name
                                                : "Select BNS"}
                                        </Label>
                                        <ChevronDown />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex gap-2">
                                        <SearchBar
                                            onInput={(e: any) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                        <Button onClick={() => setSearch("")}>
                                            Reset
                                        </Button>
                                    </div>
                                    {data?.data?.get_scholars?.map(
                                        (scholar: any) => {
                                            if (isFetching) {
                                                return (
                                                    <div
                                                        className="flex justify-between gap-5 my-2"
                                                        key={scholar.id}
                                                    >
                                                        <Skeleton className="h-8 w-full " />
                                                        <Skeleton className="h-8 w-10" />
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div
                                                    className="flex justify-between my-2"
                                                    key={scholar.id}
                                                >
                                                    <Label>
                                                        {scholar.full_name}
                                                    </Label>
                                                    <Button
                                                        size={"sm"}
                                                        onClick={() => {
                                                            setReplacedScholar({
                                                                full_name:
                                                                    scholar.full_name,
                                                                id: scholar.id,
                                                            });
                                                            setOpenReplacement(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <Check />
                                                    </Button>
                                                </div>
                                            );
                                        }
                                    )}
                                    <ResponsivePagination
                                        page={page}
                                        setPage={setPage}
                                        totalPage={pagination?.total_page}
                                        isFetching={isFetching}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <FormFieldComponent
                            name="service_period_status"
                            label="Service Period Status"
                            form={form}
                            type="select"
                            selectItems={
                                <>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="New Service Period">
                                        New Service Period
                                    </SelectItem>
                                    <SelectItem value="Update    Service Period">
                                        Update Service Period
                                    </SelectItem>
                                </>
                            }
                        />
                        <FormFieldComponent
                            name="replacement_date"
                            type="date"
                            label="Date of Replacement"
                            form={form}
                        />
                    </>
                )}
            </div>
        </>
    );
}
