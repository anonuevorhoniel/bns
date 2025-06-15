import {  useMasterlist } from "@/Actions/DownloadAction";
import { UseMuni } from "@/Actions/MunicipalityAction";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DirectorySchema } from "@/Validation/DirectoryValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import {  BookUser, Building2, Check, ChevronsUpDown, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

export default function MasterlistDialog() {
    const { allMuni, getAllMuni } = UseMuni();
    const date = new Date();
    const current_year = date.getFullYear();
    const {
        openMasterlistDialog,
        setOpenMasterlistDialog,
        setForm,
        download,
        loading,
    } = useMasterlist();

    const [muniValue, setmuniValue] = useState<any>();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        getAllMuni();
        setForm({
            name: "year",
            value: current_year,
        });
    }, []);

    const handleSubmit = () => {
        download();
    };

    const defaultValues = {
        code: "",
        year: current_year.toString(),
        fund: "",
    };

    const directoryForm = useForm<any>({
        resolver: zodResolver(DirectorySchema),
        defaultValues: defaultValues,
    });

    return (
        <>
            <Dialog
                open={openMasterlistDialog}
                onOpenChange={setOpenMasterlistDialog}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...directoryForm}>
                        <form
                            onSubmit={directoryForm.handleSubmit(handleSubmit)}
                        >
                            <DialogHeader>
                                <DialogTitle className="flex gap-2 justify-left items-center text-blue-500 font-bold"><BookUser /> Masterlist</DialogTitle>
                                <DialogDescription />
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <FormField
                                        name="code"
                                        control={directoryForm.control}
                                        render={({ field }) => {
                                            const { error } = useFormField();
                                            return (
                                                <FormItem className="mt-5">
                                                    <FormLabel>
                                                        City / Municipality
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Popover
                                                            open={open}
                                                            onOpenChange={
                                                                setOpen
                                                            }
                                                        >
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={
                                                                        open
                                                                    }
                                                                    className={
                                                                        `${error &&
                                                                        "border-red-500 text-red-500"}`
                                                                    }
                                                                >
                                                                    {muniValue ? (
                                                                        allMuni?.find(
                                                                            (
                                                                                muni: any
                                                                            ) =>
                                                                                muni.name ===
                                                                                muniValue
                                                                        )?.name
                                                                    ) : (
                                                                        <p className="flex">
                                                                            {
                                                                                <Building2 className="mr-2" />
                                                                            }
                                                                            Muni
                                                                            /
                                                                            City{" "}
                                                                        </p>
                                                                    )}
                                                                    <ChevronsUpDown className="opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[200px] p-0 ">
                                                                <Command>
                                                                    <CommandInput
                                                                        placeholder="Search muni..."
                                                                        className="h-9"
                                                                    />
                                                                    <CommandList>
                                                                        <CommandEmpty>
                                                                            No
                                                                            Muni
                                                                            /
                                                                            City
                                                                            found.
                                                                        </CommandEmpty>
                                                                        <CommandGroup>
                                                                            {allMuni &&
                                                                                allMuni?.map(
                                                                                    (
                                                                                        muni: any
                                                                                    ) => (
                                                                                        <CommandItem
                                                                                            key={
                                                                                                muni.name
                                                                                            }
                                                                                            onSelect={(
                                                                                                currentmuniValue
                                                                                            ) => {
                                                                                                setmuniValue(
                                                                                                    currentmuniValue ===
                                                                                                        muniValue
                                                                                                        ? ""
                                                                                                        : currentmuniValue
                                                                                                );
                                                                                                setOpen(
                                                                                                    false
                                                                                                );

                                                                                                setForm(
                                                                                                    {
                                                                                                        name: "code",
                                                                                                        value: muni.code,
                                                                                                    }
                                                                                                );
                                                                                                field.onChange(
                                                                                                    muni.code
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                muni.name
                                                                                            }
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "ml-auto",
                                                                                                    muniValue ===
                                                                                                        muni.name
                                                                                                        ? "opacity-100"
                                                                                                        : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </CommandItem>
                                                                                    )
                                                                                )}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    ></FormField>
                                </div>
                            </div>

                            <FormField
                                name="fund"
                                control={directoryForm.control}
                                render={({ field }) => {
                                    const { error } = useFormField();
                                    return (
                                        <FormItem className="mb-2 mt-2">
                                            <FormLabel>Fund</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(e) => {
                                                        setForm({
                                                            name: "fund",
                                                            value: e,
                                                        });
                                                        field.onChange(e);
                                                    }}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger
                                                        className={`w-full ${
                                                            error &&
                                                            "border-red-500"
                                                        }`}
                                                    >
                                                        <SelectValue placeholder="--Select Fund--"></SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NNC">
                                                            NNC
                                                        </SelectItem>
                                                        <SelectItem value="PGL">
                                                            PGL
                                                        </SelectItem>
                                                        <SelectItem value="BOTH">
                                                            BOTH
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>

                            <FormField
                                name="year"
                                control={directoryForm.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem className="mb-5">
                                            <FormLabel>Year</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="--Year--"
                                                    type="number"
                                                    onInput={(e: any) => {
                                                        setForm({
                                                            name: "year",
                                                            value: e.target
                                                                .value,
                                                        });
                                                    }}
                                                    {...field}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant={"success"}
                                >
                                    {loading ? (
                                        <Ring2
                                            size="25"
                                            stroke="5"
                                            strokeLength="0.25"
                                            bgOpacity="0.1"
                                            speed="0.8"
                                            color="white"
                                        />
                                    ) : (
                                        <>
                                            <Download /> Download{" "}
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
