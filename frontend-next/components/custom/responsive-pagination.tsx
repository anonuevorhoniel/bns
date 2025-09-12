import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";

export default function ResponsivePagination({
    page,
    setPage,
    totalPage,
    isFetching,
}: {
    page: number;
    setPage: any;
    totalPage: number;
    isFetching: boolean;
}) {
    const pages = [];
    const pageRange = 1; // How many pages before and after current page

    //math max papakita nya pinaka mataas
    let startPage = Math.max(1, page - pageRange);
    //math min papakita pinakamababa
    let endPage = Math.min(totalPage, page + pageRange);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <PaginationItem
                key={i}
                onClick={() => {
                    setPage(i);
                }}
            >
                <PaginationLink isActive={i === page}>{i}</PaginationLink>
            </PaginationItem>
        );
    }

    useEffect(() => {
        if (page > totalPage) {
            setPage(1);
        }
    }, [page, totalPage]);

    return (
        <Pagination className={`${isFetching && "pointer-events-none"}`}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                    />
                </PaginationItem>
                {pages}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => page < totalPage && setPage(page + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
