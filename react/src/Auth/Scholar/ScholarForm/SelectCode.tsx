import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Building2, Check, ChevronsUpDown, Info } from "lucide-react";
import { UseGetScholar } from "@/Actions/ScholarAction";
import { UseMuni } from "@/Actions/MunicipalityAction";

export default function SelectCode({open, setOpen} : any) {

    const { allMuni} = UseMuni();
    const {
        code,
        setCode,
        muniValue,
        setmuniValue,
    } = UseGetScholar();

    return (
        <div className="flex flex-col gap-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className=" text-blue-800 border-1 border-blue-800 hover:text-blue-800"
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
            {code ? (
                ""
            ) : (
                <div className="text-xs text-yellow-500 flex gap-1">
                    <Info size={14} />
                    Select to show Scholars
                </div>
            )}
        </div>
    );
}
