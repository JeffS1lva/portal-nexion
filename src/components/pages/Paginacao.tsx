import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal
} from "lucide-react";

interface PaginacaoProps {
  currentPage: number;
  pageCount: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: React.Dispatch<React.SetStateAction<number>>;
  showPageSizeSelector?: boolean;
  showJumpToPage?: boolean;
  showItemsInfo?: boolean;
  pageSizeOptions?: number[];
}

export const Paginacao: React.FC<PaginacaoProps> = ({
  currentPage,
  pageCount,

  onPageChange,

}) => {

  const getSmartPages = (isMobile: boolean = false) => {
    // Mobile: mostra menos páginas
    const maxPages = isMobile ? 3 : 7;

    if (pageCount <= maxPages) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    if (isMobile) {
      // Mobile: mostra apenas 3 páginas (atual e adjacentes quando possível)
      pages.push(1);

      if (currentPage > 2 && currentPage < pageCount - 1) {
        pages.push("ellipsis");
        pages.push(currentPage);
        pages.push("ellipsis");
      } else if (currentPage <= 2) {
        if (pageCount > 2) pages.push(2);
        if (pageCount > 3) pages.push("ellipsis");
      } else {
        pages.push("ellipsis");
        if (pageCount > 1) pages.push(pageCount - 1);
      }

      if (pageCount > 1) pages.push(pageCount);
    } else {
      // Desktop: lógica original
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, 4);
        if (pageCount > 5) pages.push("ellipsis");
        pages.push(pageCount);
      } else if (currentPage >= pageCount - 2) {
        pages.push("ellipsis");
        pages.push(pageCount - 3, pageCount - 2, pageCount - 1, pageCount);
      } else {
        pages.push("ellipsis");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("ellipsis");
        pages.push(pageCount);
      }
    }

    return pages;
  };


  if (pageCount <= 1) return null;

  return (
    <div className="flex sm:w-full sm:flex-row items-center gap-3 sm:gap-4   sm:px-0">
      {/* Info e controles principais */}


      {/* Paginação */}
      <Pagination className="order-1 sm:order-2">
        <PaginationContent className="gap-0.5 sm:gap-1">
          {/* Primeira página - esconde em mobile */}
          <PaginationItem className="hidden sm:block">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground transition-all"
              title="Primeira página"
            >
              <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </PaginationItem>

          {/* Anterior */}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground transition-all"
              title="Página anterior"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </PaginationItem>

          {/* Números de página */}
          <div className="flex items-center gap-0.5 sm:gap-1 mx-1 sm:mx-2">
            {/* Desktop */}
            <div className="hidden sm:flex items-center gap-1">
              {getSmartPages(false).map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 cursor-default hover:bg-transparent"
                      disabled
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => onPageChange(page)}
                      className={`h-9 w-9 transition-all ${currentPage === page
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "hover:bg-primary/10"
                        }`}
                    >
                      {page}
                    </Button>
                  )}
                </PaginationItem>
              ))}
            </div>

            {/* Mobile */}
            <div className="flex sm:hidden items-center gap-0.5">
              {getSmartPages(true).map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-default hover:bg-transparent"
                      disabled
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => onPageChange(page)}
                      className={`h-8 w-8 text-xs transition-all ${currentPage === page
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-primary/10"
                        }`}
                    >
                      {page}
                    </Button>
                  )}
                </PaginationItem>
              ))}
            </div>
          </div>

          {/* Próxima */}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground transition-all"
              title="Próxima página"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </PaginationItem>

          {/* Última página - esconde em mobile */}
          <PaginationItem className="hidden sm:block">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(pageCount)}
              disabled={currentPage === pageCount}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary hover:text-primary-foreground transition-all"
              title="Última página"
            >
              <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};