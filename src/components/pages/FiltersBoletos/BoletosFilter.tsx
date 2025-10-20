// BoletoFilter.tsx
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Search, X } from "lucide-react";
import { Table } from "@tanstack/react-table";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

type FilterType =
  | "codigoBoleto"
  | "nomePN"
  | "cnpj"
  | "numNF"
  | "dataVencimento"
  | "pedidosCompra";

interface BoletoFilterProps {
  table: Table<any>;
  onSearch: (value: string, type: FilterType) => void;
}

export function BoletoFilter({ onSearch }: BoletoFilterProps) {
  const [filterType, setFilterType] = React.useState<FilterType>("codigoBoleto");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    start: null,
    end: null,
  });
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const applyFilters = React.useCallback(() => {
    if (filterType === "dataVencimento") {
      if (dateRange.start && dateRange.end) {
        const formattedRange = `${format(dateRange.start, "yyyy-MM-dd")}|${format(
          dateRange.end,
          "yyyy-MM-dd"
        )}`;
        onSearch(formattedRange, filterType);
      } else {
        onSearch("", filterType);
      }
    } else if (searchValue.trim()) {
      onSearch(searchValue.trim(), filterType);
    } else {
      onSearch("", filterType);
    }
  }, [filterType, searchValue, dateRange, onSearch]);

  const handleReset = () => {
    setSearchValue("");
    setFilterType("codigoBoleto");
    setDateRange({ start: null, end: null });
    setIsCalendarOpen(false);
    onSearch("", "codigoBoleto");
  };

  const handleApplyDateFilter = () => {
    applyFilters();
    setIsCalendarOpen(false);
  };

  // ✅ Debounce para busca de texto
  React.useEffect(() => {
    if (filterType === "dataVencimento") return;
    const delayDebounce = setTimeout(() => {
      applyFilters();
    }, searchValue ? 300 : 0);
    return () => clearTimeout(delayDebounce);
  }, [filterType, searchValue, applyFilters]);

  const handleFilterTypeChange = (value: FilterType) => {
    setFilterType(value);
    setSearchValue("");
    setDateRange({ start: null, end: null });
    onSearch("", value);
    if (value === "dataVencimento") {
      setIsCalendarOpen(true);
    }
  };

  const getPlaceholder = () => {
    switch (filterType) {
      case "codigoBoleto": return "Buscar por código do boleto...";
      case "pedidosCompra": return "Buscar por número do Pedido de Compra...";
      case "nomePN": return "Buscar por nome do cliente...";
      case "cnpj": return "Buscar por CNPJ...";
      case "numNF": return "Buscar por número da NF...";
      case "dataVencimento": return "Selecione um período de vencimento";
      default: return "Pesquisar...";
    }
  };

  const formatDateSafely = (date: Date | null): string => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="space-y-4 py-2">
      <div className="flex flex-col space-y-3 md:flex-row md:items-start md:space-y-0 md:space-x-2">
        {filterType === "dataVencimento" ? (
          <div className="flex flex-col space-y-2 w-full md:flex-row md:flex-1 md:space-y-0 md:space-x-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:flex-1 justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.start && dateRange.end ? (
                    <>
                      {formatDateSafely(dateRange.start)} - {formatDateSafely(dateRange.end)}
                    </>
                  ) : (
                    "Selecione o período de vencimento"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.start || undefined, to: dateRange.end || undefined }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      const endDate = new Date(range.to);
                      endDate.setHours(23, 59, 59, 999);
                      setDateRange({ start: range.from, end: endDate });
                    } else {
                      setDateRange({ start: range?.from || null, end: range?.to || null });
                    }
                  }}
                  locale={ptBR}
                  initialFocus
                />
                <div className="p-2 border-t flex justify-end">
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <X className="mr-2 h-4 w-4" /> Limpar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="relative w-full md:flex-1">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyFilters();
                }
              }}
              placeholder={getPlaceholder()}
              className="pl-8 w-full"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        )}

        <Select value={filterType} onValueChange={handleFilterTypeChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="codigoBoleto">Código</SelectItem>
            <SelectItem value="pedidosCompra">Pedidos de Compra</SelectItem>
            <SelectItem value="nomePN">Nome</SelectItem>
            <SelectItem value="cnpj">CNPJ</SelectItem>
            <SelectItem value="numNF">NF</SelectItem>
            <SelectItem value="dataVencimento">Vencimento</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-col space-y-2 w-full md:flex-row md:w-auto md:space-y-0 md:space-x-2">
          {filterType === "dataVencimento" ? (
            <Button
              type="button"
              onClick={handleApplyDateFilter}
              disabled={!dateRange.start || !dateRange.end}
              className="w-full md:w-auto"
            >
              Filtrar
            </Button>
          ) : (
            <Button type="submit" disabled={!searchValue} className="w-full md:w-auto">
              Filtrar
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full md:w-auto bg-transparent"
          >
            Limpar
          </Button>
        </div>
      </div>
    </form>
  );
}