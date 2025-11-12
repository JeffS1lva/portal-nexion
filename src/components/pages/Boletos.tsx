"use client";

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
import { useState, useEffect, useCallback } from "react";
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
    const statusPagamento = statusPagamentoOptions[Math.floor(Math.random() * statusPagamentoOptions.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    // Data atual dinâmica (25/10/2025 às 16:03)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normaliza para meia-noite

    // Gerar dataVencimento até 90 dias antes da data atual, incluindo a data atual
    const maxDaysBefore = 90;
    const daysBeforeVencimento = Math.floor(Math.random() * (maxDaysBefore + 1)); // Inclui 0 para permitir vencimento na data atual
    const vencimentoDate = new Date(currentDate.getTime() - daysBeforeVencimento * 24 * 60 * 60 * 1000);

    // Lógica para gerar dataPagamento
    let dataPagamento = "";
    if (status === "Concluído" || statusPagamento === "Pago") {
      // Data de pagamento até 10 dias antes do vencimento, mas não após a data atual
      const maxDaysBeforeDue = Math.min(10, daysBeforeVencimento);
      const daysBeforeDue = Math.floor(Math.random() * (maxDaysBeforeDue + 1));
      const paymentDate = new Date(vencimentoDate.getTime() - daysBeforeDue * 24 * 60 * 60 * 1000);
      // Garantir que dataPagamento não seja futura
      if (paymentDate <= currentDate) {
        dataPagamento = paymentDate.toISOString().split("T")[0];
      } else {
        dataPagamento = currentDate.toISOString().split("T")[0]; // Fallback para data atual
      }
    } else if (statusPagamento === "Atrasado") {
      // Data de pagamento até 15 dias após o vencimento, mas não após a data atual
      const maxDaysAfterDue = Math.min(15, Math.floor((currentDate.getTime() - vencimentoDate.getTime()) / (24 * 60 * 60 * 1000)));
      const daysAfterDue = maxDaysAfterDue >= 0 ? Math.floor(Math.random() * (maxDaysAfterDue + 1)) : 0;
      const paymentDate = new Date(vencimentoDate.getTime() + daysAfterDue * 24 * 60 * 60 * 1000);
      // Garantir que dataPagamento não seja futura
      if (paymentDate <= currentDate) {
        dataPagamento = paymentDate.toISOString().split("T")[0];
      } else {
        dataPagamento = currentDate.toISOString().split("T")[0]; // Fallback para data atual
      }
    } else if (statusPagamento === "Cancelado" && Math.random() > 0.7) {
      // 30% de chance de ter uma data de pagamento antes do vencimento, mas não após a data atual
      const maxDaysBeforeDue = Math.min(5, daysBeforeVencimento);
      const daysBeforeDue = Math.floor(Math.random() * (maxDaysBeforeDue + 1));
      const paymentDate = new Date(vencimentoDate.getTime() - daysBeforeDue * 24 * 60 * 60 * 1000);
      // Garantir que dataPagamento não seja futura
      if (paymentDate <= currentDate) {
        dataPagamento = paymentDate.toISOString().split("T")[0];
      } else {
        dataPagamento = currentDate.toISOString().split("T")[0]; // Fallback para data atual
      }
    }
    // "Pendente" deixa dataPagamento como vazia ("")

    // Validação final para garantir que dataPagamento não seja futura
    if (dataPagamento) {
      const paymentDate = new Date(dataPagamento);
 paymentDate.setHours(0, 0, 0, 0); // Normaliza para meia-noite
      if (paymentDate > currentDate) {
        console.warn(`Data futura detectada: status=${status}, statusPagamento=${statusPagamento}, dataPagamento=${dataPagamento}, dataVencimento=${vencimentoDate.toISOString().split("T")[0]}`);
        dataPagamento = currentDate.toISOString().split("T")[0];
      }
    }

    return {
      id: i + 1,
      statusPagamento,
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
      dataVencimento: vencimentoDate.toISOString().split("T")[0],
      dataPagamento,
      status,
      filial: filialOptions[Math.floor(Math.random() * filialOptions.length)],
      chaveNFe: `NFe${Math.floor(Math.random() * 100000000000000000)}`.padStart(44, "0"),
      statusNotaFiscal: Math.random() > 0.5 ? "Aprovada" : "Pendente",
      pedidosCompra: produtosOptions[Math.floor(Math.random() * produtosOptions.length)],
      notaFiscal: `NF${String(Math.floor(Math.random() * 10000)).padStart(6, "0")}`,
    };
  });
};

export const Boletos: React.FC = () => {
  const [allParcelas, setAllParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useBoletosColumns() as ColumnDef<Parcela, any>[];

  // Carregar dados fictícios na montagem inicial
  useEffect(() => {
    fetchParcelas();
  }, []);

  const table = useReactTable({
    data: allParcelas,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const fetchParcelas = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula atraso
      const mockData = generateMockParcelas(50);
      console.log(mockData); // Para depuração
      setAllParcelas(mockData);
    } catch (err) {
      setError("error");
      setAllParcelas([]);
    } finally {
      setLoading(false);
    }
  };

  // Manipulador para a busca
  const handleSearch = useCallback((value: string, type: string) => {
    table.getAllColumns().forEach((column) => column.setFilterValue(""));
    if (value && type) {
      const column = table.getColumn(type);
      if (column) column.setFilterValue(value);
    }
    table.setPageIndex(0);
  }, [table]);

  // FILTRO ESPECIAL PARA DATA (Range)
  useEffect(() => {
    const column = table.getColumn("dataVencimento");
    if (!column) return;

    const filterValue = column.getFilterValue();
    if (typeof filterValue === "string" && filterValue.includes("|")) {
      const [start, end] = filterValue.split("|").map(d => new Date(d));
      column.setFilterValue([start, end]);
    }
  }, [table]);

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
            {[...Array(table.getState().pagination.pageSize)].map((_, index) => (
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
      {[...Array(table.getState().pagination.pageSize)].map((_, index) => (
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
            const isInativo = parcela.status.toLowerCase() === "inativo";
            const textClass = isInativo ? "text-red-500" : "dark:text-gray-200";
            const currentDate = new Date().toISOString().split("T")[0]; // Data atual como fallback

            return (
              <Card key={row.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Boleto</span>
                      <span className={`text-lg font-semibold ${textClass}`}>
                        #{parcela.codigoBoleto}
                      </span>
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
                      <span className="text-muted-foreground">Data Pagamento:</span>
                      <p className={`font-medium ${isInativo ? "text-red-500" : textClass}`}>
                        {parcela.status.toLowerCase() === "concluído"
                          ? parcela.dataPagamento && !isNaN(new Date(parcela.dataPagamento).getTime())
                            ? format(new Date(parcela.dataPagamento), "dd/MM/yyyy")
                            : format(new Date(currentDate), "dd/MM/yyyy")
                          : parcela.status.toLowerCase() === "pendente"
                          ? "Aguardando pagamento"
                          : parcela.status.toLowerCase() === "inativo"
                          ? "Cancelado"
                          : "Aguardando pagamento"}
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
          currentPage={table.getState().pagination.pageIndex + 1}
          pageCount={table.getPageCount()}
          pageSize={table.getState().pagination.pageSize}
          totalItems={table.getFilteredRowModel().rows.length}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={(size) => table.setPageSize(size)}
          showPageSizeSelector={true}
          showJumpToPage={true}
          showItemsInfo={true}
          pageSizeOptions={[5, 6, 10, 20, 50, 100]}
        />
      </div>
    </div>
  );
};