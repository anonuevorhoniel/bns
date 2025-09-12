import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchBar({ onInput }: { onInput: any }) {
    return (
        <div className="flex relative">
            <Search className="left-3 top-2 opacity-60 absolute size-4" />
            <Input className="pl-9" onInput={onInput} placeholder="Search" />
        </div>
    );
}
