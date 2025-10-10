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
import { Skeleton } from "@/components/ui/skeleton";
import { Paginacao } from "../pages/Paginacao";
import { BoletoFilter } from "./FiltersBoletos/BoletosFilter";
import { useState, useEffect } from "react";
import { Parcela } from "../../types/parcela";

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
        statusPagamentoOptions[
          Math.floor(Math.random() * statusPagamentoOptions.length)
        ],
      situacao:
        situacaoOptions[Math.floor(Math.random() * situacaoOptions.length)],
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
      dataVencimento: new Date(
        Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000
      )
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
      chaveNFe: `NFe${Math.floor(Math.random() * 100000000000000000)}`.padStart(
        44,
        "0"
      ),
      statusNotaFiscal: Math.random() > 0.5 ? "Aprovada" : "Pendente",
      pedidosCompra:
        produtosOptions[
          Math.floor(Math.random() * produtosOptions.length)
        ],
    };
  });
};

export const Boletos: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [allParcelas, setAllParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchType] = useState<"codigoPN" | "numNF" | "codigoBoleto">(
    "codigoPN"
  );
  // Estado para controlar o debounce da busca
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");
  // Manter o estado da paginação atual
  const [currentPage, setCurrentPage] = useState<number>(0);


  // Obter as colunas usando o hook com type assertion
  const columns = useBoletosColumns() as ColumnDef<Parcela, any>[];

  // Aplicar debounce ao valor de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300); // Atraso de 300ms para evitar muitas requisições

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Efeito para carregar dados fictícios
  useEffect(() => {
    fetchParcelas(debouncedSearchValue);
  }, [debouncedSearchValue, searchType]);

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
        pageSize: 6,
      },
    },
    // Adicionado para corrigir o problema de paginação
    autoResetPageIndex: false, // Impede o reset da página quando os dados/filtros mudam

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      // Verifica se updater é uma função ou um objeto
      if (typeof updater === "function") {
        const newPaginationState = updater(table.getState().pagination);
        setCurrentPage(newPaginationState.pageIndex);
      } else {
        // Se for um objeto PaginationState direto
        setCurrentPage(updater.pageIndex);
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

  // Função para carregar dados fictícios
  const fetchParcelas = async (searchValue: string = "") => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de rede de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 7000));

      // Gerar dados fictícios
      const mockData = generateMockParcelas(50);

      // Aplicar filtro de busca se houver
      let filteredData = mockData;

      if (searchValue) {
        filteredData = mockData.filter((parcela) => {
          const searchField = parcela[searchType];
          return (
            searchField &&
            searchField
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        });
      }

      // Ordenar por data de vencimento
      filteredData.sort((a, b) => {
        const dateA = a.dataVencimento
          ? new Date(a.dataVencimento).getTime()
          : 0;
        const dateB = b.dataVencimento
          ? new Date(b.dataVencimento).getTime()
          : 0;
        return dateA - dateB;
      });

      setAllParcelas(mockData);
      setParcelas(filteredData);

      if (filteredData.length === 0) {
        setError("empty");
      } else {
        setError(null);
      }
    } catch (err) {
      setError("error");
      setParcelas([]);
      setAllParcelas([]);
    } finally {
      setLoading(false);
    }
  };

  // Modificado para aplicar o filtro sem resetar a página, a menos que seja uma nova busca
  React.useEffect(() => {
    const isNewSearch = searchValue !== debouncedSearchValue;

    if (searchType === "codigoBoleto") {
      const numericValue = searchValue.replace(/\D/g, "");
      table.getColumn(searchType)?.setFilterValue(numericValue);
    } else if (searchType === "codigoPN" || searchType === "numNF") {
      table.getColumn(searchType)?.setFilterValue(searchValue);
    }

    // Só redefina a página se for uma nova busca
    if (isNewSearch && searchValue) {
      setCurrentPage(0);
    }
  }, [searchValue, searchType, table, debouncedSearchValue]);

  

  // Componente de Skeleton para a tabela
  const SkeletonTable = () => {
    const headerGroup = table.getHeaderGroups()[0];
    return (
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader className="dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="dark:border-gray-700 dark:hover:bg-gray-800/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="dark:text-gray-300 dark:font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="dark:bg-gray-900">
            {[...Array(6)].map((_, index) => (
              <TableRow
                key={index}
                className="dark:border-gray-700 dark:hover:bg-gray-800/50"
              >
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

  // Skeleton para o rodapé (paginação e info)
  const SkeletonFooter = () => (
    <div className="flex items-center justify-between dark:text-gray-300">
      <div className="flex-1 mt-3">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-2 ">
        <Skeleton className="h-8 w-64 mb-4" /> {/* Título */}
        <Skeleton className="h-12 w-full mb-4 rounded-md" /> {/* Filtro */}
        <SkeletonTable />
        <SkeletonFooter />
      </div>
    );
  }

  

  

  // Componente de paginação modificado para usar o estado currentPage
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  return (
    <div className="w-full p-2 ">
      <h1 className="text-3xl font-bold dark:text-white">
        Boletos 
      </h1>

      <BoletoFilter
        allParcelas={allParcelas}
        setParcelas={setParcelas}
        table={table}
        onSearch={(value) => {
          setSearchValue(value);
        }}
      />
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader className="dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="dark:border-gray-700 dark:hover:bg-gray-800/50"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="dark:text-gray-300 dark:font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="dark:border-gray-700">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center dark:text-gray-400"
                >
                  Nenhum boleto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between dark:text-gray-300">
        <div className="flex-1 mt-3">
          <Paginacao
            currentPage={currentPage + 1}
            pageCount={table.getPageCount()}
            onPageChange={handlePageChange}
            pageSize={6}
            totalItems={parcelas.length}
            onPageSizeChange={function (_pageSize: number): void {
              // Implementar se necessário
            }}
          />
        </div>
        <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-wider group">
          <div className="relative">
            <span className="bg-gradient-to-r from-sky-900 to-slate-600 dark:from-indigo-600 dark:to-purple-700 text-white px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 font-mono text-sm">
              {parcelas.length}
            </span>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-sky-500 dark:group-hover:text-indigo-300">
              Boleto{parcelas.length !== 1 ? "s" : ""} registrado
              {parcelas.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};