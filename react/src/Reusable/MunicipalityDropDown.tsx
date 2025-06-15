import { UseMuni } from "@/Actions/MunicipalityAction";
import { UseGetScholar } from "@/Actions/ScholarAction";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function MunicipalityDropDown({ open, setOpen }: any) {
    const { allMuni, getAllMuni } = UseMuni();
    const [muniValue, setmuniValue] = useState<any>();
    const [code, setCode] = useState<any>();

    useEffect(() => {
        getAllMuni();
    }, []);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="border-1 "
                    >
                        {muniValue ? (
                            allMuni?.find(
                                (muni: any) => muni.name === muniValue
                            )?.name
                        ) : (
                            <p className="flex">
                                {<Building2 className="mr-2" />}
                                Muni / City{" "}
                            </p>
                        )}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search muni..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>No muni found.</CommandEmpty>
                            <CommandGroup>
                                {allMuni &&
                                    allMuni?.map((muni: any) => (
                                        <CommandItem
                                            key={muni.name}
                                            onSelect={(currentmuniValue) => {
                                                setmuniValue(
                                                    currentmuniValue ===
                                                        muniValue
                                                        ? ""
                                                        : currentmuniValue
                                                );
                                                setOpen(false);
                                                setCode(muni.code);
                                            }}
                                        >
                                            {muni.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    muniValue === muni.name
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
