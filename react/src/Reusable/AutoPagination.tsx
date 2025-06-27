import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";

export default function AutoPagination({
    page,
    setPage,
    totalPage,
    loading,
}: {
    page: number;
    setPage: any;
    totalPage: any;
    loading?: boolean;
}) {
    const pages = [];

    const pageRange = 2; // How many pages before and after current page

    //math max papakita nya pinaka mataas
    let startPage = Math.max(1, page - pageRange);
    //math min papakita pinakamababa
    let endPage = Math.min(totalPage, page + pageRange);

    useEffect(() => {
        if (page > endPage || page < startPage) {
            setPage(startPage);
        }
    }, [totalPage, page, startPage, endPage]);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <PaginationItem
                key={i}
                onClick={() => {
                    // pageChange(i);
                    setPage(i);
                }}
            >
                <PaginationLink isActive={i === page}>{i}</PaginationLink>
            </PaginationItem>
        );
    }

    return (
        <>
            <Pagination className={`mt-2 ${loading && "pointer-events-none"}`}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={
                                startPage == page ? "bg-muted rounded-lg text-black/30 pointer-events-none hover:text-black/30" : ""
                            }
                            onClick={() => {
                                if (page > 1) {
                                    setPage(page - 1);
                                }
                            }}
                        />
                    </PaginationItem>
                    {pages}
                    <PaginationItem
                        className={
                            //initial lang yung 2nd 
                            page == endPage || (startPage == 1 && endPage == 0) ? "bg-muted rounded-lg text-black/30 pointer-events-none" : ""
                        }
                        onClick={() => {
                            if (page < totalPage) {
                                setPage(page + 1);
                            }
                        }}
                    >
                        <PaginationNext />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
