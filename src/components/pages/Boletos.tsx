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
  getExpandedRowModel,
  ExpandedState,
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
import { ChevronDown, ChevronRight, Building2, Package, FileText, Calendar, DollarSign, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

// Função para gerar dados fictícios (mantida igual)
const generateMockParcelas = (count: number = 50): Parcela[] => {
  const statusPagamentoOptions = ["Pago", "Pendente", "Atrasado", "Cancelado"];
  const situacaoOptions = ["Normal", "Urgente", "Bloqueado", "Regular"];
  const statusOptions = ["Ativo", "Inativo", "Processando", "Concluído"];
  const filialOptions = ["001-SAO", "002-RIO", "003-BH", "004-POR", "005-FLO"];
  const nomePNOptions = [
    "TechNova Softwares Ltda", "DigitalFlow Soluções SA", "CodeMaster Desenvolvimento EIRELI",
    "ByteSolutions ME", "SoftPeak Enterprise EPP", "InnoTech & Cia", "DataWave Importadora Digital",
    "CloudForge Atacado Tech", "NetCore Varejo Digital", "AlgoRhythm Licenças Ltda",
  ];
  const produtosOptions = [
    "ERP Enterprise Pro", "CRM Cloud Suite", "Office Productivity Pack", "Database Manager Advanced",
    "Analytics BI Tool", "Security Firewall Software", "DevOps Pipeline Manager", "HR Management System",
    "E-commerce Platform", "Mobile App Builder",
  ];

  return Array.from({ length: count }, (_, i) => {
    const numParcelas = Math.floor(Math.random() * 12) + 1;
    const parcelaAtual = Math.floor(Math.random() * numParcelas) + 1;
    const statusPagamento = statusPagamentoOptions[Math.floor(Math.random() * statusPagamentoOptions.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const maxDaysBefore = 90;
    const daysBeforeVencimento = Math.floor(Math.random() * (maxDaysBefore + 1));
    const vencimentoDate = new Date(currentDate.getTime() - daysBeforeVencimento * 24 * 60 * 60 * 1000);

    let dataPagamento = "";
    if (status === "Concluído" || statusPagamento === "Pago") {
      const maxDaysBeforeDue = Math.min(10, daysBeforeVencimento);
      const daysBeforeDue = Math.floor(Math.random() * (maxDaysBeforeDue + 1));
      const paymentDate = new Date(vencimentoDate.getTime() - daysBeforeDue * 24 * 60 * 60 * 1000);
      if (paymentDate <= currentDate) {
        dataPagamento = paymentDate.toISOString().split("T")[0];
      } else {
        dataPagamento = currentDate.toISOString().split("T")[0];
      }
    } else if (statusPagamento === "Atrasado") {
      const maxDaysAfterDue = Math.min(15, Math.floor((currentDate.getTime() - vencimentoDate.getTime()) / (24 * 60 * 60 * 1000)));
      const daysAfterDue = maxDaysAfterDue >= 0 ? Math.floor(Math.random() * (maxDaysAfterDue + 1)) : 0;
      const paymentDate = new Date(vencimentoDate.getTime() + daysAfterDue * 24 * 60 * 60 * 1000);
      if (paymentDate <= currentDate) {
        dataPagamento = paymentDate.toISOString().split("T")[0];
      } else {
        dataPagamento = currentDate.toISOString().split("T")[0];
      }
    } else if (statusPagamento === "Cancelado" && Math.random() > 0.7) {
      const maxDaysBeforeDue = Math.min(5, daysBeforeVencimento);
      const daysBeforeDue = Math.floor(Math.random() * (maxDaysBeforeDue + 1));
      const paymentDate = new Date(vencimentoDate.getTime() - daysBeforeDue * 24 * 60 * 60 * 1000);
      if (paymentDate <= currentDate) {
        dataPagamento = paymentDate.toISOString().split("T")[0];
      } else {
        dataPagamento = currentDate.toISOString().split("T")[0];
      }
    }

    if (dataPagamento) {
      const paymentDate = new Date(dataPagamento);
      paymentDate.setHours(0, 0, 0, 0);
      if (paymentDate > currentDate) {
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
      cnpj: `${String(Math.floor(Math.random() * 90) + 10)}.${String(Math.floor(Math.random() * 900) + 100)}.${String(Math.floor(Math.random() * 900) + 100)}/0001-${String(Math.floor(Math.random() * 90) + 10)}`,
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
  const [expanded, setExpanded] = useState<ExpandedState>({}); // ← Estado da expansão

  const columns = useBoletosColumns() as ColumnDef<Parcela, any>[];

  const table = useReactTable({
    data: allParcelas,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    initialState: {
      pagination: { pageSize: 8 },
    },
  });

  useEffect(() => {
    fetchParcelas();
  }, []);

  const fetchParcelas = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockData = generateMockParcelas(50);
      setAllParcelas(mockData);
    } catch (err) {
      setError("error");
      setAllParcelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((value: string, type: string) => {
    table.getAllColumns().forEach((column) => column.setFilterValue(""));
    if (value && type) {
      const column = table.getColumn(type);
      if (column) column.setFilterValue(value);
    }
    table.setPageIndex(0);
  }, [table]);

  useEffect(() => {
    const column = table.getColumn("dataVencimento");
    if (!column) return;
    const filterValue = column.getFilterValue();
    if (typeof filterValue === "string" && filterValue.includes("|")) {
      const [start, end] = filterValue.split("|").map(d => new Date(d));
      column.setFilterValue([start, end]);
    }
  }, [table]);

  // Skeleton permanece igual
  const SkeletonTable = () => {
    const headerGroup = table.getHeaderGroups()[0];
    return (
      <div className="hidden md:block rounded-xl border dark:border-gray-700 bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-semibold">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(table.getState().pagination.pageSize)].map((_, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
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

  if (loading) {
    return (
      <div className="w-full p-2 md:p-4 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <SkeletonTable />
        <div className="md:hidden space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-8 w-32" /></CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-4 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Boletos</h1>

      <BoletoFilter table={table} onSearch={handleSearch} />

      {/* Tabela Desktop - Expansão estilo Pedidos */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const parcela = row.original;
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          <div className="flex items-center gap-2">
                            {cell.column.id === "codigoBoleto" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  row.toggleExpanded();
                                }}
                                className="p-1 rounded hover:bg-muted"
                              >
                                {row.getIsExpanded() ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Conteúdo expandido */}
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="p-0 bg-gradient-to-b from-muted/20 to-background">
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-3 gap-8">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-3">
                                  <Building2 className="w-4 h-4" /> Parceiro
                                </h4>
                                <p className="font-medium">{parcela.nomePN}</p>
                                <p className="text-sm text-muted-foreground">
                                  Código: {parcela.codigoPN} • {parcela.filial}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-3">
                                  <Package className="w-4 h-4" /> Produto
                                </h4>
                                <p className="font-medium">{parcela.pedidosCompra || "Não informado"}</p>
                                <p className="text-sm text-muted-foreground">
                                  Parcela: {parcela.parcela}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-3">
                                  <FileText className="w-4 h-4" /> Nota Fiscal
                                </h4>
                                <p className="font-medium">{parcela.numNF}</p>
                                <p className="text-sm text-muted-foreground">
                                  Status: {parcela.statusNotaFiscal}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-6 border-t">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Vencimento</p>
                                  <p className="font-medium">
                                    {format(new Date(parcela.dataVencimento), "dd/MM/yyyy")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Valor</p>
                                  <p className="font-medium">R$ {parcela.valorParcela.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Hash className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Situação</p>
                                  <p className="font-medium">{parcela.situacao}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  Nenhum boleto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile - Cards expansíveis */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const parcela = row.original;
            return (
              <Card
                key={row.id}
                className={cn(
                  "transition-all duration-200 border-2",
                  row.getIsExpanded() ? "ring-2 ring-primary shadow-lg border-primary" : "border-transparent"
                )}
              >
                <CardHeader
                  className="pb-3 cursor-pointer"
                  onClick={() => row.toggleExpanded()}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          row.toggleExpanded();
                        }}
                        className="p-1 rounded hover:bg-muted"
                      >
                        {row.getIsExpanded() ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                      <div>
                        <p className="text-xs text-muted-foreground">Boleto</p>
                        <p className="text-xl font-bold">#{parcela.codigoBoleto}</p>
                      </div>
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

                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <p>
                      <span className="text-muted-foreground">Parceiro:</span>{" "}
                      <span className="font-medium">{parcela.nomePN}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Vencimento:</span>{" "}
                      <span className="font-medium">
                        {format(new Date(parcela.dataVencimento), "dd/MM/yyyy")}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Valor:</span>{" "}
                      <span className="font-medium">R$ {parcela.valorParcela.toFixed(2)}</span>
                    </p>
                  </div>

                  {row.getIsExpanded() && (
                    <div className="pt-4 border-t space-y-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Produto/Serviço</p>
                        <p className="font-medium">{parcela.pedidosCompra || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Nota Fiscal</p>
                        <p className="font-medium">{parcela.numNF}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground text-xs">Filial</p>
                          <p className="font-medium">{parcela.filial}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Situação</p>
                          <p className="font-medium">{parcela.situacao}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Nenhum boleto encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>

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