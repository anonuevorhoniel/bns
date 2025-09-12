import { useDebounce } from "use-debounce";

export function useSearch(search: string){
    const [searchDebounce] = useDebounce(search, 500);
    const searchValue = search == "" ? search : searchDebounce;

    return searchValue;
}