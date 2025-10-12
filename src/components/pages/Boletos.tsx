import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  VisibilityState,
  ColumnDef,
} from "@tanstack/react-table";
import { useBoletosColumns } from "@/hooks/useBoletosColumns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Paginacao } from "../pages/Paginacao";
import { BoletoFilter } from "./FiltersBoletos/BoletosFilter";
import { useState, useEffect } from "react";
import { Parcela } from "../../types/parcela";
import { format } from "date-fns";

// Função para gerar dados fictícios de boletos compatíveis com a interface Parcela
const generateMockParcelas = (count: number = 50): Parcela[] => {
  const statusPagamentoOptions = ["Pago", "Pendente", "Atrasado", "Cancelado"];
  const situacaoOptions = ["Normal", "Urgente", "Bloqueado", "Regular"];
  const statusOptions = ["Ativo", "Inativo", "Processando", "Concluído"];
  const filialOptions = ["001-SAO", "002-RIO", "003-BH", "004-POR", "005-FLO"];
  const nomePNOptions = [
    "TechNova Softwares Ltda",
    "DigitalFlow Soluções SA",
    "CodeMaster Desenvolvimento EIRELI",
    "ByteSolutions ME",
    "SoftPeak Enterprise EPP",
    "InnoTech & Cia",
    "DataWave Importadora Digital",
    "CloudForge Atacado Tech",
    "NetCore Varejo Digital",
    "AlgoRhythm Licenças Ltda",
  ];
  const produtosOptions = [
    "ERP Enterprise Pro",
    "CRM Cloud Suite",
    "Office Productivity Pack",
    "Database Manager Advanced",
    "Analytics BI Tool",
    "Security Firewall Software",
    "DevOps Pipeline Manager",
    "HR Management System",
    "E-commerce Platform",
    "Mobile App Builder",
  ];

  return Array.from({ length: count }, (_, i) => {
    const numParcelas = Math.floor(Math.random() * 12) + 1;
    const parcelaAtual = Math.floor(Math.random() * numParcelas) + 1;

    return {
      id: i + 1,
      statusPagamento:
        statusPagamentoOptions[Math.floor(Math.random() * statusPagamentoOptions.length)],
      situacao: situacaoOptions[Math.floor(Math.random() * situacaoOptions.length)],
      codigoBoleto: Math.floor(Math.random() * 1000000) + 100000,
      codigoPN: `PN${String(i + 1).padStart(4, "0")}`,
      nomePN: nomePNOptions[Math.floor(Math.random() * nomePNOptions.length)],
      cnpj: `${String(Math.floor(Math.random() * 90) + 10)}.${String(
        Math.floor(Math.random() * 900) + 100
      )}.${String(Math.floor(Math.random() * 900) + 100)}/0001-${String(
        Math.floor(Math.random() * 90) + 10
      )}`,
      numNF: `NF${String(Math.floor(Math.random() * 10000)).padStart(6, "0")}`,
      parcela: `${parcelaAtual}/${numParcelas}`,
      valorParcela: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
      dataVencimento: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      dataPagamento:
        Math.random() > 0.7
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : "",
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      filial: filialOptions[Math.floor(Math.random() * filialOptions.length)],
      chaveNFe: `NFe${Math.floor(Math.random() * 100000000000000000)}`.padStart(44, "0"),
      statusNotaFiscal: Math.random() > 0.5 ? "Aprovada" : "Pendente",
      pedidosCompra: produtosOptions[Math.floor(Math.random() * produtosOptions.length)],
    };
  });
};

export const Boletos: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [allParcelas, setAllParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(6);

  const columns = useBoletosColumns() as ColumnDef<Parcela, any>[];

  // Carregar dados fictícios na montagem inicial
  useEffect(() => {
    fetchParcelas();
  }, []);

  const table = useReactTable({
    data: parcelas,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPaginationState = updater(table.getState().pagination);
        setCurrentPage(newPaginationState.pageIndex);
        setPageSize(newPaginationState.pageSize);
      } else {
        setCurrentPage(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  const fetchParcelas = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula atraso
      const mockData = generateMockParcelas(50);
      setAllParcelas(mockData);
      setParcelas(mockData);
    } catch (err) {
      setError("error");
      setParcelas([]);
      setAllParcelas([]);
    } finally {
      setLoading(false);
    }
  };

  // Manipulador para a busca
  const handleSearch = (value: string, type: string) => {
    if (!value) {
      setParcelas(allParcelas);
      table.setPageIndex(0);
      return;
    }

    let filteredData = [...allParcelas];
    if (type === "dataVencimento") {
      const [start, end] = value.split("|").map((date) => new Date(date));
      filteredData = filteredData.filter((item) => {
        if (!item.dataVencimento) return false;
        const itemDate = new Date(item.dataVencimento.split("T")[0]);
        return itemDate >= start && itemDate <= end;
      });
    } else {
      const lowerValue = value.toLowerCase();
      filteredData = filteredData.filter((item) => {
        const field = item[type as keyof Parcela];
        if (!field) return false;
        if (type === "codigoBoleto") {
          const numericValue = lowerValue.replace(/\D/g, "");
          return field.toString().includes(numericValue);
        }
        return field.toString().toLowerCase().includes(lowerValue);
      });
    }

    setParcelas(filteredData);
    table.setPageIndex(0);
  };

  // Skeleton para tabela (desktop)
  const SkeletonTable = () => {
    const headerGroup = table.getHeaderGroups()[0];
    return (
      <div className="hidden md:block rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader className="dark:bg-gray-800">
            <TableRow className="dark:border-gray-700 dark:hover:bg-gray-800/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="dark:text-gray-300 dark:font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="dark:bg-gray-900">
            {[...Array(pageSize)].map((_, index) => (
              <TableRow key={index} className="dark:border-gray-700 dark:hover:bg-gray-800/50">
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} className="dark:text-gray-200">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Skeleton para cards (mobile)
  const SkeletonCards = () => (
    <div className="md:hidden space-y-4">
      {[...Array(pageSize)].map((_, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t text-xs">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Skeleton para paginação
  const SkeletonPagination = () => (
    <div className="flex items-center justify-center md:justify-between space-x-2 py-4 px-2">
      <Skeleton className="h-8 w-64" />
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-2 md:p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-full mb-4 rounded-md" />
        <SkeletonTable />
        <SkeletonCards />
        <SkeletonPagination />
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">Boletos</h1>

      <BoletoFilter
        allParcelas={allParcelas}
        setParcelas={setParcelas}
        table={table}
        onSearch={handleSearch}
      />

      {/* Tabela para desktop */}
      <div className="hidden md:block rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader className="dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="dark:border-gray-700 dark:hover:bg-gray-800/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="dark:text-gray-300 dark:font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="dark:bg-gray-900">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="dark:border-gray-700 dark:hover:bg-gray-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="dark:text-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="dark:border-gray-700">
                <TableCell colSpan={columns.length} className="h-24 text-center dark:text-gray-400">
                  Nenhum boleto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards para mobile */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const parcela = row.original as Parcela;
            return (
              <Card key={row.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Boleto</span>
                      <span className="text-lg font-semibold">#{parcela.codigoBoleto}</span>
                    </div>
                    <Badge
                      variant={
                        parcela.statusPagamento === "Pago"
                          ? "default"
                          : parcela.statusPagamento === "Pendente"
                          ? "secondary"
                          : parcela.statusPagamento === "Atrasado"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {parcela.statusPagamento}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Parceiro:</span>
                      <p className="font-medium truncate">{parcela.nomePN}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Código PN:</span>
                      <p className="font-medium">{parcela.codigoPN}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vencimento:</span>
                      <p className="font-medium">
                        {format(new Date(parcela.dataVencimento), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <p className="font-medium">R$ {parcela.valorParcela.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nota Fiscal:</span>
                      <p className="font-medium">{parcela.numNF}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status NF:</span>
                      <Badge
                        variant={parcela.statusNotaFiscal === "Aprovada" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {parcela.statusNotaFiscal}
                      </Badge>
                    </div>
                  </div>
                  {parcela.pedidosCompra && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground text-sm">Produto:</span>
                      <p className="font-medium text-sm">{parcela.pedidosCompra}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                    <span>Filial: {parcela.filial}</span>
                    <span>Situação: {parcela.situacao}</span>
                    <span>Status: {parcela.status}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">Nenhum boleto encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-center md:justify-between space-x-2 py-4 px-2">
        <Paginacao
          currentPage={currentPage + 1}
          pageCount={table.getPageCount()}
          pageSize={pageSize}
          totalItems={table.getFilteredRowModel().rows.length}
          onPageChange={(page) => setCurrentPage(page - 1)}
          onPageSizeChange={setPageSize}
          showPageSizeSelector={true}
          showJumpToPage={true}
          showItemsInfo={true}
          pageSizeOptions={[5, 6, 10, 20, 50, 100]}
        />
      </div>
    </div>
  );
};