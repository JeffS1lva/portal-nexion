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
import { Parcela } from "@/types/parcela";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface BoletoFilterProps {
  allParcelas: Parcela[];
  setParcelas: React.Dispatch<React.SetStateAction<Parcela[]>>;
  table: Table<Parcela>;
  onSearch: (value: string, type: FilterType) => void;
}

type FilterType =
  | "codigoBoleto"
  | "nomePN"
  | "cnpj"
  | "numNF"
  | "dataVencimento"
  | "pedidosCompra";

export function BoletoFilter({
  allParcelas,
  setParcelas,
  table,
  onSearch,
}: BoletoFilterProps) {
  const [filterType, setFilterType] = React.useState<FilterType>("codigoBoleto");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    start: null,
    end: null,
  });
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Função para aplicar filtros e chamar onSearch
  const applyFilters = React.useCallback(() => {
    let filteredData = [...allParcelas];

    console.log("=== APLICANDO FILTROS ===");
    console.log("Tipo de filtro:", filterType);
    console.log("Valor de busca:", searchValue);
    console.log("Total de parcelas:", filteredData.length);

    if (filterType === "dataVencimento") {
      if (dateRange.start && dateRange.end) {
        const formattedRange = `${format(dateRange.start, "yyyy-MM-dd")}|${format(
          dateRange.end,
          "yyyy-MM-dd"
        )}`;
        onSearch(formattedRange, filterType);
        filteredData = filteredData.filter((item) => {
          if (!item.dataVencimento) return false;
          const datePart = item.dataVencimento.split("T")[0];
          const [year, month, day] = datePart.split("-").map(Number);
          const itemDate = new Date(Date.UTC(year, month - 1, day));
          return itemDate >= dateRange.start! && itemDate <= dateRange.end!;
        });
      } else {
        onSearch("", filterType);
      }
    } else if (searchValue.trim()) {
      const value = searchValue.toLowerCase().trim();
      onSearch(value, filterType);
      switch (filterType) {
        case "codigoBoleto":
          const numericValue = value.replace(/\D/g, "");
          filteredData = filteredData.filter((item) =>
            item.codigoBoleto.toString().includes(numericValue)
          );
          break;
        case "nomePN":
          filteredData = filteredData.filter((item) =>
            item.nomePN?.toLowerCase().includes(value)
          );
          break;
        case "cnpj":
          const cnpjSearch = value.replace(/[^\d]/g, "");
          filteredData = filteredData.filter((item) =>
            item.cnpj?.replace(/[^\d]/g, "").includes(cnpjSearch)
          );
          break;
        case "numNF":
          filteredData = filteredData.filter((item) =>
            item.numNF?.toLowerCase().includes(value)
          );
          break;
        case "pedidosCompra":
          filteredData = filteredData.filter((item) =>
            item.pedidosCompra?.toLowerCase().includes(value)
          );
          break;
      }
    } else {
      onSearch("", filterType);
    }

    console.log("Resultado final:", filteredData.length, "itens");
    setParcelas(filteredData);
    table.setPageIndex(0);
  }, [allParcelas, filterType, searchValue, dateRange, setParcelas, table, onSearch]);

  // Função para resetar todos os filtros
  const handleReset = () => {
    setSearchValue("");
    setFilterType("codigoBoleto");
    setDateRange({ start: null, end: null });
    setParcelas(allParcelas);
    table.setPageIndex(0);
    onSearch("", "codigoBoleto");
  };

  // Função para aplicar filtro de data
  const handleApplyDateFilter = () => {
    if (dateRange.start && dateRange.end) {
      applyFilters();
      setIsCalendarOpen(false);
    }
  };

  // Efeito principal para aplicar filtros
  React.useEffect(() => {
    if (filterType === "dataVencimento") {
      // Para filtro de data, só aplica se o usuário clicar em "Filtrar"
      return;
    }
    const delayDebounce = setTimeout(() => {
      applyFilters();
    }, searchValue ? 300 : 0);

    return () => clearTimeout(delayDebounce);
  }, [filterType, searchValue, applyFilters]);

  // Handler para mudança de tipo de filtro
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
      case "codigoBoleto":
        return "Buscar por código do boleto...";
      case "pedidosCompra":
        return "Buscar por número do Pedido de Compra...";
      case "nomePN":
        return "Buscar por nome do cliente...";
      case "cnpj":
        return "Buscar por CNPJ...";
      case "numNF":
        return "Buscar por número da NF...";
      case "dataVencimento":
        return "Selecione um período de vencimento";
      default:
        return "Pesquisar...";
    }
  };

  const formatDateSafely = (date: Date | null): string => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="space-y-4 py-2">
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
                      {formatDateSafely(dateRange.start)} -{" "}
                      {formatDateSafely(dateRange.end)}
                    </>
                  ) : (
                    "Selecione o período de vencimento"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.start || undefined,
                    to: dateRange.end || undefined,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      const endDate = new Date(range.to);
                      endDate.setHours(23, 59, 59, 999);
                      setDateRange({
                        start: range.from,
                        end: endDate,
                      });
                    } else {
                      setDateRange({
                        start: range?.from || null,
                        end: range?.to || null,
                      });
                    }
                  }}
                  locale={ptBR}
                  initialFocus
                />
                <div className="p-2 border-t flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDateRange({ start: null, end: null });
                      setIsCalendarOpen(false);
                      onSearch("", filterType);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Limpar
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
              placeholder={getPlaceholder()}
              className="pl-8 w-full"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        )}

        <Select
          value={filterType}
          onValueChange={handleFilterTypeChange}
        >
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
              onClick={handleApplyDateFilter}
              disabled={!dateRange.start || !dateRange.end}
              className="w-full md:w-auto"
            >
              Filtrar
            </Button>
          ) : (
            <Button
              onClick={applyFilters}
              disabled={!searchValue}
              className="w-full md:w-auto"
            >
              Filtrar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full md:w-auto bg-transparent"
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}